import { NaiveBayesClassifier } from './model';
import { NutritionData } from '../types';

export const trainModel = async (dataset: NutritionData[]): Promise<NaiveBayesClassifier> => {
  const model = new NaiveBayesClassifier();
  await model.train(dataset);
  return model;
};
