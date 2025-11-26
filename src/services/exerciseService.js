// ID oluşturucu
const safeId = () => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// --- TEMİZLENMİŞ HAREKET HAVUZU (GIF URL'leri kaldırıldı) ---
export const mockExercises = [
  // --- GÖĞÜS (CHEST) ---
  { id: 'ch-1', name: 'Barbell Bench Press', target: 'pectorals', bodyPart: 'chest', equipment: 'barbell', targetMuscles: ['pectorals', 'triceps', 'front delts'] },
  { id: 'ch-2', name: 'Dumbbell Bench Press', target: 'pectorals', bodyPart: 'chest', equipment: 'dumbbell', targetMuscles: ['pectorals', 'triceps'] },
  { id: 'ch-3', name: 'Incline Barbell Bench Press', target: 'upper pectorals', bodyPart: 'chest', equipment: 'barbell', targetMuscles: ['upper chest', 'triceps'] },
  { id: 'ch-4', name: 'Incline Dumbbell Press', target: 'upper chest', bodyPart: 'chest', equipment: 'dumbbell', targetMuscles: ['upper chest'] },
  { id: 'ch-5', name: 'Decline Bench Press', target: 'lower chest', bodyPart: 'chest', equipment: 'barbell', targetMuscles: ['lower chest'] },
  { id: 'ch-6', name: 'Chest Fly Machine', target: 'pectorals', bodyPart: 'chest', equipment: 'machine', targetMuscles: ['pectorals'] },
  { id: 'ch-7', name: 'Cable Crossover', target: 'pectorals', bodyPart: 'chest', equipment: 'cable', targetMuscles: ['pectorals'] },
  { id: 'ch-8', name: 'Push-Up', target: 'pectorals', bodyPart: 'chest', equipment: 'bodyweight', targetMuscles: ['pectorals', 'triceps'] },
  { id: 'ch-9', name: 'Diamond Push-Up', target: 'inner chest', bodyPart: 'chest', equipment: 'bodyweight', targetMuscles: ['inner chest', 'triceps'] },
  { id: 'ch-10', name: 'Decline Push-Up', target: 'upper chest', bodyPart: 'chest', equipment: 'bodyweight', targetMuscles: ['upper chest'] },
  { id: 'ch-11', name: 'Wide Push-Up', target: 'pectorals', bodyPart: 'chest', equipment: 'bodyweight', targetMuscles: ['pectorals'] },
  { id: 'ch-12', name: 'Dips (Chest Leaning)', target: 'lower chest', bodyPart: 'chest', equipment: 'dip bar', targetMuscles: ['lower chest', 'triceps'] },
  { id: 'ch-13', name: 'Resistance Band Chest Fly', target: 'pectorals', bodyPart: 'chest', equipment: 'resistance band', targetMuscles: ['pectorals'] },
  { id: 'ch-14', name: 'Resistance Band Press', target: 'pectorals', bodyPart: 'chest', equipment: 'resistance band', targetMuscles: ['pectorals'] },
  { id: 'ch-15', name: 'Single Arm Cable Fly', target: 'pectorals', bodyPart: 'chest', equipment: 'cable', targetMuscles: ['pectorals'] },

  // --- SIRT (BACK) ---
  { id: 'bk-1', name: 'Deadlift', target: 'back overall', bodyPart: 'back', equipment: 'barbell', targetMuscles: ['lower back', 'lats', 'traps'] },
  { id: 'bk-2', name: 'Pull-Up', target: 'lats', bodyPart: 'back', equipment: 'bodyweight', targetMuscles: ['lats', 'biceps'] },
  { id: 'bk-3', name: 'Lat Pulldown', target: 'lats', bodyPart: 'back', equipment: 'machine', targetMuscles: ['lats'] },
  { id: 'bk-4', name: 'Barbell Bent-Over Row', target: 'mid back', bodyPart: 'back', equipment: 'barbell', targetMuscles: ['lats', 'rhomboids'] },
  { id: 'bk-5', name: 'Dumbbell Row', target: 'lats', bodyPart: 'back', equipment: 'dumbbell', targetMuscles: ['lats'] },
  { id: 'bk-6', name: 'Seated Cable Row', target: 'middle back', bodyPart: 'back', equipment: 'cable', targetMuscles: ['middle back'] },
  { id: 'bk-7', name: 'T-Bar Row', target: 'middle back', bodyPart: 'back', equipment: 'machine', targetMuscles: ['middle back'] },
  { id: 'bk-8', name: 'Inverted Row', target: 'upper back', bodyPart: 'back', equipment: 'bodyweight', targetMuscles: ['upper back', 'lats'] },
  { id: 'bk-9', name: 'Superman', target: 'lower back', bodyPart: 'back', equipment: 'bodyweight', targetMuscles: ['lower back'] },
  { id: 'bk-10', name: 'Hyperextension', target: 'lower back', bodyPart: 'back', equipment: 'machine', targetMuscles: ['lower back'] },
  { id: 'bk-11', name: 'Wide Grip Pull-Up', target: 'lats', bodyPart: 'back', equipment: 'bodyweight', targetMuscles: ['lats'] },
  { id: 'bk-12', name: 'Close Grip Lat Pulldown', target: 'lower lats', bodyPart: 'back', equipment: 'machine', targetMuscles: ['lower lats'] },
  { id: 'bk-13', name: 'Straight Arm Pulldown', target: 'lats', bodyPart: 'back', equipment: 'cable', targetMuscles: ['lats'] },
  { id: 'bk-14', name: 'Resistance Band Row', target: 'middle back', bodyPart: 'back', equipment: 'resistance band', targetMuscles: ['middle back'] },
  { id: 'bk-15', name: 'Reverse Snow Angels', target: 'upper back', bodyPart: 'back', equipment: 'bodyweight', targetMuscles: ['upper back', 'rear delts'] },

  // --- BACAK (LEGS) ---
  { id: 'lg-1', name: 'Barbell Squat', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'barbell', targetMuscles: ['quadriceps', 'glutes', 'hamstrings'] },
  { id: 'lg-2', name: 'Leg Press', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'machine', targetMuscles: ['quadriceps', 'glutes'] },
  { id: 'lg-3', name: 'Lunges', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'bodyweight', targetMuscles: ['quadriceps', 'glutes'] },
  { id: 'lg-4', name: 'Romanian Deadlift', target: 'hamstrings', bodyPart: 'upper legs', equipment: 'barbell', targetMuscles: ['hamstrings', 'glutes'] },
  { id: 'lg-5', name: 'Leg Curl Machine', target: 'hamstrings', bodyPart: 'upper legs', equipment: 'machine', targetMuscles: ['hamstrings'] },
  { id: 'lg-6', name: 'Leg Extension', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'machine', targetMuscles: ['quadriceps'] },
  { id: 'lg-7', name: 'Bulgarian Split Squat', target: 'quads', bodyPart: 'upper legs', equipment: 'dumbbell', targetMuscles: ['quads', 'glutes'] },
  { id: 'lg-8', name: 'Glute Bridge', target: 'glutes', bodyPart: 'upper legs', equipment: 'bodyweight', targetMuscles: ['glutes', 'hamstrings'] },
  { id: 'lg-9', name: 'Hip Thrust', target: 'glutes', bodyPart: 'upper legs', equipment: 'barbell', targetMuscles: ['glutes'] },
  { id: 'lg-10', name: 'Calf Raise', target: 'calves', bodyPart: 'lower legs', equipment: 'bodyweight', targetMuscles: ['gastrocnemius', 'soleus'] },
  { id: 'lg-11', name: 'Box Step-Up', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'bodyweight', targetMuscles: ['quadriceps', 'glutes'] },
  { id: 'lg-12', name: 'Sumo Deadlift', target: 'glutes', bodyPart: 'upper legs', equipment: 'barbell', targetMuscles: ['glutes', 'inner thighs', 'hamstrings'] },
  { id: 'lg-13', name: 'Goblet Squat', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'dumbbell', targetMuscles: ['quadriceps', 'glutes'] },
  { id: 'lg-14', name: 'Wall Sit', target: 'quadriceps', bodyPart: 'upper legs', equipment: 'bodyweight', targetMuscles: ['quadriceps'] },
  { id: 'lg-15', name: 'Lateral Lunges', target: 'inner thighs', bodyPart: 'upper legs', equipment: 'bodyweight', targetMuscles: ['adductors', 'quads'] },

  // --- OMUZ (SHOULDERS) ---
  { id: 'sh-1', name: 'Overhead Barbell Press', target: 'deltoids', bodyPart: 'shoulders', equipment: 'barbell', targetMuscles: ['front delts', 'side delts', 'triceps'] },
  { id: 'sh-2', name: 'Dumbbell Shoulder Press', target: 'deltoids', bodyPart: 'shoulders', equipment: 'dumbbell', targetMuscles: ['deltoids'] },
  { id: 'sh-3', name: 'Lateral Raise', target: 'side delts', bodyPart: 'shoulders', equipment: 'dumbbell', targetMuscles: ['lateral deltoid'] },
  { id: 'sh-4', name: 'Front Raise', target: 'front delts', bodyPart: 'shoulders', equipment: 'dumbbell', targetMuscles: ['front deltoid'] },
  { id: 'sh-5', name: 'Rear Delt Fly', target: 'rear delts', bodyPart: 'shoulders', equipment: 'dumbbell', targetMuscles: ['rear delts'] },
  { id: 'sh-6', name: 'Arnold Press', target: 'deltoids', bodyPart: 'shoulders', equipment: 'dumbbell', targetMuscles: ['deltoids'] },
  { id: 'sh-7', name: 'Cable Lateral Raise', target: 'side delts', bodyPart: 'shoulders', equipment: 'cable', targetMuscles: ['side delts'] },
  { id: 'sh-8', name: 'Machine Shoulder Press', target: 'deltoids', bodyPart: 'shoulders', equipment: 'machine', targetMuscles: ['deltoids'] },
  { id: 'sh-9', name: 'Handstand Push-Up', target: 'deltoids', bodyPart: 'shoulders', equipment: 'bodyweight', targetMuscles: ['front delts', 'triceps'] },
  { id: 'sh-10', name: 'Pike Push-Up', target: 'front delts', bodyPart: 'shoulders', equipment: 'bodyweight', targetMuscles: ['front delts'] },
  { id: 'sh-11', name: 'Barbell Upright Row', target: 'side delts', bodyPart: 'shoulders', equipment: 'barbell', targetMuscles: ['side delts', 'traps'] },
  { id: 'sh-12', name: 'Face Pull', target: 'rear delts', bodyPart: 'shoulders', equipment: 'cable', targetMuscles: ['rear delts', 'upper back'] },
  { id: 'sh-13', name: 'Kettlebell Press', target: 'deltoids', bodyPart: 'shoulders', equipment: 'kettlebell', targetMuscles: ['deltoids'] },
  { id: 'sh-14', name: 'Single Arm Cable Press', target: 'front delts', bodyPart: 'shoulders', equipment: 'cable', targetMuscles: ['front delts'] },
  { id: 'sh-15', name: 'Resistance Band Shoulder Press', target: 'deltoids', bodyPart: 'shoulders', equipment: 'resistance band', targetMuscles: ['deltoids'] },

  // --- KOL (ARMS) ---
  { id: 'ar-1', name: 'Barbell Curl', target: 'biceps', bodyPart: 'upper arms', equipment: 'barbell', targetMuscles: ['biceps'] },
  { id: 'ar-2', name: 'Dumbbell Curl', target: 'biceps', bodyPart: 'upper arms', equipment: 'dumbbell', targetMuscles: ['biceps'] },
  { id: 'ar-3', name: 'Hammer Curl', target: 'brachialis', bodyPart: 'upper arms', equipment: 'dumbbell', targetMuscles: ['brachialis', 'biceps'] },
  { id: 'ar-4', name: 'Preacher Curl', target: 'biceps', bodyPart: 'upper arms', equipment: 'machine', targetMuscles: ['biceps'] },
  { id: 'ar-5', name: 'Cable Curl', target: 'biceps', bodyPart: 'upper arms', equipment: 'cable', targetMuscles: ['biceps'] },
  { id: 'ar-6', name: 'Triceps Pushdown', target: 'triceps', bodyPart: 'upper arms', equipment: 'cable', targetMuscles: ['triceps'] },
  { id: 'ar-7', name: 'Skull Crusher', target: 'triceps', bodyPart: 'upper arms', equipment: 'barbell', targetMuscles: ['triceps'] },
  { id: 'ar-8', name: 'Triceps Dips', target: 'triceps', bodyPart: 'upper arms', equipment: 'dip bar', targetMuscles: ['triceps'] },
  { id: 'ar-9', name: 'Overhead Triceps Extension', target: 'triceps', bodyPart: 'upper arms', equipment: 'dumbbell', targetMuscles: ['long head triceps'] },
  { id: 'ar-10', name: 'Close-Grip Bench Press', target: 'triceps', bodyPart: 'upper arms', equipment: 'barbell', targetMuscles: ['triceps'] },
  { id: 'ar-11', name: 'Wrist Curl', target: 'forearms', bodyPart: 'lower arms', equipment: 'barbell', targetMuscles: ['forearms'] },
  { id: 'ar-12', name: 'Reverse Curl', target: 'forearms', bodyPart: 'upper arms', equipment: 'barbell', targetMuscles: ['brachioradialis'] },
  { id: 'ar-13', name: 'Resistance Band Curl', target: 'biceps', bodyPart: 'upper arms', equipment: 'resistance band', targetMuscles: ['biceps'] },
  { id: 'ar-14', name: 'Diamond Push-Up', target: 'triceps', bodyPart: 'upper arms', equipment: 'bodyweight', targetMuscles: ['triceps'] },
  { id: 'ar-15', name: 'Chin-Up', target: 'biceps', bodyPart: 'upper arms', equipment: 'bodyweight', targetMuscles: ['biceps', 'lats'] },

  // --- ABS & CORE ---
  { id: 'cr-1', name: 'Crunch', target: 'upper abs', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['rectus abdominis'] },
  { id: 'cr-2', name: 'Leg Raise', target: 'lower abs', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['lower abs'] },
  { id: 'cr-3', name: 'Plank', target: 'core overall', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['core', 'transverse abdominis'] },
  { id: 'cr-4', name: 'Hanging Leg Raise', target: 'lower abs', bodyPart: 'waist', equipment: 'bar', targetMuscles: ['lower abs'] },
  { id: 'cr-5', name: 'Cable Crunch', target: 'upper abs', bodyPart: 'waist', equipment: 'cable', targetMuscles: ['upper abs'] },
  { id: 'cr-6', name: 'Russian Twist', target: 'obliques', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['obliques'] },
  { id: 'cr-7', name: 'Mountain Climbers', target: 'core overall', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['lower abs', 'hip flexors'] },
  { id: 'cr-8', name: 'Bicycle Crunch', target: 'obliques', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['obliques', 'upper abs'] },
  { id: 'cr-9', name: 'V-Up', target: 'abs', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['abs'] },
  { id: 'cr-10', name: 'Side Plank', target: 'obliques', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['obliques'] },
  { id: 'cr-11', name: 'Flutter Kicks', target: 'lower abs', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['lower abs'] },
  { id: 'cr-12', name: 'Toe Touch', target: 'upper abs', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['upper abs'] },
  { id: 'cr-13', name: 'Ab Wheel Rollout', target: 'core overall', bodyPart: 'waist', equipment: 'ab wheel', targetMuscles: ['rectus abdominis', 'transverse abdominis'] },
  { id: 'cr-14', name: 'Sit-Up', target: 'upper abs', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['upper abs'] },
  { id: 'cr-15', name: 'Hollow Hold', target: 'core stability', bodyPart: 'waist', equipment: 'bodyweight', targetMuscles: ['core'] }
];

const normalizeExercise = (exercise = {}) => {
  const targetMuscles = exercise.targetMuscles || (exercise.target ? [exercise.target] : []);
  const bodyParts = exercise.bodyParts || (exercise.bodyPart ? [exercise.bodyPart] : []);
  const equipments = exercise.equipments || (exercise.equipment ? [exercise.equipment] : []);
  
  const primaryTarget = Array.isArray(targetMuscles) && targetMuscles.length > 0 ? targetMuscles[0] : exercise.target || exercise.bodyPart || 'genel';
  const primaryBodyPart = Array.isArray(bodyParts) && bodyParts.length > 0 ? bodyParts[0] : exercise.bodyPart || exercise.target || 'genel';
  const primaryEquipment = Array.isArray(equipments) && equipments.length > 0 ? equipments[0] : exercise.equipment || 'vücut ağırlığı';
  
  return {
    id: exercise.id || safeId(),
    name: exercise.name || 'Bilinmeyen Egzersiz',
    target: primaryTarget,
    bodyPart: primaryBodyPart,
    equipment: primaryEquipment,
    targetMuscles: Array.isArray(targetMuscles) ? targetMuscles : (primaryTarget ? [primaryTarget] : []),
    bodyParts: Array.isArray(bodyParts) ? bodyParts : (primaryBodyPart ? [primaryBodyPart] : []),
    equipments: Array.isArray(equipments) ? equipments : (primaryEquipment ? [primaryEquipment] : []),
    secondaryMuscles: Array.isArray(exercise.secondaryMuscles) ? exercise.secondaryMuscles : [],
    // gifUrl artık kullanılmıyor
  };
};

const shuffle = (array = []) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// --- ANA FONKSİYON: Artık API yerine Lokal Veriyi Filtreliyor ---
export const fetchExercises = async ({ filter = 'cardio', filters, limit = 10, mode = 'target' } = {}) => {
  // İstenen filtreleri belirle
  const searchFilters = filters?.length ? filters : [{ filter, mode }];
  
  // Lokal havuzda arama yap
  let filteredResults = mockExercises.filter(exercise => {
    // Herhangi bir filtreye uyuyor mu kontrol et
    return searchFilters.some(({ filter: f, mode: m }) => {
      const searchKey = f.toLowerCase();
      // 'cardio' özel durumu
      if (searchKey === 'cardio' && (exercise.bodyPart === 'cardio' || exercise.target === 'cardiovascular system')) return true;
      
      // Genel arama
      if (m === 'bodyPart') {
        // "legs" araması "upper legs" veya "lower legs"i kapsamalı
        if (searchKey === 'legs' || searchKey === 'upper legs' || searchKey === 'lower legs') {
             return exercise.bodyPart.includes('legs');
        }
        return exercise.bodyPart.includes(searchKey);
      } else {
        return exercise.target.includes(searchKey) || exercise.targetMuscles?.some(t => t.includes(searchKey));
      }
    });
  });

  // Eğer hiç sonuç yoksa, en azından rastgele bir şeyler döndür ki ekran boş kalmasın
  if (filteredResults.length === 0) {
    console.warn("Filtreye uygun hareket bulunamadı, rastgele getiriliyor.");
    filteredResults = mockExercises;
  }

  const normalized = filteredResults.map(normalizeExercise);
  // Rastgele karıştır (Her seferinde farklı program çıksın diye)
  const shuffled = shuffle(normalized);
  
  return shuffled.slice(0, limit);
};

export const fetchAllExercises = async () => {
  return mockExercises.map(normalizeExercise);
};