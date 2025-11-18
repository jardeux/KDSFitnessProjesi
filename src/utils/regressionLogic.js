import { linearRegression, linearRegressionLine } from 'simple-statistics';

/**
 * Linear regression utilities for the "Future You" predictor.
 *
 * We fit a simple y = a + b * x model where:
 * - x = week index (0..N)
 * - y = tracked metric (weight, muscle score, etc.)
 * The slope (b) captures the expected weekly change.
 */

/**
 * Generates mock historical samples tailored to a lightweight user profile so
 * the regression has context even before we collect real telemetry.
 *
 * @param {{weight: number, availability: number, experience: string}} profile
 * @returns {Array<[number, number]>} Tuples of [week, metricValue]
 */
export const buildMockHistoricalDataset = (profile) => {
  const { weight = 75, availability = 3, experience = 'beginner' } = profile;

  const baseChange =
    experience === 'beginner' ? 0.6 : experience === 'intermediate' ? 0.3 : 0.15;

  const activityBoost = availability / 7; // more training days -> larger slope.
  const slope = (activityBoost + baseChange) * (profile.goal === 'fat-loss' ? -1 : 1);

  return Array.from({ length: 8 }, (_, week) => {
    const noise = (Math.random() - 0.5) * 0.4; // deterministic enough for mock.
    const metric = weight + slope * week + noise;
    return [week, Number(metric.toFixed(2))];
  });
};

/**
 * Trains a regression line y = a + b * x and returns both the coefficients and the prediction fn.
 *
 * @param {Array<[number, number]>} samples
 * @returns {{coefficients: {m: number, b: number}, predict: (x: number) => number}}
 */
export const trainProgressModel = (samples) => {
  if (!samples?.length) {
    throw new Error('Regression requires at least one data point.');
  }

  const coefficients = linearRegression(samples);
  const predict = linearRegressionLine(coefficients);

  return { coefficients, predict };
};

/**
 * Projects future progress for N weeks using the regression function.
 *
 * @param {(x: number) => number} predictFn
 * @param {number} weeks
 * @param {number} startingWeek
 * @returns {Array<{week: number, value: number}>}
 */
export const projectFutureProgress = (predictFn, weeks = 12, startingWeek = 0) => {
  return Array.from({ length: weeks }, (_, index) => {
    const week = startingWeek + index + 1;
    const value = Number(predictFn(week).toFixed(2));
    return { week, value };
  });
};

/**
 * End-to-end helper: build dataset -> train -> project.
 *
 * @param {{weight: number, availability: number, experience: string, goal?: string}} profile
 * @returns {{history: Array<[number, number]>, projection: Array<{week: number, value: number}>, coefficients: {m: number, b: number}}}
 */
export const buildRegressionPlan = (profile) => {
  const history = buildMockHistoricalDataset(profile);
  const model = trainProgressModel(history);
  const projection = projectFutureProgress(model.predict, 12, history.length - 1);

  return {
    history,
    projection,
    coefficients: model.coefficients,
  };
};

