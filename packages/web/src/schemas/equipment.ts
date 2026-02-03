export const equipmentSchema = {
  name: {
    required: true,
    minLength: 2,
    message: "Name is required (min 2 chars)",
  },
  type: { required: true, message: "Type is required" },
};

export interface EquipmentFormState {
  name: string;
  type: "GRINDER" | "BREWER";
}
