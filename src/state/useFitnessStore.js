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

// Program türüne göre genel ayarlar (AHP sonucu burayı seçer)
// Ancak Split (Bölünme) artık buradan değil, gün sayısından gelecek.
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

const determineRegressionGoal = (programName = '') =>
  programName.toLowerCase().includes('kardiyo') ? 'fat-loss' : 'muscle';

// --- KRİTİK FONKSİYON: Programı ve Hareketleri Oluşturur ---
const buildProgramArtifacts = async (programName = 'default', profile = {}) => {
  const programConfig = PROGRAM_CONFIG[programName] || PROGRAM_CONFIG.default;

  // GÜNCELLENEN KISIM 1: Şablonu "Program Adı"ndan değil, "GÜN SAYISI"ndan seçiyoruz.
  const desiredDays = Number(profile.availability) || 3;
  // Gün sayısını 2 ile 6 arasına sabitliyoruz (güvenlik)
  const safeDays = Math.max(2, Math.min(6, desiredDays));
  
  // splitTemplates.js dosyasındaki ilgili numaralı şablonu al
  const splitTemplate = SPLIT_TEMPLATES[safeDays];

  // GÜNCELLENEN KISIM 2: Limit 1000 yapıldı.
  // Böylece tüm hareket havuzunu çekiyoruz ki workoutPlanner içinden rastgele seçebilsin.
  const exercises = await fetchExercises({
    filter: programConfig.filter,
    mode: programConfig.mode,
    filters: splitTemplate?.apiFilters || programConfig.filters,
    limit: 1000, 
  });

  const workoutPlan = generateWeeklyPlan({
    exercises,
    availability: safeDays, // Hesaplanan gün sayısını kullan
    focusTags: splitTemplate?.focusTags || programConfig.focusTags,
    intensity: splitTemplate?.intensity || programConfig.intensity,
    experience: profile.experience,
    template: splitTemplate, // Gün bazlı şablonu gönder
  });

  const regressionResult = buildRegressionPlan({
    weight: Number(profile.weight) || 75,
    availability: safeDays,
    experience: profile.experience,
    goal: determineRegressionGoal(programName),
  });

  return {
    regressionResult,
    programMeta: {
      ...programConfig,
      split: splitTemplate?.name,
      splitStyle: `DaySplit-${safeDays}`,
    },
    workoutPlan,
  };
};

const ALTERNATIVE_MATRIX = {
  'Yüksek Yoğunluklu Kardiyo': [0.25, 0.8, 0.85],
  'Ağır Ağırlık Antrenmanı': [0.9, 0.3, 0.4],
  'Yoga / Mobilite': [0.35, 0.4, 0.75],
  Kalisthenik: [0.7, 0.55, 0.65],
};

const defaultRatings = {
  'Kas Kazanımı': 9,
  'Yağ Kaybı': 2,
  Dayanıklılık: 2,
};

const defaultProfile = {
  age: '',
  weight: '',
  height: '',
  experience: 'beginner',
  availability: 3,
};

export const useFitnessStore = create((set, get) => ({
  profile: { ...defaultProfile },
  criteriaRatings: { ...defaultRatings },
  selectedGoal: 'Kas Kazanımı',
  ahpResult: null,
  regressionResult: null,
  recommendation: null,
  programMeta: null,
  workoutPlan: [],
  selectedProgram: null,
  errors: null,
  isProcessing: false,

  setProfile: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
    })),

  // Manuel ayar fonksiyonu
  setCriteriaRating: (criterion, value) =>
    set((state) => ({
      criteriaRatings: { ...state.criteriaRatings, [criterion]: value },
    })),

  // GÜNCELLENEN KISIM 3: Hedef seçimine göre özel puanlama mantığı
  setPrimaryGoal: (goal) => {
    const selectedScore = 9; 
    const defaultLowScore = 2;
    
    const newRatings = {};
    CRITERIA.forEach((c) => {
      if (c === goal) {
        // Seçilen hedef her zaman 9 puan
        newRatings[c] = selectedScore;
      } else if (goal === 'Dayanıklılık' && c === 'Kas Kazanımı') {
        // İSTEK: Dayanıklılık seçilirse, Kas Kazanımı 4 olsun
        newRatings[c] = 4;
      } else {
        // Diğer durumlar için varsayılan düşük puan (2)
        newRatings[c] = defaultLowScore;
      }
    });

    set({ 
      selectedGoal: goal,
      criteriaRatings: newRatings 
    });
  },

  reset: () =>
    set({
      profile: { ...defaultProfile },
      criteriaRatings: { ...defaultRatings },
      selectedGoal: 'Kas Kazanımı',
      ahpResult: null,
      regressionResult: null,
      recommendation: null,
      programMeta: null,
      workoutPlan: [],
      selectedProgram: null,
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

      const fallback = ranking?.[0];
      const chosen = best || fallback;
      if (!chosen) {
        throw new Error('Geçerli bir program alternatifi bulunamadı.');
      }

      const artifacts = await buildProgramArtifacts(chosen.name, profile);

      set({
        ahpResult: { ...ahpResult, ranking },
        regressionResult: artifacts.regressionResult,
        recommendation: chosen,
        programMeta: artifacts.programMeta,
        workoutPlan: artifacts.workoutPlan,
        selectedProgram: chosen.name,
        errors: null,
        isProcessing: false,
      });
    } catch (error) {
      console.error('Decision engine error', error);
      set({ errors: error.message, isProcessing: false });
    }
  },

  selectProgram: async (programName) => {
    const { ahpResult, profile, recommendation } = get();
    if (!ahpResult?.ranking?.length || !programName || recommendation?.name === programName) {
      return;
    }

    set({ isProcessing: true, errors: null });

    try {
      const candidate =
        ahpResult.ranking.find((alt) => alt.name === programName) || ahpResult.ranking[0];

      if (!candidate) {
        throw new Error('Seçilecek program bulunamadı.');
      }

      const artifacts = await buildProgramArtifacts(candidate.name, profile);

      set({
        recommendation: candidate,
        selectedProgram: candidate.name,
        regressionResult: artifacts.regressionResult,
        programMeta: artifacts.programMeta,
        workoutPlan: artifacts.workoutPlan,
        errors: null,
        isProcessing: false,
      });
    } catch (error) {
      console.error('Program selection error', error);
      set({ errors: error.message, isProcessing: false });
    }
  },
}));