const defaultGif = 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif';

export const HYPERTROPHY_LIBRARY = {
  chest: [
    { name: 'Flat Barbell Bench Press', gifUrl: 'https://v2.exercisedb.io/image/Gy4s.png' },
    { name: 'Incline Dumbbell Press', gifUrl: 'https://v2.exercisedb.io/image/O3Vv.png' },
    { name: 'Weighted Chest Dip', gifUrl: 'https://v2.exercisedb.io/image/W8IU.png' },
  ],
  back: [
    { name: 'Pendlay Row', gifUrl: 'https://v2.exercisedb.io/image/mnqU.png' },
    { name: 'Seated Cable Row', gifUrl: 'https://v2.exercisedb.io/image/k8MZ.png' },
    { name: 'Lat Pulldown', gifUrl: 'https://v2.exercisedb.io/image/C1y5.png' },
  ],
  shoulders: [
    { name: 'Standing Military Press', gifUrl: 'https://v2.exercisedb.io/image/9j8v.png' },
    { name: 'Seated Dumbbell Shoulder Press', gifUrl: 'https://v2.exercisedb.io/image/ml0R.png' },
    { name: 'Cable Lateral Raise', gifUrl: 'https://v2.exercisedb.io/image/X7HF.png' },
  ],
  legs: [
    { name: 'Back Squat (High Bar)', gifUrl: 'https://v2.exercisedb.io/image/PtcK.png' },
    { name: 'Romanian Deadlift', gifUrl: 'https://v2.exercisedb.io/image/6QK3.png' },
    { name: 'Bulgarian Split Squat', gifUrl: 'https://v2.exercisedb.io/image/SVJg.png' },
  ],
  glutes: [
    { name: 'Barbell Hip Thrust', gifUrl: 'https://v2.exercisedb.io/image/AM4y.png' },
    { name: 'Glute-Ham Raise', gifUrl: 'https://v2.exercisedb.io/image/ps1p.png' },
    { name: 'Reverse Lunge', gifUrl: 'https://v2.exercisedb.io/image/wlqg.png' },
  ],
  arms: [
    { name: 'EZ-Bar Curl', gifUrl: 'https://v2.exercisedb.io/image/k1nH.png' },
    { name: 'Cable Triceps Pushdown', gifUrl: 'https://v2.exercisedb.io/image/gf9Z.png' },
    { name: 'Incline Dumbbell Curl', gifUrl: 'https://v2.exercisedb.io/image/4nQK.png' },
  ],
  core: [
    { name: 'Weighted Hanging Knee Raise', gifUrl: 'https://v2.exercisedb.io/image/t1sX.png' },
    { name: 'Cable Woodchop', gifUrl: 'https://v2.exercisedb.io/image/C6Mh.png' },
    { name: 'Ab Wheel Rollout', gifUrl: 'https://v2.exercisedb.io/image/mc17.png' },
  ],
  conditioning: [
    { name: 'Assault Bike Intervals', gifUrl: defaultGif },
    { name: 'RowErg Power 500s', gifUrl: defaultGif },
    { name: 'Battle Rope Waves', gifUrl: defaultGif },
  ],
};

export const resolveHypertrophyAlias = (exercise = {}, preferredKey) => {
  // targetMuscles array'inden veya target string'inden target al
  const primaryTarget = exercise.targetMuscles?.[0] || exercise.target || exercise.bodyPart || '';
  const target = primaryTarget.toLowerCase();
  const equipment = (exercise.equipment || '').toLowerCase();

  const tagMap = [
    { match: ['chest', 'pectoral'], key: 'chest' },
    { match: ['back', 'lats'], key: 'back' },
    { match: ['shoulder', 'deltoid'], key: 'shoulders' },
    { match: ['upper arm', 'bicep', 'tricep'], key: 'arms' },
    { match: ['glute'], key: 'glutes' },
    { match: ['lower leg', 'upper leg', 'hamstring', 'quad', 'calf'], key: 'legs' },
    { match: ['waist', 'core', 'abs'], key: 'core' },
    { match: ['cardio', 'aerobic'], key: 'conditioning' },
  ];

  // targetMuscles array'indeki tüm kasları kontrol et
  const allTargets = exercise.targetMuscles?.map((m) => m.toLowerCase()) || [target];
  const found = preferredKey
    ? { key: preferredKey }
    : tagMap.find(({ match }) => 
        match.some((tag) => 
          allTargets.some((t) => t.includes(tag)) || target.includes(tag)
        )
      )
        || (equipment.includes('cable') ? { key: 'shoulders' } : null);

  if (!found?.key) {
    return exercise;
  }

  const pool = HYPERTROPHY_LIBRARY[found.key];
  if (!pool?.length) {
    return exercise;
  }

  const alias = pool[Math.floor(Math.random() * pool.length)];
  const aliasGroup = (alias.group || found.key || '').toLowerCase();
  
  // ExerciseDB'den gelen gifUrl'i her zaman öncelikli kullan, alias gif'ini sadece fallback olarak kullan
  // ExerciseDB'den gelen gif varsa (exercisedb.dev domain'inden veya static.exercisedb.dev'den geliyorsa) onu kullan
  const hasExerciseDbGif = exercise.gifUrl && (
    exercise.gifUrl.includes('exercisedb') || 
    exercise.gifUrl.includes('static.exercisedb') ||
    exercise.gifUrl.startsWith('https://v2.exercisedb.io')
  );
  
  return {
    ...exercise,
    name: alias.name,
    // ExerciseDB gif'i varsa onu kullan, yoksa alias gif'ini kullan
    gifUrl: hasExerciseDbGif ? exercise.gifUrl : (exercise.gifUrl || alias.gifUrl),
    target: aliasGroup || exercise.target,
    bodyPart: aliasGroup || exercise.bodyPart,
  };
};
