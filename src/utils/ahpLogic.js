/**
 * AHP (Analytic Hierarchy Process) helper utilities.
 *
 * The implementation follows the classic Saaty method:
 * 1. Build a pairwise comparison matrix that encodes how strongly each criterion
 *    is preferred over the others.
 * 2. Normalize the matrix by column and average the rows to get the priority vector.
 * 3. Estimate the maximum eigenvalue (λ_max) to calculate the Consistency Ratio (CR).
 *    A CR below ~0.1 is generally considered acceptable.
 */

const RANDOM_INDEX = {
  1: 0.0,
  2: 0.0,
  3: 0.58,
  4: 0.9,
  5: 1.12,
  6: 1.24,
  7: 1.32,
  8: 1.41,
  9: 1.45,
  10: 1.49,
};

/**
 * Converts simple importance ratings into a consistent pairwise comparison matrix.
 * Ratings can come from sliders (1-9). The matrix is derived via ratios:
 * a_ij = rating_i / rating_j, ensuring reciprocity (a_ji = 1 / a_ij).
 *
 * @param {number[]} ratings - Positive values representing the perceived weight of each criterion.
 * @returns {number[][]} Pairwise comparison matrix.
 */
export const buildPairwiseMatrixFromRatings = (ratings = []) => {
  if (!ratings.length) {
    throw new Error('At least one rating is required to build a pairwise matrix.');
  }

  return ratings.map((ratingI) =>
    ratings.map((ratingJ) => {
      const safeI = ratingI || 1;
      const safeJ = ratingJ || 1;
      return Number((safeI / safeJ).toFixed(4));
    }),
  );
};

/**
 * Normalizes the matrix and returns the priority vector (principal eigenvector approximation).
 * Column normalization keeps the AHP math transparent and explainable to end users.
 *
 * @param {number[][]} matrix - Pairwise comparison matrix.
 * @returns {number[]} Priority vector (weights) that sum to 1.
 */
export const calculatePriorityVector = (matrix) => {
  const size = matrix.length;
  if (!size) return [];

  const columnSums = Array.from({ length: size }, (_, colIndex) =>
    matrix.reduce((sum, row) => sum + (row[colIndex] || 0), 0),
  );

  const normalized = matrix.map((row) =>
    row.map((value, colIndex) => {
      const denominator = columnSums[colIndex] || 1;
      return value / denominator;
    }),
  );

  const priorities = normalized.map((row) => {
    const total = row.reduce((sum, value) => sum + value, 0);
    return Number((total / size).toFixed(4));
  });

  // Guard against floating point drift so the values sum to 1.
  const sum = priorities.reduce((acc, weight) => acc + weight, 0);
  return priorities.map((weight) => weight / sum);
};

const approximateLambdaMax = (matrix, priorityVector) => {
  if (!matrix.length) return 0;

  const weightedSums = matrix.map((row) =>
    row.reduce((sum, value, index) => sum + value * (priorityVector[index] || 0), 0),
  );

  const ratios = weightedSums.map((value, index) => value / (priorityVector[index] || 1));
  const lambdaMax = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;

  return lambdaMax;
};

/**
 * Computes Saaty's Consistency Ratio to highlight conflicting inputs.
 * CR = CI / RI, where CI = (λ_max - n) / (n - 1).
 *
 * @param {number[][]} matrix
 * @param {number[]} priorityVector
 * @returns {number} Consistency ratio (0..1). Lower is better.
 */
export const calculateConsistencyRatio = (matrix, priorityVector) => {
  const n = matrix.length;
  if (n < 2) return 0;

  const lambdaMax = approximateLambdaMax(matrix, priorityVector);
  const consistencyIndex = (lambdaMax - n) / (n - 1);
  const randomIndex = RANDOM_INDEX[n] ?? RANDOM_INDEX[10];

  if (!randomIndex) return 0;
  return Number((consistencyIndex / randomIndex).toFixed(4));
};

/**
 * Multiplies the criteria weights with the alternative performance scores and returns rankings.
 *
 * @param {number[]} criteriaWeights - Priority vector from AHP.
 * @param {Record<string, number[]>} alternativeMatrix - Map of alternative name to its scores per criterion.
 * @returns {{ranking: Array<{name: string, score: number}>, best: {name: string, score: number} | null}}
 */
export const rankAlternatives = (criteriaWeights, alternativeMatrix = {}) => {
  const ranking = Object.entries(alternativeMatrix).map(([name, scores]) => {
    const score = scores.reduce(
      (total, criterionScore, index) => total + criterionScore * (criteriaWeights[index] || 0),
      0,
    );
    return { name, score: Number(score.toFixed(4)) };
  });

  ranking.sort((a, b) => b.score - a.score);
  return { ranking, best: ranking[0] ?? null };
};

/**
 * Convenience method that runs the full pipeline: build matrix -> weights -> consistency.
 *
 * @param {number[]} ratings
 * @returns {{matrix: number[][], weights: number[], consistencyRatio: number}}
 */
export const deriveWeightsFromRatings = (ratings) => {
  const matrix = buildPairwiseMatrixFromRatings(ratings);
  const weights = calculatePriorityVector(matrix);
  const consistencyRatio = calculateConsistencyRatio(matrix, weights);

  return { matrix, weights, consistencyRatio };
};

