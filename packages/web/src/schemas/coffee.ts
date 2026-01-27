export const coffeeSchema = {
  roaster: {
    required: true,
    minLength: 2,
    message: "Roaster is required (min 2 chars)",
  },
  name: {
    required: true,
    minLength: 2,
    message: "Name is required (min 2 chars)",
  },
  roastDate: {},
  process: {
    maxLength: 50,
    message: "Process must be at most 50 characters",
  },
  notes: {
    maxLength: 500,
    message: "Notes must be at most 500 characters",
  },
  archived: {},
};

export interface CoffeeFormState {
  roaster: string;
  name: string;
  roastDate: string | Date | null;
  process: string | null;
  notes: string | null;
  archived?: boolean;
}
