export const extractionSchema = {
  coffeeId: { required: true, message: "Coffee is required" },
  brewerId: { required: true, message: "Brewer is required" },
  grinderId: {},
  grindSetting: {},
  dose: { required: true, min: 0, message: "Dose is required" },
  yield: { required: true, min: 0, message: "Yield is required" },
  brewTime: { required: true, min: 0, message: "Brew time is required" },
  waterTemp: {},
  rating: { required: true, min: 1, max: 5, message: "Rating must be 1-5" },
  tastingNotes: {},
  recipeMetadata: {},
};

export interface ExtractionFormState {
  coffeeId: number | null;
  brewerId: number | null;
  grinderId: number | null;
  grindSetting: string | null;
  dose: number | null;
  yield: number | null;
  brewTime: number | null;
  waterTemp: number | null;
  rating: number;
  tastingNotes: string | null;
  recipeMetadata: Record<string, unknown> | null;
}
