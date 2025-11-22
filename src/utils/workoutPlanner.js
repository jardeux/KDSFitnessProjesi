import { resolveHypertrophyAlias } from '../data/hypertrophyLibrary';

const TURKISH_WEEK_DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

const defaultFocus = ['Tam Vücut', 'Kondisyon', 'Mobilite'];

const defaultHypertrophyPattern = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];

const pickExercisesForDay = (exercises, offset, perDay) => {
  if (!exercises.length) return [];

  return Array.from({ length: perDay }, (_, index) => {
    const pickIndex = (offset + index) % exercises.length;
    return exercises[pickIndex];
  });
};

const normalizeIntensity = (intensity = '') => {
  const value = intensity.toLowerCase();
  if (value.includes('yüksek')) return 'high';
  if (value.includes('düşük')) return 'low';
  return 'medium';
};

const schemeMatrix = {
  beginner: {
    low: { sets: 2, reps: '12-15', tempo: '2-1-2' },
    medium: { sets: 3, reps: '10-12', tempo: '3-1-1' },
    high: { sets: 4, reps: '45 sn / 15 sn', tempo: '1-1' },
  },
  intermediate: {
    low: { sets: 3, reps: '12-15', tempo: '2-1-2' },
    medium: { sets: 4, reps: '8-12', tempo: '2-1-1' },
    high: { sets: 5, reps: '60 sn / 20 sn', tempo: '1-0-1' },
  },
  advanced: {
    low: { sets: 3, reps: '15-20', tempo: '3-1-3' },
    medium: { sets: 5, reps: '8-10', tempo: '2-0-1' },
    high: { sets: 6, reps: '90 sn / 30 sn', tempo: '1-0-1' },
  },
};

const volumeMatrix = {
  beginner: { low: 3, medium: 4, high: 5 },
  intermediate: { low: 4, medium: 5, high: 6 },
  advanced: { low: 4, medium: 6, high: 7 },
};

const adjustForTarget = (scheme, target = '') => {
  const lowerTarget = (target || '').toLowerCase();
  if (lowerTarget.includes('conditioning') || lowerTarget.includes('cardio') || lowerTarget.includes('aerobic')) {
    return {
      ...scheme,
      reps: scheme.reps.includes('sn') ? scheme.reps : '40 sn / 20 sn',
      tempo: '1-1',
    };
  }

  if (lowerTarget.includes('flex') || lowerTarget.includes('mobility') || lowerTarget.includes('stretch')) {
    return {
      ...scheme,
      reps: '45 sn poz',
      tempo: '4-2-4',
    };
  }

  return scheme;
};

const prescribeScheme = (intensity, experience = 'beginner', target) => {
  const normalizedIntensity = normalizeIntensity(intensity);
  const matrix = schemeMatrix[experience] || schemeMatrix.beginner;
  const baseScheme = matrix[normalizedIntensity] || matrix.medium;
  return adjustForTarget(baseScheme, target);
};

/**
 * Creates a weekly plan by distributing fetched exercises across the user's available days.
 *
 * @param {{exercises: Array, availability: number, focusTags?: string[], intensity?: string, experience?: string, preferredTargets?: string[]}} params
 * @returns {Array<{day: string, focus: string, intensity: string, exercises: Array}>}
 */
export const generateWeeklyPlan = ({
  exercises = [],
  availability = 3,
  focusTags = defaultFocus,
  intensity = 'Orta',
  experience = 'beginner',
  preferredTargets = [],
  template = null,
}) => {
  if (!exercises?.length && !template) return [];

  if (template?.days?.length) {
    const dayCount = Math.max(1, availability || template.days.length);
    const exercisePool = new Map();
    exercises.forEach((item) => {
      // targetMuscles array'inden veya target string'inden key al
      const primaryTarget = item.targetMuscles?.[0] || item.target || item.bodyPart || 'genel';
      const key = primaryTarget.toLowerCase();
      const list = exercisePool.get(key) || [];
      list.push(item);
      exercisePool.set(key, list);
      
      // targetMuscles array'indeki diğer kasları da pool'a ekle (daha iyi eşleşme için)
      if (Array.isArray(item.targetMuscles) && item.targetMuscles.length > 1) {
        item.targetMuscles.slice(1).forEach((muscle) => {
          const altKey = muscle.toLowerCase();
          const altList = exercisePool.get(altKey) || [];
          altList.push(item);
          exercisePool.set(altKey, altList);
        });
      }
    });

    const pickFromPool = (targetKey) => {
      if (!targetKey) return null;
      const key = targetKey.toLowerCase();
      const list = exercisePool.get(key);
      if (list?.length) {
        return list.shift();
      }
      
      // Eğer doğrudan eşleşme yoksa, targetMuscles array'inde ara
      for (const poolList of exercisePool.values()) {
        if (poolList.length > 0) {
          const exercise = poolList[0];
          const matches = exercise.targetMuscles?.some(
            (muscle) => muscle.toLowerCase() === key
          ) || exercise.target?.toLowerCase() === key || exercise.bodyPart?.toLowerCase() === key;
          
          if (matches) {
            return poolList.shift();
          }
        }
      }
      
      return null;
    };

    return Array.from({ length: dayCount }).map((_, dayIndex) => {
      const templateDay = template.days[dayIndex % template.days.length];

      const dayExercises = templateDay.exercises.map((templateExercise, slotIndex) => {
        const matched = pickFromPool(templateExercise.aliasKey || templateExercise.target);
        const aliased = resolveHypertrophyAlias(
          matched || {
            name: templateExercise.name,
            target: templateExercise.aliasKey,
            bodyPart: templateExercise.aliasKey,
          },
          templateExercise.aliasKey,
        );

        // ExerciseDB'den gelen gifUrl'i öncelikli kullan
        const exerciseGifUrl = matched?.gifUrl || aliased.gifUrl || templateExercise.gifUrl || '';
        
        return {
          id: `${dayIndex}-${slotIndex}-${aliased.name}`,
          name: templateExercise.name || aliased.name,
          target: aliased.target || templateExercise.aliasKey,
          equipment: aliased.equipment || matched?.equipment || 'Serbest',
          secondaryMuscles: aliased.secondaryMuscles || [],
          gifUrl: exerciseGifUrl,
          sets: templateExercise.sets,
          reps: templateExercise.reps,
          tempo: templateExercise.tempo || '',
          notes: templateExercise.notes || '',
        };
      });

      return {
        day: templateDay.label
          ? `${templateDay.label}${dayIndex >= template.days.length ? ` (Tekrar ${Math.floor(dayIndex / template.days.length) + 1})` : ''}`
          : TURKISH_WEEK_DAYS[dayIndex] || `Gün ${dayIndex + 1}`,
        focus:
          templateDay.focus ||
          focusTags[dayIndex % focusTags.length] ||
          defaultFocus[dayIndex % defaultFocus.length],
        intensity: templateDay.intensity || intensity,
        exercises: dayExercises,
      };
    });
  }

  const days = TURKISH_WEEK_DAYS.slice(0, Math.min(availability, TURKISH_WEEK_DAYS.length));
  if (!days.length) return [];

  const normalizedIntensity = normalizeIntensity(intensity);
  const desiredVolume =
    volumeMatrix[experience]?.[normalizedIntensity] ??
    volumeMatrix.beginner.medium;
  const availableVolume = Math.max(
    3,
    Math.floor(exercises.length / days.length) || 3,
  );
  const perDay = Math.max(
    3,
    Math.min(desiredVolume, availableVolume),
  );

  const pattern = preferredTargets?.length ? preferredTargets : defaultHypertrophyPattern;

  const selectPreferredKey = (dayIndex, slotIndex) => {
    if (!pattern.length) return undefined;
    const baseIndex = dayIndex * perDay + slotIndex;
    return pattern[baseIndex % pattern.length];
  };

  return days.map((day, dayIndex) => {
    const focus = focusTags[dayIndex % focusTags.length] || defaultFocus[dayIndex % defaultFocus.length];
    const dayExercises = pickExercisesForDay(exercises, dayIndex * perDay, perDay).map((rawItem, slotIndex) => {
      const preferredKey = selectPreferredKey(dayIndex, slotIndex);
      const aliased = resolveHypertrophyAlias(rawItem, preferredKey);
      const prescription = prescribeScheme(intensity, experience, aliased.target);

      // ExerciseDB'den gelen gifUrl'i öncelikli kullan
      const exerciseGifUrl = rawItem?.gifUrl || aliased.gifUrl || '';
      
      return {
        id: aliased.id || aliased.uuid || `${aliased.name}-${dayIndex}-${slotIndex}`,
        name: aliased.name || 'Bilinmeyen Egzersiz',
        target: aliased.target || aliased.bodyPart || 'genel',
        equipment: aliased.equipment || 'vücut ağırlığı',
        secondaryMuscles: aliased.secondaryMuscles || [],
        gifUrl: exerciseGifUrl,
        sets: prescription.sets,
        reps: prescription.reps,
        tempo: prescription.tempo,
      };
    });

    return {
      day,
      focus,
      intensity,
      exercises: dayExercises,
    };
  });
};



