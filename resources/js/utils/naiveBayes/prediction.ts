import { NaiveBayesClassifier } from './model';
import { ClassificationFormData, NutritionStatus } from '../types';

export const predictNutritionStatus = (
    model: NaiveBayesClassifier,
    formData: any,
): NutritionStatus => {

    const features = {};

    // Iterate through the dataArray to populate the features object
    formData.forEach(item => {
        const key = Object.keys(item)[0]; // Get the key (e.g., "jenis kelamin")
        const value = item[key];         // Get the value (e.g., "Perempuan")

        switch (key) {
            case "usia balita (bulan)":
                features["usia balita (bulan)"] = parseInt(value);
                break;
            case "jenis kelamin":
                features["jenis kelamin"] = value; // No conversion needed, it's already a string
                break;
            case "tinggi badan (cm)":
                features["tinggi badan (cm)"] = parseFloat(value);
                break;
            case "berat badan (kg)":
                features["berat badan (kg)"] = parseFloat(value);
                break;
            case "lingkar kepala (cm)":
                features["lingkar kepala (cm)"] = parseFloat(value);
                break;
            case "lingkar lengan (cm)":
                features["lingkar lengan (cm)"] = parseFloat(value);
                break;
            default:
                // Handle any unexpected keys if necessary
                break;
        }
    });

    console.log(features);

    return model.predict(features);
};
