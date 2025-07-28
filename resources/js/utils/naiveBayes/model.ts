import * as tf from '@tensorflow/tfjs';
import { NutritionData, NutritionStatus } from '../types';

export class NaiveBayesClassifier {
  private classProbabilities: Record<NutritionStatus, number> = {
    "gizi buruk": 0,
    "gizi kurang": 0,
    "gizi baik": 0,
    "gizi lebih": 0
  };

  private featureProbabilities: Record<string, any> = {};

  constructor() {
    tf.ready();
  }

  public async train(data: NutritionData[]): Promise<void> {
    // Hitung probabilitas kelas
    const totalSamples = data.length;
    const classCounts: Record<NutritionStatus, number> = {
      "gizi buruk": 0,
      "gizi kurang": 0,
      "gizi baik": 0,
      "gizi lebih": 0
    };

    data.forEach(item => {
      classCounts[item.status as NutritionStatus]++;
    });

    for (const className in classCounts) {
      this.classProbabilities[className as NutritionStatus] =
        classCounts[className as NutritionStatus] / totalSamples;
    }

    // Hitung probabilitas fitur untuk setiap kelas
    const features = Object.keys(data[0]).filter(key => key !== 'status');

    features.forEach(feature => {
      this.featureProbabilities[feature] = {};

      for (const className in classCounts) {
        const classItems = data.filter(item => item.status === className);
        const featureValues = classItems.map(item => parseFloat(item[feature as keyof NutritionData]) || item[feature as keyof NutritionData]);

        if (typeof featureValues[0] === 'number') {
          // Fitur numerik - hitung mean dan std dev
          const valuesTensor = tf.tensor1d(featureValues);
          const mean = valuesTensor.mean().dataSync()[0];
          const std = tf.moments(valuesTensor).variance.sqrt().dataSync()[0];

          this.featureProbabilities[feature][className] = { mean, std };
        } else {
          // Fitur kategorikal - hitung probabilitas diskrit
          const valueCounts: Record<string, number> = {};
          featureValues.forEach(value => {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
          });

          for (const value in valueCounts) {
            valueCounts[value] = valueCounts[value] / classItems.length;
          }

          this.featureProbabilities[feature][className] = valueCounts;
        }
      }
    });
  }

  public predict(features: Record<string, any>): NutritionStatus {
    const scores: Record<NutritionStatus, number> = {
      "gizi buruk": Math.log(this.classProbabilities["gizi buruk"]),
      "gizi kurang": Math.log(this.classProbabilities["gizi kurang"]),
      "gizi baik": Math.log(this.classProbabilities["gizi baik"]),
      "gizi lebih": Math.log(this.classProbabilities["gizi lebih"])
    };

    for (const className in this.classProbabilities) {
      for (const feature in features) {
        const featureValue = features[feature];
        const probData = this.featureProbabilities[feature][className];

        if (typeof featureValue === 'number') {
          // Fitur numerik - gunakan distribusi normal
          const { mean, std } = probData;
          const exponent = -Math.pow(featureValue - mean, 2) / (2 * Math.pow(std, 2));
          const probability = (1 / (Math.sqrt(2 * Math.PI) * std)) * Math.exp(exponent);
          scores[className as NutritionStatus] += Math.log(probability + 1e-10); // Tambahkan smoothing
        } else {
          // Fitur kategorikal - gunakan probabilitas diskrit
          const probability = probData[featureValue] || 1e-10; // Smoothing untuk nilai yang tidak ada
          scores[className as NutritionStatus] += Math.log(probability);
        }
      }
    }

    // Temukan kelas dengan skor tertinggi
    let maxScore = -Infinity;
    let predictedClass: NutritionStatus = "gizi baik";

    for (const className in scores) {
      if (scores[className as NutritionStatus] > maxScore) {
        maxScore = scores[className as NutritionStatus];
        predictedClass = className as NutritionStatus;
      }
    }

    return predictedClass;
  }
}
