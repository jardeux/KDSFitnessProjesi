// 📦 Egzersiz havuzunu ayrı bir dosyadan alıyoruz
// Kendi path'ine göre güncelle: '../data/mockExercises' vs.
import { mockExercises } from "../data/mockExercises";

// ID oluşturucu
const safeId = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeExercise = (exercise = {}) => {
  const targetMuscles =
    exercise.targetMuscles || (exercise.target ? [exercise.target] : []);
  const bodyParts =
    exercise.bodyParts || (exercise.bodyPart ? [exercise.bodyPart] : []);
  const equipments =
    exercise.equipments || (exercise.equipment ? [exercise.equipment] : []);

  const primaryTarget =
    Array.isArray(targetMuscles) && targetMuscles.length > 0
      ? targetMuscles[0]
      : exercise.target || exercise.bodyPart || "genel";

  const primaryBodyPart =
    Array.isArray(bodyParts) && bodyParts.length > 0
      ? bodyParts[0]
      : exercise.bodyPart || exercise.target || "genel";

  const primaryEquipment =
    Array.isArray(equipments) && equipments.length > 0
      ? equipments[0]
      : exercise.equipment || "vücut ağırlığı";

  return {
    id: exercise.id || safeId(),
    name: exercise.name || "Bilinmeyen Egzersiz",
    target: primaryTarget,
    bodyPart: primaryBodyPart,
    equipment: primaryEquipment,
    targetMuscles: Array.isArray(targetMuscles)
      ? targetMuscles
      : primaryTarget
      ? [primaryTarget]
      : [],
    bodyParts: Array.isArray(bodyParts)
      ? bodyParts
      : primaryBodyPart
      ? [primaryBodyPart]
      : [],
    equipments: Array.isArray(equipments)
      ? equipments
      : primaryEquipment
      ? [primaryEquipment]
      : [],
    secondaryMuscles: Array.isArray(exercise.secondaryMuscles)
      ? exercise.secondaryMuscles
      : [],
    // gifUrl kullanılmıyor
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

// Profil verisini güvenli yorumlamak için yardımcılar
const safeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const clamp = (val, min = 0.75, max = 1.35) =>
  Math.min(max, Math.max(min, val));

const calculateBmi = (weight, height) => {
  const w = safeNumber(weight);
  const hCm = safeNumber(height);
  if (!w || !hCm) return null;
  const hM = hCm > 3 ? hCm / 100 : hCm; // cm girildiğinde metreye çevir
  if (hM <= 0) return null;
  return w / (hM * hM);
};

const normalizeWeights = (weights = {}) => {
  const total = Object.values(weights).reduce(
    (sum, val) => sum + (val || 0),
    0
  );
  if (!total) return weights;
  return Object.fromEntries(
    Object.entries(weights).map(([k, v]) => [k, (v || 0) / total])
  );
};

const deriveProfileBias = (profile = {}) => {
  const age = safeNumber(profile.age);
  const bmi = calculateBmi(profile.weight, profile.height);
  const height = safeNumber(profile.height);

  const baseBias = {
    tension: 1,
    stability: 1,
    isolation: 1,
    resistanceCurve: 1,
    jointSafety: 1,
  };

  const weightBias = { ...baseBias };

  if (age) {
    if (age >= 50) {
      baseBias.jointSafety += 0.25;
      baseBias.stability += 0.15;
      baseBias.tension -= 0.1;
      weightBias.jointSafety += 0.35;
      weightBias.tension -= 0.05;
    } else if (age <= 25) {
      baseBias.tension += 0.05;
      weightBias.tension += 0.05;
    }
  }

  if (bmi) {
    if (bmi >= 30) {
      baseBias.jointSafety += 0.2;
      baseBias.stability += 0.1;
      weightBias.jointSafety += 0.25;
      weightBias.resistanceCurve += 0.05;
    } else if (bmi <= 19) {
      baseBias.tension += 0.08;
      baseBias.isolation += 0.05;
      weightBias.tension += 0.05;
    }
  }

  if (height && height >= 190) {
    baseBias.stability += 0.05;
    baseBias.jointSafety += 0.05;
    weightBias.jointSafety += 0.05;
  }

  const clampBias = (biasObj) =>
    Object.fromEntries(Object.entries(biasObj).map(([k, v]) => [k, clamp(v)]));

  return {
    scoreBias: clampBias(baseBias),
    weightBias: clampBias(weightBias),
  };
};

const deriveRepSchemeFromProfile = (profile = {}) => {
  const age = safeNumber(profile.age);
  const bmi = calculateBmi(profile.weight, profile.height);
  const experience = profile.experience || "beginner";

  let sets = 3;
  let reps = "10-12";
  let tempo = "2-1-2";
  let intensity = "Orta-Yüksek";

  if (age && age >= 50) {
    reps = "12-15";
    tempo = "2-1-2";
    intensity = "Orta";
  } else if (age && age <= 25) {
    sets = 4;
    reps = "8-12";
    tempo = "2-0-1";
  }

  if (bmi && bmi >= 30) {
    sets = Math.max(2, sets - 1);
    reps = "10-15";
    tempo = "2-1-2";
    intensity = "Orta";
  }

  if (experience === "beginner") {
    sets = Math.max(2, sets - 1);
    intensity = "Orta";
  } else if (experience === "advanced") {
    sets += 1;
    intensity = "Yüksek";
  }

  return { sets, reps, tempo, intensity };
};

const TOPSIS_COLUMNS = [
  "tension",
  "stability",
  "isolation",
  "resistanceCurve",
  "jointSafety",
];

const BASE_TOPSIS_WEIGHTS = {
  tension: 0.3, // mekanik gerilim
  stability: 0.2, // stabilizasyon
  isolation: 0.2, // kas izolasyonu
  resistanceCurve: 0.15,
  jointSafety: 0.15,
};

// --- ANA FONKSİYON: Lokal veriyi filtreliyor ---
export const fetchExercises = async ({
  filter = "cardio",
  filters,
  limit = 10,
  mode = "target",
  excludedBodyParts = [], // Örn: ['upper legs', 'lower legs']
} = {}) => {
  // İstenen filtreleri belirle
  const searchFilters = filters?.length ? filters : [{ filter, mode }];

  // Hariç tutulacak bodyPart'ları lowercase set'e çevir
  const excludedSet = excludedBodyParts.map((b) => b.toLowerCase());

  // Lokal havuzda arama yap
  let filteredResults = mockExercises.filter((exercise) => {
    const exerciseBodyPart = (exercise.bodyPart || "").toLowerCase();

    // Önce global exclude kontrolü (örneğin push/pull gününde bacak istemiyorsan)
    if (excludedSet.length && excludedSet.includes(exerciseBodyPart)) {
      return false;
    }

    // Herhangi bir filtreye uyuyor mu kontrol et
    return searchFilters.some(({ filter: f, mode: m }) => {
      const searchKey = f.toLowerCase();

      // 'cardio' özel durumu
      if (
        searchKey === "cardio" &&
        (exercise.bodyPart === "cardio" ||
          exercise.target === "cardiovascular system")
      ) {
        return true;
      }

      if (m === "bodyPart") {
        const bp = (exercise.bodyPart || "").toLowerCase();

        // "legs" araması "upper legs" veya "lower legs"i kapsamalı
        if (searchKey === "legs") {
          return bp === "upper legs" || bp === "lower legs";
        }

        // Diğer tüm bodyPart aramaları için direkt eşitlik
        return bp === searchKey;
      } else {
        const target = (exercise.target || "").toLowerCase();
        const targetMuscles = (exercise.targetMuscles || []).map((t) =>
          (t || "").toLowerCase()
        );

        return (
          target.includes(searchKey) ||
          targetMuscles.some((t) => t.includes(searchKey))
        );
      }
    });
  });

  // Eğer hiç sonuç yoksa, en azından rastgele bir şeyler döndür ki ekran boş kalmasın
  if (filteredResults.length === 0) {
    console.warn(
      "Filtreye uygun hareket bulunamadı, rastgele getiriliyor (exclude korunarak)."
    );

    // Fallback'te de excludedBodyParts'a uyalım
    filteredResults = mockExercises.filter((ex) => {
      const bp = (ex.bodyPart || "").toLowerCase();
      return !excludedSet.length || !excludedSet.includes(bp);
    });

    // Hâlâ boşsa (çok teorik), tamamen havuzu dön
    if (filteredResults.length === 0) {
      filteredResults = mockExercises;
    }
  }

  const normalized = filteredResults.map(normalizeExercise);
  // Rastgele karıştır (Her seferinde farklı program çıksın diye)
  const shuffled = shuffle(normalized);

  return shuffled.slice(0, limit);
};

export const fetchAllExercises = async () => {
  return mockExercises.map(normalizeExercise);
};

// --- HIPERTROFİ OPTİMİZASYONU (TOPSIS) ---
export const optimizeHypertrophyTOPSIS = (exerciseList = [], profile = {}) => {
  if (!exerciseList.length) return exerciseList;

  // 1) Kriter ağırlıkları
  const baseWeights = { ...BASE_TOPSIS_WEIGHTS };
  const { scoreBias, weightBias } = deriveProfileBias(profile);
  const weights = normalizeWeights(
    Object.fromEntries(
      Object.entries(baseWeights).map(([k, v]) => [k, v * (weightBias[k] || 1)])
    )
  );

  // 2) Ekipmana göre bilimsel puanlama
  const equipmentScores = {
    barbell: {
      tension: 1.0,
      stability: 0.9,
      isolation: 0.4,
      resistanceCurve: 0.5,
      jointSafety: 0.6,
    },
    dumbbell: {
      tension: 0.9,
      stability: 1.0,
      isolation: 0.5,
      resistanceCurve: 0.6,
      jointSafety: 0.7,
    },
    cable: {
      tension: 0.7,
      stability: 0.7,
      isolation: 0.8,
      resistanceCurve: 1.0,
      jointSafety: 0.9,
    },
    machine: {
      tension: 0.6,
      stability: 0.6,
      isolation: 0.9,
      resistanceCurve: 0.9,
      jointSafety: 1.0,
    },
    bodyweight: {
      tension: 0.4,
      stability: 0.8,
      isolation: 0.3,
      resistanceCurve: 0.3,
      jointSafety: 0.8,
    },
    resistanceband: {
      tension: 0.5,
      stability: 0.8,
      isolation: 0.5,
      resistanceCurve: 0.6,
      jointSafety: 0.9,
    },
    default: {
      tension: 0.5,
      stability: 0.5,
      isolation: 0.5,
      resistanceCurve: 0.5,
      jointSafety: 0.5,
    },
  };

  // 3) Egzersiz bazlı kriter matrisi
  const matrix = exerciseList.map((ex) => {
    const eq = equipmentScores[ex.equipment] || equipmentScores.default;
    const adjusted = Object.fromEntries(
      TOPSIS_COLUMNS.map((col) => [col, (eq[col] || 0) * (scoreBias[col] || 1)])
    );
    return {
      ...ex, // hedef, secondaryMuscles vb. bilgileri koru ki UI'da gösterilebilsin
      ...adjusted,
    };
  });

  // 4) Normalize matrix (vektör norm)
  const denom = {};

  TOPSIS_COLUMNS.forEach((col) => {
    denom[col] = Math.sqrt(matrix.reduce((sum, row) => sum + row[col] ** 2, 0));
  });

  const normalized = matrix.map((row) => ({
    ...row,
    ...Object.fromEntries(
      TOPSIS_COLUMNS.map((col) => [col, row[col] / (denom[col] || 1)])
    ),
  }));

  // 5) Ağırlıklı normalize matris
  const weighted = normalized.map((row) => ({
    ...row,
    ...Object.fromEntries(
      TOPSIS_COLUMNS.map((col) => [col, row[col] * weights[col]])
    ),
  }));

  // 6) Ideal ve negatif ideal çözümler
  const ideal = {};
  const nadir = {};

  TOPSIS_COLUMNS.forEach((col) => {
    ideal[col] = Math.max(...weighted.map((r) => r[col]));
    nadir[col] = Math.min(...weighted.map((r) => r[col]));
  });

  // 7) TOPSIS uzaklıkları + skor
  const scored = weighted.map((row) => {
    const dPlus = Math.sqrt(
      TOPSIS_COLUMNS.reduce((sum, col) => sum + (row[col] - ideal[col]) ** 2, 0)
    );
    const dMinus = Math.sqrt(
      TOPSIS_COLUMNS.reduce((sum, col) => sum + (row[col] - nadir[col]) ** 2, 0)
    );
    const score = dMinus / (dPlus + dMinus || 1);

    return {
      ...row,
      hypertrophyScore: Number(score.toFixed(4)),
    };
  });

  // 8) Skora göre sıralama (yüksek → düşük)
  return scored.sort((a, b) => b.hypertrophyScore - a.hypertrophyScore);
};

const TOPSIS_DAY_TEMPLATES = {
  push: {
    label: "Gün {n} - Push",
    focus: "Göğüs / Omuz / Triceps",
    targets: ["chest", "pectoral", "shoulder", "delt", "triceps"],
    exclude: ["back", "lat", "row", "pulldown", "hamstring", "glute"],
    required: [
      { keywords: ["chest", "pectoral", "press", "fly"], min: 2 },
      { keywords: ["shoulder", "delt"], min: 1 },
      { keywords: ["triceps"], min: 1 },
    ],
    slots: 7,
  },
  pull: {
    label: "Gün {n} - Pull",
    focus: "Sırt / biceps",
    targets: ["back", "lat", "row", "pull", "biceps"],
    exclude: ["chest", "press", "triceps"],
    required: [
      { keywords: ["row", "pull", "lat", "back"], min: 2 },
      { keywords: ["biceps"], min: 1 },
    ],
    slots: 7,
  },
  legs: {
    label: "Gün {n} - Legs & Core",
    focus: "Bacak / Glute / Core",
    targets: ["leg", "quad", "hamstring", "glute", "calf", "core"],
    exclude: ["chest", "shoulder", "press", "biceps", "triceps"],
    required: [
      { keywords: ["squat", "quad", "leg"], min: 1 },
      { keywords: ["hamstring", "deadlift", "hinge", "glute"], min: 1 },
    ],
    slots: 6,
  },
  upper: {
    label: "Gün {n} - Upper",
    focus: "Üst Vücut Kombine",
    targets: ["chest", "back", "row", "lat", "shoulder", "triceps", "biceps"],
    exclude: ["quad", "hamstring", "glute", "calf", "leg"],
    required: [
      { keywords: ["chest", "press", "fly"], min: 1 },
      { keywords: ["row", "pull", "lat", "back"], min: 1 },
      { keywords: ["triceps", "biceps"], min: 1 },
    ],
    slots: 8,
  },
  lower: {
    label: "Gün {n} - Lower",
    focus: "Alt Vücut & Core",
    targets: ["leg", "quad", "hamstring", "glute", "calf", "core"],
    exclude: ["chest", "shoulder", "press", "biceps", "triceps", "row", "lat"],
    required: [
      { keywords: ["squat", "quad", "leg"], min: 1 },
      { keywords: ["hamstring", "deadlift", "hinge", "glute"], min: 1 },
    ],
    slots: 6,
  },
  fullBodyA: {
    label: "Gün {n} - Full Body A",
    focus: "Tüm Vücut (Bas/Çek/Bacak)",
    targets: ["chest", "back", "row", "lat", "shoulder", "triceps", "biceps"],
    required: [
      { keywords: ["chest", "press", "push", "fly", "pectoral"], min: 2 },
      { keywords: ["row", "pull", "lat", "back"], min: 2 },
      { keywords: ["shoulder", "delt"], min: 2 },
      { keywords: ["bicep", "biceps"], min: 2 },
      { keywords: ["tricep", "triceps"], min: 2 },
    ],
    slots: 10,
  },
  fullBodyB: {
    label: "Gün {n} - Full Body B",
    focus: "Tüm Vücut (Posterior & Core)",
    targets: [
      "chest",
      "pectoral",
      "back",
      "row",
      "lat",
      "shoulder",
      "triceps",
      "biceps",
    ],
    required: [
      { keywords: ["chest", "press", "push", "fly", "pectoral"], min: 2 },
      { keywords: ["row", "pull", "lat", "back"], min: 2 },
      { keywords: ["shoulder", "delt", "press"], min: 2 },
      { keywords: ["bicep", "biceps"], min: 2 },
      { keywords: ["tricep", "triceps"], min: 2 },
    ],
    slots: 10,
  },
  support: {
    label: "Gün {n} - Destek",
    focus: "Stabilite / Core / Kardiyo",
    targets: ["core", "waist", "conditioning", "shoulder"],
    slots: 4,
  },
};

const AVAILABILITY_PATTERNS = {
  2: ["fullBodyA", "fullBodyB"],
  3: ["push", "pull", "legs"],
  4: ["upper", "lower", "upper", "lower"],
  5: ["push", "pull", "legs", "upper", "lower"],
  6: ["push", "pull", "legs", "push", "pull", "legs"],
};

const GOAL_EXTRAS = {
  "yağ kaybı": {
    forceSupportDay: true,
    extraTargets: ["conditioning", "cardio", "core"],
  },
  dayanıklılık: {
    forceSupportDay: true,
    extraTargets: ["conditioning", "core", "waist"],
  },
  "kas kazanımı": {
    forceSupportDay: false,
    extraTargets: [],
  },
};

const buildDayTemplates = (availability = 3, goal = "Kas Kazanımı") => {
  const dayCount = Math.max(1, Math.min(Number(availability) || 3, 6));
  const defaultPattern = ["push", "pull", "legs", "support"].slice(0, dayCount);
  let keys = AVAILABILITY_PATTERNS[dayCount] || defaultPattern;

  const goalKey = (goal || "").toLowerCase();
  const extras = GOAL_EXTRAS[goalKey] || GOAL_EXTRAS["kas kazanımı"];

  if (extras.forceSupportDay && keys.length) {
    keys = [...keys.slice(0, keys.length - 1), "support"];
  }

  return keys.map((key, index) => {
    const baseTemplate =
      TOPSIS_DAY_TEMPLATES[key] || TOPSIS_DAY_TEMPLATES.support;
    const label = (baseTemplate.label || `Gün {n}`).replace("{n}", index + 1);

    const mergedTargets = Array.from(
      new Set([...(baseTemplate.targets || []), ...(extras.extraTargets || [])])
    );

    return { ...baseTemplate, label, targets: mergedTargets };
  });
};

const matchesTargetGroup = (exercise = {}, keywords = [], exclude = []) => {
  const text = `${exercise.name || ""} ${exercise.target || ""} ${
    exercise.bodyPart || ""
  } ${(exercise.targetMuscles || []).join(" ")}`.toLowerCase();
  if (exclude.some((kw) => text.includes(kw))) return false;
  return keywords.some((kw) => text.includes(kw));
};

const pickFromRanked = (ranked = [], keywords = [], usedSet, exclude = []) =>
  ranked.find(
    (ex) => !usedSet.has(ex.id) && matchesTargetGroup(ex, keywords, exclude)
  );

const buildExplanation = ({ profile, weights, ranked, days }) => {
  const age = profile?.age ? `${profile.age} yaş` : "yaş belirtilmedi";
  const height = profile?.height ? `${profile.height} cm` : "boy belirtilmedi";
  const weight = profile?.weight ? `${profile.weight} kg` : "kilo belirtilmedi";
  const goal = profile?.selectedGoal || "Kas Kazanımı";
  const experience = profile?.experience || "beginner";

  const sortedCriteria = Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, val]) => `${key} (${(val * 100).toFixed(0)}%)`)
    .join(", ");

  const topExercises = ranked
    .slice(0, 5)
    .map((ex) => ex.name)
    .join(", ");

  const dayHighlights = days
    .map(
      (d) =>
        `${d.day}: ${d.exercises
          .slice(0, 3)
          .map((e) => e.name)
          .join(", ")}`
    )
    .join(" | ");

  return (
    `Profil: ${age}, ${height}, ${weight}, deneyim: ${experience}, hedef: ${goal}. ` +
    `TOPSIS kriter önceliği: ${sortedCriteria}. ` +
    `Öncelikli ilk 5 hareket: ${topExercises}. ` +
    `Günlere dağılım: ${dayHighlights}. ` +
    `Seçimler, hedef ve deneyim seviyene göre frekans/yoğunluk ayarlanarak optimize edildi.`
  );
};

// Profil verisi ile TOPSIS sıralamasını kullanarak günlük program oluşturur
export const buildTopsisWorkoutProgram = ({
  exercises = [],
  profile = {},
  availability = 3,
} = {}) => {
  const ranked = optimizeHypertrophyTOPSIS(exercises, profile);
  if (!ranked.length) {
    return { days: [], explanation: "Egzersiz bulunamadı", ranked: [] };
  }

  const scheme = deriveRepSchemeFromProfile(profile);
  const dayTemplates = buildDayTemplates(availability, profile.selectedGoal);
  const used = new Set();

  const days = dayTemplates.map((dayTemplate, dayIndex) => {
    const dayExercises = [];
    const addExercise = (exercise) => {
      used.add(exercise.id);
      dayExercises.push({
        ...exercise,
        sets: scheme.sets,
        reps: scheme.reps,
        tempo: scheme.tempo,
        intensity: scheme.intensity,
      });
    };

    const pickWithReuse = (keywords) =>
      ranked.find(
        (ex) =>
          matchesTargetGroup(ex, keywords, dayTemplate.exclude) &&
          !dayExercises.some((d) => d.id === ex.id)
      );

    // Önce zorunlu kas gruplarını doldur
    (dayTemplate.required || []).forEach(({ keywords = [], min = 1 }) => {
      let count = 0;
      while (
        count < min &&
        dayExercises.length < (dayTemplate.slots || dayExercises.length)
      ) {
        const picked =
          pickFromRanked(ranked, keywords, used, dayTemplate.exclude) ||
          pickWithReuse(keywords);
        if (!picked) break;
        addExercise(picked);
        count += 1;
      }
    });

    dayTemplate.targets.forEach((target) => {
      if (dayExercises.length >= (dayTemplate.slots || dayExercises.length)) {
        return;
      }
      const picked =
        pickFromRanked(ranked, [target], used, dayTemplate.exclude) ||
        pickFromRanked(
          ranked,
          dayTemplate.targets,
          used,
          dayTemplate.exclude
        ) ||
        pickWithReuse([target]) ||
        pickWithReuse(dayTemplate.targets);

      if (picked) {
        addExercise(picked);
      }
    });

    while (dayExercises.length < (dayTemplate.slots || dayExercises.length)) {
      const fallback =
        pickFromRanked(
          ranked,
          dayTemplate.targets,
          used,
          dayTemplate.exclude
        ) || pickWithReuse(dayTemplate.targets);
      if (!fallback) break;
      addExercise(fallback);
    }

    return {
      day: dayTemplate.label || `Gün ${dayIndex + 1}`,
      focus: dayTemplate.focus,
      exercises: dayExercises,
      intensity: scheme.intensity,
    };
  });

  const adjustedWeights = normalizeWeights(
    Object.fromEntries(
      Object.entries(BASE_TOPSIS_WEIGHTS).map(([k, v]) => [
        k,
        v * (deriveProfileBias(profile).weightBias[k] || 1),
      ])
    )
  );

  const explanation = buildExplanation({
    profile,
    weights: adjustedWeights,
    ranked,
    days,
  });

  return { days, explanation, ranked };
};
