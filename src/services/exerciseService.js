import axios from 'axios';

const API_BASE_URL = 'https://www.exercisedb.dev/api/v1';
const DEFAULT_HOST = 'www.exercisedb.dev';

const safeId = () => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeExercise = (exercise = {}) => {
  // ExerciseDB formatından array'leri normalize et
  const targetMuscles = exercise.targetMuscles || (exercise.target ? [exercise.target] : []);
  const bodyParts = exercise.bodyParts || (exercise.bodyPart ? [exercise.bodyPart] : []);
  const equipments = exercise.equipments || (exercise.equipment ? [exercise.equipment] : []);
  
  // İlk değeri string olarak al (backward compatibility için)
  const primaryTarget = Array.isArray(targetMuscles) && targetMuscles.length > 0
    ? targetMuscles[0]
    : exercise.target || exercise.bodyPart || 'genel';
  
  const primaryBodyPart = Array.isArray(bodyParts) && bodyParts.length > 0
    ? bodyParts[0]
    : exercise.bodyPart || exercise.target || 'genel';
  
  const primaryEquipment = Array.isArray(equipments) && equipments.length > 0
    ? equipments[0]
    : exercise.equipment || 'vücut ağırlığı';
  
  return {
    id: exercise.exerciseId || exercise.id || exercise.uuid || exercise._id || safeId(),
    name: exercise.name || 'Bilinmeyen Egzersiz',
    target: primaryTarget,
    bodyPart: primaryBodyPart,
    equipment: primaryEquipment,
    // Array formatlarını koru
    targetMuscles: Array.isArray(targetMuscles) ? targetMuscles : (primaryTarget ? [primaryTarget] : []),
    bodyParts: Array.isArray(bodyParts) ? bodyParts : (primaryBodyPart ? [primaryBodyPart] : []),
    equipments: Array.isArray(equipments) ? equipments : (primaryEquipment ? [primaryEquipment] : []),
    secondaryMuscles: Array.isArray(exercise.secondaryMuscles) ? exercise.secondaryMuscles : [],
    instructions: Array.isArray(exercise.instructions) ? exercise.instructions : [],
    gifUrl: exercise.gifUrl || exercise.gif || '',
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

export const mockExercises = [
  {
    id: 'hiit-cardio',
    name: 'Yüksek Yoğunluklu Interval Kardiyo',
    target: 'cardio',
    equipment: 'body weight',
    secondaryMuscles: ['core', 'legs'],
    gifUrl: 'https://media.giphy.com/media/l3vRfNA1p0rvhMSvS/giphy.gif',
  },
  {
    id: 'heavy-lift',
    name: 'Karma Barbell Kompleksi',
    target: 'strength',
    equipment: 'barbell',
    secondaryMuscles: ['back', 'glutes'],
    gifUrl: 'https://media.giphy.com/media/l0MYIjwJ8H5b1u4J2/giphy.gif',
  },
  {
    id: 'yoga-mobility',
    name: 'Dinamik Mobilite Akışı',
    target: 'flexibility',
    equipment: 'mat',
    secondaryMuscles: ['core', 'stability'],
    gifUrl: 'https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif',
  },
];

/**
 * Fetches exercises filtered by body part or target muscle group using
 * the official ExerciseDB endpoints documented at https://www.exercisedb.dev/docs.
 * If no API key is provided (development), we fall back to curated mock data.
 *
 * @param {{
 *  filter?: string,
 *  filters?: Array<{filter: string, mode?: 'target' | 'bodyPart'}>,
 *  limit?: number,
 *  apiKey?: string,
 *  mode?: 'target' | 'bodyPart'
 * }} params
 * @returns {Promise<Array>}
 */
export const fetchExercises = async ({
  filter = 'cardio',
  filters,
  limit = 10,
  apiKey,
  mode = 'target',
} = {}) => {
  const key = apiKey || import.meta.env.VITE_RAPIDAPI_KEY;

  if (!key) {
    return mockExercises.slice(0, limit);
  }

  const requestQueue = filters?.length
    ? filters
    : [
        {
          filter,
          mode,
        },
      ];
  const perRequestLimit = Math.max(5, Math.ceil(limit / requestQueue.length));

  try {
    const responses = await Promise.all(
      requestQueue.map(async ({ filter: innerFilter, mode: innerMode = 'target' }) => {
        const endpoint = innerMode === 'bodyPart' ? 'bodyPart' : 'target';
        const resourceUrl = `${API_BASE_URL}/exercises/${endpoint}/${innerFilter}`;

        const { data } = await axios.get(resourceUrl, {
          headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': DEFAULT_HOST,
          },
          params: { limit: perRequestLimit },
        });

        return Array.isArray(data) ? data : [];
      }),
    );

    const merged = responses.flat().map(normalizeExercise);
    const uniqueMap = new Map();
    merged.forEach((exercise) => {
      if (!uniqueMap.has(exercise.id)) {
        uniqueMap.set(exercise.id, exercise);
      }
    });

    const uniqueList = shuffle(Array.from(uniqueMap.values()));

    return uniqueList.slice(0, limit);
  } catch (error) {
    console.error('ExerciseDB fetch failed. Falling back to mock data.', error);
    return mockExercises.slice(0, limit).map(normalizeExercise);
  }
};

/**
 * Retrieves the complete exercise catalogue from the base endpoint.
 * Useful for populating dropdownlar veya offline cache senaryoları.
 *
 * @param {{apiKey?: string, limit?: number}} params
 * @returns {Promise<Array>}
 */
export const fetchAllExercises = async ({ apiKey, limit } = {}) => {
  const key = apiKey || import.meta.env.VITE_RAPIDAPI_KEY;

  if (!key) {
    return mockExercises;
  }

  try {
    const { data } = await axios.get(`${API_BASE_URL}/exercises`, {
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': DEFAULT_HOST,
      },
      params: limit ? { limit } : undefined,
    });

    return data.map(normalizeExercise);
  } catch (error) {
    console.error('ExerciseDB full fetch failed. Returning mock data.', error);
    return mockExercises.map(normalizeExercise);
  }
};

