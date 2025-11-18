import { create } from 'zustand';
import {
  deriveWeightsFromRatings,
  rankAlternatives,
} from '../utils/ahpLogic';
import { buildRegressionPlan } from '../utils/regressionLogic';
import { fetchExercises } from '../services/exerciseService';
import { generateWeeklyPlan } from '../utils/workoutPlanner';
import { SPLIT_TEMPLATES } from '../data/splitTemplates';

export const CRITERIA = ['Kas Kazanımı', 'Yağ Kaybı', 'Dayanıklılık'];

const PROGRAM_CONFIG = {
  'Yüksek Yoğunluklu Kardiyo': {
    filter: 'cardio',
    mode: 'target',
    focusTags: ['Metabolik HIIT', 'VO₂ Maks', 'Aktif Toparlanma'],
    intensity: 'Yüksek',
    hypertrophyTargets: ['conditioning', 'legs', 'core', 'legs', 'conditioning'],
    filters: [
      { filter: 'cardio', mode: 'target' },
      { filter: 'lower legs', mode: 'bodyPart' },
      { filter: 'upper arms', mode: 'bodyPart' },
    ],
  },
  'Ağır Ağırlık Antrenmanı': {
    filter: 'upper legs',
    mode: 'bodyPart',
    focusTags: ['Güç', 'Hacim', 'Core Aktivasyonu'],
    intensity: 'Yüksek',
    hypertrophyTargets: ['chest', 'back', 'legs', 'shoulders', 'arms'],
    filters: [
      { filter: 'upper legs', mode: 'bodyPart' },
      { filter: 'chest', mode: 'bodyPart' },
      { filter: 'back', mode: 'bodyPart' },
    ],
  },
  'Yoga / Mobilite': {
    filter: 'waist',
    mode: 'bodyPart',
    focusTags: ['Esneklik', 'Mobilite', 'Nefes'],
    intensity: 'Düşük-Orta',
    hypertrophyTargets: ['core', 'legs', 'shoulders', 'core'],
    filters: [
      { filter: 'waist', mode: 'bodyPart' },
      { filter: 'lower arms', mode: 'bodyPart' },
      { filter: 'neck', mode: 'bodyPart' },
    ],
  },
  Kalisthenik: {
    filter: 'chest',
    mode: 'bodyPart',
    focusTags: ['Vücut Ağırlığı', 'Çekiş & İtiş', 'Core'],
    intensity: 'Orta',
    hypertrophyTargets: ['chest', 'back', 'core', 'arms', 'legs'],
    filters: [
      { filter: 'chest', mode: 'bodyPart' },
      { filter: 'upper legs', mode: 'bodyPart' },
      { filter: 'upper arms', mode: 'bodyPart' },
    ],
  },
  default: {
    filter: 'cardio',
    mode: 'target',
    focusTags: ['Tam Vücut', 'Kondisyon'],
    intensity: 'Orta',
    hypertrophyTargets: ['conditioning', 'legs', 'chest'],
    filters: [
      { filter: 'cardio', mode: 'target' },
      { filter: 'upper body', mode: 'target' },
    ],
  },
};

const ALTERNATIVE_MATRIX = {
  'Yüksek Yoğunluklu Kardiyo': [0.25, 0.8, 0.85],
  'Ağır Ağırlık Antrenmanı': [0.9, 0.3, 0.4],
  'Yoga / Mobilite': [0.35, 0.4, 0.75],
  Kalisthenik: [0.7, 0.55, 0.65],
};

const defaultRatings = {
  'Kas Kazanımı': 7,
  'Yağ Kaybı': 5,
  Dayanıklılık: 6,
};

const defaultProfile = {
  age: '',
  weight: '',
  height: '',
  experience: 'beginner',
  availability: 3,
  splitStyle: 'ppl',
};

export const useFitnessStore = create((set, get) => ({
  profile: { ...defaultProfile },
  criteriaRatings: { ...defaultRatings },
  ahpResult: null,
  regressionResult: null,
  recommendation: null,
  programMeta: null,
  workoutPlan: [],
  errors: null,
  isProcessing: false,

  setProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),

  setCriteriaRating: (criterion, value) =>
    set((state) => ({
      criteriaRatings: { ...state.criteriaRatings, [criterion]: value },
    })),

  reset: () =>
    set({
      profile: { ...defaultProfile },
      criteriaRatings: { ...defaultRatings },
      ahpResult: null,
      regressionResult: null,
      recommendation: null,
      programMeta: null,
      workoutPlan: [],
      errors: null,
      isProcessing: false,
    }),

  runDecisionEngine: async () => {
    const { profile, criteriaRatings } = get();
    set({ isProcessing: true, errors: null });

    try {
      const ratings = CRITERIA.map((criterion) => criteriaRatings[criterion] || 1);
      const ahpResult = deriveWeightsFromRatings(ratings);

      const { ranking, best } = rankAlternatives(
        ahpResult.weights,
        ALTERNATIVE_MATRIX,
      );

      const normalizedBestName = best?.name?.toLowerCase() || '';
      const regressionResult = buildRegressionPlan({
        weight: Number(profile.weight) || 75,
        availability: Number(profile.availability) || 3,
        experience: profile.experience,
        goal: normalizedBestName.includes('kardiyo') ? 'fat-loss' : 'muscle',
      });

      const programConfig = PROGRAM_CONFIG[best?.name] || PROGRAM_CONFIG.default;
      const splitTemplate = SPLIT_TEMPLATES[profile.splitStyle] || null;
      const desiredDays = Number(profile.availability) || splitTemplate?.days?.length || 3;

      const exercises = await fetchExercises({
        filter: programConfig.filter,
        mode: programConfig.mode,
        filters: splitTemplate?.apiFilters || programConfig.filters,
        limit: Math.max(
          20,
          (splitTemplate?.days?.reduce((sum, day) => sum + (day.exercises?.length || 0), 0) || 0) * 2,
          desiredDays * 5 || 15,
        ),
      });

      const workoutPlan = generateWeeklyPlan({
        exercises,
        availability: desiredDays,
        focusTags: splitTemplate?.focusTags || programConfig.focusTags,
        intensity: splitTemplate?.intensity || programConfig.intensity,
        experience: profile.experience,
        preferredTargets: splitTemplate?.preferredTargets || programConfig.hypertrophyTargets,
        template: splitTemplate,
      });

      set({
        ahpResult: { ...ahpResult, ranking },
        regressionResult,
        recommendation: best,
        programMeta: {
          ...programConfig,
          split: splitTemplate?.name,
          splitStyle: profile.splitStyle,
        },
        workoutPlan,
        errors: null,
        isProcessing: false,
      });
    } catch (error) {
      console.error('Decision engine error', error);
      set({ errors: error.message, isProcessing: false });
    }
  },
}));

