export const SPLIT_TEMPLATES = {
  ppl: {
    name: 'PPL (Push / Pull / Legs)',
    description: 'Klasik 3 günlük hacim şablonu. Ana hedef: maksimum hipertrofi.',
    focusTags: ['Push', 'Pull', 'Legs'],
    preferredTargets: ['chest', 'shoulders', 'arms', 'back', 'legs', 'core'],
    days: [
      {
        label: 'Gün 1: PUSH (İtiş)',
        focus: 'Göğüs, Ön/Yan Omuz, Triceps',
        intensity: 'Yüksek',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '6-8', notes: 'Temel güç hareketi, progresif overload.', aliasKey: 'chest' },
          { name: 'Overhead Press (Military Press)', sets: 3, reps: '8-10', notes: 'Omuz kütlesi için temel hareket.', aliasKey: 'shoulders' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '8-12', notes: 'Üst göğüs vurgusu.', aliasKey: 'chest' },
          { name: 'Lateral Raise', sets: 4, reps: '12-15', notes: 'Yan omuz genişliği, kontrollü tempo.', aliasKey: 'shoulders' },
          { name: 'Cable Triceps Pushdown', sets: 3, reps: '10-12', notes: 'Triceps izolasyonu.', aliasKey: 'arms' },
          { name: 'Overhead Triceps Extension', sets: 3, reps: '10-12', notes: 'Triceps uzun başı.', aliasKey: 'arms' },
        ],
      },
      {
        label: 'Gün 2: PULL (Çekiş)',
        focus: 'Sırt, Lat, Arka Omuz, Biceps',
        intensity: 'Yüksek',
        exercises: [
          { name: 'Pull-Up', sets: 3, reps: 'Max', notes: 'Gerekirse Lat Pulldown alternatifi.', aliasKey: 'back' },
          { name: 'Barbell Row', sets: 4, reps: '8-10', notes: 'Sırt kalınlığı için.', aliasKey: 'back' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', notes: 'Scapula sıkıştırmaya odaklan.', aliasKey: 'back' },
          { name: 'Face Pull', sets: 4, reps: '15-20', notes: 'Postür ve arka omuz sağlığı.', aliasKey: 'shoulders' },
          { name: 'Barbell Curl', sets: 3, reps: '8-10', notes: 'Temel biceps hareketi.', aliasKey: 'arms' },
          { name: 'Hammer Curl', sets: 3, reps: '10-12', notes: 'Brachialis & ön kol.', aliasKey: 'arms' },
        ],
      },
      {
        label: 'Gün 3: LEGS (Bacak)',
        focus: 'Quad, Hamstring, Glute, Calf',
        intensity: 'Yüksek',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: '6-8', notes: 'Bacakların kralı. Form kritik.', aliasKey: 'legs' },
          { name: 'Romanian Deadlift', sets: 4, reps: '8-10', notes: 'Hamstring & glute için.', aliasKey: 'legs' },
          { name: 'Leg Extension', sets: 3, reps: '12-15', notes: 'Quad izolasyonu.', aliasKey: 'legs' },
          { name: 'Leg Curl', sets: 3, reps: '12-15', notes: 'Hamstring izolasyonu.', aliasKey: 'legs' },
          { name: 'Calf Raise', sets: 4, reps: '15-20', notes: 'Baldır gelişimi için yüksek tekrar.', aliasKey: 'legs' },
        ],
      },
    ],
  },

  upperLower: {
    name: 'Upper / Lower Split',
    description: 'Haftada 4 güne kadar ölçeklenen güç + hipertrofi dengesi.',
    focusTags: ['Upper', 'Lower'],
    preferredTargets: ['chest', 'back', 'shoulders', 'arms', 'legs', 'glutes'],
    days: [
      {
        label: 'Gün 1: Upper Power',
        focus: 'Göğüs, Sırt, Omuz, Kol',
        intensity: 'Yüksek',
        exercises: [
          { name: 'Barbell Bench Press', sets: 5, reps: '5', notes: 'Güç odaklı.', aliasKey: 'chest' },
          { name: 'Bent Over Row', sets: 5, reps: '5', notes: 'Sırt kalınlığı.', aliasKey: 'back' },
          { name: 'Weighted Pull-Up', sets: 4, reps: '6-8', notes: 'Lat & biceps.', aliasKey: 'back' },
          { name: 'Seated Dumbbell Press', sets: 4, reps: '8-10', notes: 'Omuz kütlesi.', aliasKey: 'shoulders' },
          { name: 'Barbell Curl', sets: 3, reps: '10-12', notes: 'Biceps izolasyonu.', aliasKey: 'arms' },
          { name: 'Skull Crusher', sets: 3, reps: '10-12', notes: 'Triceps uzun başı.', aliasKey: 'arms' },
        ],
      },
      {
        label: 'Gün 2: Lower Power',
        focus: 'Quad, Hamstring, Glute, Core',
        intensity: 'Yüksek',
        exercises: [
          { name: 'Back Squat', sets: 5, reps: '5', notes: 'Güç odaklı.', aliasKey: 'legs' },
          { name: 'Deadlift', sets: 3, reps: '5', notes: 'Posterior chain.', aliasKey: 'legs' },
          { name: 'Walking Lunge', sets: 3, reps: '10 adım', notes: 'Stabilizasyon + unilateral güç.', aliasKey: 'legs' },
          { name: 'Leg Curl', sets: 3, reps: '10-12', notes: 'Hamstring izolasyonu.', aliasKey: 'legs' },
          { name: 'Hanging Leg Raise', sets: 3, reps: '12-15', notes: 'Core.', aliasKey: 'core' },
        ],
      },
      {
        label: 'Gün 3: Upper Hypertrophy',
        focus: 'Üst vücut hacim',
        intensity: 'Orta',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', notes: 'Üst göğüs.', aliasKey: 'chest' },
          { name: 'Chest Supported Row', sets: 4, reps: '10-12', notes: 'Sırt hacmi.', aliasKey: 'back' },
          { name: 'Cable Fly', sets: 3, reps: '12-15', notes: 'Göğüs izolasyonu.', aliasKey: 'chest' },
          { name: 'Lateral Raise', sets: 4, reps: '12-15', notes: 'Omuz genişliği.', aliasKey: 'shoulders' },
          { name: 'EZ-Bar Curl', sets: 3, reps: '12-15', notes: 'Biceps pump.', aliasKey: 'arms' },
          { name: 'Cable Triceps Pushdown', sets: 3, reps: '12-15', notes: 'Triceps pump.', aliasKey: 'arms' },
        ],
      },
      {
        label: 'Gün 4: Lower Hypertrophy',
        focus: 'Bacak hacmi',
        intensity: 'Orta',
        exercises: [
          { name: 'Front Squat', sets: 4, reps: '8-10', notes: 'Quad vurgusu.', aliasKey: 'legs' },
          { name: 'Romanian Deadlift', sets: 4, reps: '10-12', notes: 'Hamstring + glute.', aliasKey: 'legs' },
          { name: 'Leg Press', sets: 3, reps: '12-15', notes: 'Hacim.', aliasKey: 'legs' },
          { name: 'Split Squat', sets: 3, reps: '10-12', notes: 'Unilateral denge.', aliasKey: 'legs' },
          { name: 'Calf Raise', sets: 4, reps: '15-20', notes: 'Baldır.', aliasKey: 'legs' },
        ],
      },
    ],
  },

  fullBody: {
    name: 'Full Body Performance',
    description: 'Haftada 3 gün, her seans tüm vücudu çalıştırır.',
    focusTags: ['Full Body'],
    preferredTargets: ['legs', 'chest', 'back', 'shoulders', 'core'],
    days: [
      {
        label: 'Gün 1: Güç',
        focus: 'Tüm vücut güç',
        intensity: 'Orta',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: '6-8', notes: 'Ağır setler.', aliasKey: 'legs' },
          { name: 'Bench Press', sets: 4, reps: '6-8', notes: 'Temel itiş.', aliasKey: 'chest' },
          { name: 'Barbell Row', sets: 4, reps: '8-10', notes: 'Çekiş.', aliasKey: 'back' },
          { name: 'Shoulder Press', sets: 3, reps: '10-12', notes: 'Omuz.', aliasKey: 'shoulders' },
          { name: 'Hanging Leg Raise', sets: 3, reps: '12-15', notes: 'Core.', aliasKey: 'core' },
        ],
      },
      {
        label: 'Gün 2: Hypertrofi',
        focus: 'Pompa & izolasyon',
        intensity: 'Orta',
        exercises: [
          { name: 'Front Squat', sets: 4, reps: '10-12', notes: 'Quad odaklı.', aliasKey: 'legs' },
          { name: 'Incline Bench Press', sets: 4, reps: '10-12', notes: 'Üst göğüs.', aliasKey: 'chest' },
          { name: 'Lat Pulldown', sets: 4, reps: '12-15', notes: 'Lat.', aliasKey: 'back' },
          { name: 'Cable Lateral Raise', sets: 4, reps: '12-15', notes: 'Omuz.', aliasKey: 'shoulders' },
          { name: 'Cable Crunch', sets: 3, reps: '15-20', notes: 'Core.', aliasKey: 'core' },
        ],
      },
      {
        label: 'Gün 3: Kondisyon',
        focus: 'Güç + kondisyon',
        intensity: 'Orta-Yüksek',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: '6-8', notes: 'Posterior chain.', aliasKey: 'legs' },
          { name: 'Push Press', sets: 4, reps: '6-8', notes: 'Güç aktarımı.', aliasKey: 'shoulders' },
          { name: 'Ring Row', sets: 4, reps: '10-12', notes: 'Vücut ağırlığı çekiş.', aliasKey: 'back' },
          { name: 'Walking Lunge', sets: 3, reps: '12-15', notes: 'Alt vücut dayanıklılığı.', aliasKey: 'legs' },
          { name: 'Assault Bike Interval', sets: 3, reps: '40 sn / 20 sn', notes: 'Metabolik finish.', aliasKey: 'conditioning' },
        ],
      },
    ],
  },
};

