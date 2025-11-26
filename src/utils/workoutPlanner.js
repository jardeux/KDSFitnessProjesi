const TURKISH_WEEK_DAYS = [
  'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar',
];

const defaultFocus = ['Tam Vücut', 'Kondisyon', 'Mobilite'];

// --- HAVUZ ANAHTARLARI ---
const POOL_KEYS = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  LEGS: 'legs',
  QUADS: 'quads',
  HAMSTRINGS: 'hamstrings',
  GLUTES: 'glutes',
  CALVES: 'calves',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  CORE: 'core',
  REAR_DELTS: 'rear_delts',
  FOREARMS: 'forearms'
};

// --- ACİL DURUM YEDEKLERİ ---
const EMERGENCY_BACKUPS = {
  [POOL_KEYS.CHEST]: { name: 'Push-Up', target: 'pectorals', bodyPart: 'chest' },
  [POOL_KEYS.BACK]: { name: 'Pull-Up', target: 'lats', bodyPart: 'back' },
  [POOL_KEYS.SHOULDERS]: { name: 'Pike Push-Up', target: 'delts', bodyPart: 'shoulders' },
  [POOL_KEYS.BICEPS]: { name: 'Dumbbell Curl', target: 'biceps', bodyPart: 'arms' },
  [POOL_KEYS.TRICEPS]: { name: 'Diamond Push-Up', target: 'triceps', bodyPart: 'arms' },
  [POOL_KEYS.LEGS]: { name: 'Bodyweight Squat', target: 'legs', bodyPart: 'legs' },
  [POOL_KEYS.QUADS]: { name: 'Lunges', target: 'quads', bodyPart: 'legs' },
  [POOL_KEYS.HAMSTRINGS]: { name: 'Glute Bridge', target: 'hamstrings', bodyPart: 'legs' },
  [POOL_KEYS.GLUTES]: { name: 'Hip Thrust', target: 'glutes', bodyPart: 'legs' },
  [POOL_KEYS.CALVES]: { name: 'Calf Raise', target: 'calves', bodyPart: 'legs' },
  [POOL_KEYS.CORE]: { name: 'Plank', target: 'abs', bodyPart: 'waist' },
  [POOL_KEYS.FOREARMS]: { name: 'Wrist Curl', target: 'forearms', bodyPart: 'arms' },
  [POOL_KEYS.REAR_DELTS]: { name: 'Reverse Fly', target: 'rear delts', bodyPart: 'shoulders' }
};

// --- KARIŞTIRMA ---
const shuffleArray = (array) => {
  if (!array || array.length === 0) return [];
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// --- YOĞUNLUK AYARLARI ---
const prescribeScheme = (intensity, experience = 'beginner', target) => {
  let normalizedIntensity = 'medium';
  if ((intensity || '').toLowerCase().includes('yüksek')) normalizedIntensity = 'high';
  
  const matrix = {
    beginner: {
      low: { sets: 2, reps: '12-15', tempo: '2-1-2' },
      medium: { sets: 3, reps: '10-12', tempo: '3-1-1' },
      high: { sets: 4, reps: '8-10', tempo: '2-0-1' },
    },
    intermediate: {
      low: { sets: 3, reps: '12-15', tempo: '2-1-2' },
      medium: { sets: 4, reps: '8-12', tempo: '2-1-1' },
      high: { sets: 5, reps: '6-10', tempo: '2-0-1' },
    },
    advanced: {
      low: { sets: 3, reps: '15-20', tempo: '3-1-3' },
      medium: { sets: 5, reps: '8-10', tempo: '2-0-1' },
      high: { sets: 6, reps: '6-8', tempo: '3-0-1' },
    }
  };

  const baseScheme = (matrix[experience] || matrix.beginner)[normalizedIntensity];
  
  if ([POOL_KEYS.CORE, POOL_KEYS.CALVES, POOL_KEYS.FOREARMS].includes(target)) {
     return { ...baseScheme, reps: '15-20', tempo: '1-1' };
  }
  return baseScheme;
};

// --- HAREKET KATEGORİZASYONU ---
const categorizeExercises = (exercises) => {
  const pools = Object.values(POOL_KEYS).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  if (!exercises || exercises.length === 0) return pools;

  exercises.forEach(e => {
    const name = (e.name || '').toLowerCase();
    const target = (e.target || '').toLowerCase();
    const bodyPart = (e.bodyPart || '').toLowerCase();
    const allMuscles = (e.targetMuscles || []).map(m => m.toLowerCase()).join(' ');
    const fullText = `${name} ${target} ${bodyPart} ${allMuscles}`;

    const has = (...keywords) => keywords.some(kw => fullText.includes(kw));

    // GÖĞÜS
    if (has('chest', 'pectoral', 'bench press', 'fly', 'press-up', 'push-up', 'push up')) {
      if (!has('incline', 'decline') || has('flat', 'barbell bench')) {
        pools[POOL_KEYS.CHEST].push(e);
      }
    }

    // SIRT
    if (has('back', 'lat', 'row', 'pull-up', 'pulldown', 'pull up', 'deadlift')) {
      pools[POOL_KEYS.BACK].push(e);
    }

    // OMUZ
    if (has('rear delt', 'face pull', 'reverse fly')) {
      pools[POOL_KEYS.REAR_DELTS].push(e);
    } else if (has('shoulder', 'delt', 'press', 'raise', 'arnold', 'overhead', 'military')) {
      pools[POOL_KEYS.SHOULDERS].push(e);
    }

    // BICEPS
    if ((has('bicep', 'curl') || name.includes('curl')) && !has('leg', 'wrist', 'tricep')) {
      pools[POOL_KEYS.BICEPS].push(e);
    }

    // TRICEPS
    if (has('tricep', 'pushdown', 'extension', 'skull', 'dip', 'close-grip') && !has('leg')) {
      pools[POOL_KEYS.TRICEPS].push(e);
    }

    // FOREARMS
    if (has('forearm', 'wrist', 'grip')) {
      pools[POOL_KEYS.FOREARMS].push(e);
    }

    // BACAKLAR
    const isLeg = has('leg', 'squat', 'lunge', 'deadlift', 'press') || bodyPart.includes('leg');
    if (isLeg) {
      pools[POOL_KEYS.LEGS].push(e);
      
      if (has('quad', 'squat', 'extension', 'leg press')) pools[POOL_KEYS.QUADS].push(e);
      if (has('hamstring', 'curl', 'romanian')) pools[POOL_KEYS.HAMSTRINGS].push(e);
      if (has('glute', 'hip thrust', 'bridge', 'kickback')) pools[POOL_KEYS.GLUTES].push(e);
      if (has('calf', 'raise')) pools[POOL_KEYS.CALVES].push(e);
    }

    // CORE
    if (has('abs', 'core', 'waist', 'plank', 'crunch', 'sit-up', 'oblique', 'v-up')) {
      pools[POOL_KEYS.CORE].push(e);
    }
  });

  // Karıştır
  Object.keys(pools).forEach(key => {
    pools[key] = shuffleArray(pools[key]);
  });

  return pools;
};

// --- TARGET'TAN POOL KEY'E ÇEVİRME ---
const mapTargetToPoolKey = (target) => {
  const normalized = (target || '').toLowerCase().trim();
  
  if (normalized.includes('chest') || normalized.includes('pectoral')) return POOL_KEYS.CHEST;
  if (normalized.includes('back') || normalized.includes('lat')) return POOL_KEYS.BACK;
  if (normalized.includes('rear delt')) return POOL_KEYS.REAR_DELTS;
  if (normalized.includes('shoulder') || normalized.includes('delt')) return POOL_KEYS.SHOULDERS;
  if (normalized.includes('bicep')) return POOL_KEYS.BICEPS;
  if (normalized.includes('tricep')) return POOL_KEYS.TRICEPS;
  if (normalized.includes('forearm')) return POOL_KEYS.FOREARMS;
  if (normalized.includes('calf')) return POOL_KEYS.CALVES;
  if (normalized.includes('glute')) return POOL_KEYS.GLUTES;
  if (normalized.includes('hamstring')) return POOL_KEYS.HAMSTRINGS;
  if (normalized.includes('quad')) return POOL_KEYS.QUADS;
  if (normalized.includes('leg')) return POOL_KEYS.LEGS;
  if (normalized.includes('core') || normalized.includes('abs') || normalized.includes('waist')) return POOL_KEYS.CORE;
  
  return POOL_KEYS.CHEST; // Varsayılan
};

// --- ANA PLANLAYICI ---
export const generateWeeklyPlan = ({
  exercises = [],
  availability = 3,
  focusTags = defaultFocus,
  intensity = 'Orta',
  experience = 'beginner',
  template = null,
}) => {
  
  const pools = categorizeExercises(exercises);

  if (!template?.days?.length) {
    console.error('Şablon bulunamadı!');
    return [];
  }

  const dayCount = Math.max(1, Math.min(availability, template.days.length));

  return Array.from({ length: dayCount }).map((_, dayIndex) => {
    const templateDay = template.days[dayIndex % template.days.length];
    const usedExercises = new Set();

    const dayExercises = (templateDay.exercises || []).map((templateExercise, slotIndex) => {
      const poolKey = mapTargetToPoolKey(templateExercise.target);
      const pool = pools[poolKey] || [];
      
      let selected = pool.find(ex => !usedExercises.has(ex.id));
      
      if (!selected && pool.length > 0) {
        selected = pool[Math.floor(Math.random() * pool.length)];
      }

      if (!selected) {
        selected = {
          ...EMERGENCY_BACKUPS[poolKey],
          id: `backup-${dayIndex}-${slotIndex}`,
          equipment: 'Bodyweight',
        };
      }

      usedExercises.add(selected.id);
      const prescription = prescribeScheme(intensity, experience, poolKey);

      return {
        id: selected.id || `ex-${dayIndex}-${slotIndex}`,
        name: selected.name,
        target: selected.target || templateExercise.target,
        equipment: selected.equipment || 'Standart',
        secondaryMuscles: selected.secondaryMuscles || [],
        sets: templateExercise.sets || prescription.sets,
        reps: templateExercise.reps || prescription.reps,
        tempo: prescription.tempo,
        gifUrl: selected.gifUrl || ''
      };
    });

    return {
      day: templateDay.label || TURKISH_WEEK_DAYS[dayIndex],
      focus: templateDay.focus || focusTags[0],
      intensity: templateDay.intensity || intensity,
      exercises: dayExercises,
    };
  });
};