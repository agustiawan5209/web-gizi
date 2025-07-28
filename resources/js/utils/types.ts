export interface NutritionData {
  "usia balita (bulan)": string;
  "jenis kelamin": string;
  "tinggi badan (cm)": string;
  "berat badan (kg)": string;
  "lingkar kepala (cm)": string;
  "lingkar lengan (cm)": string;
  status: string;
}

export interface ApiResponse {
  attributes: string[];
  dataset: NutritionData[];
  label: string[];
  target: string;
}

export interface ClassificationFormData {
  usia: string;
  jenisKelamin: string;
  tinggiBadan: string;
  beratBadan: string;
  lingkarKepala: string;
  lingkarLengan: string;
}

export type NutritionStatus =
  "gizi buruk" | "gizi kurang" | "gizi baik" | "gizi lebih";
