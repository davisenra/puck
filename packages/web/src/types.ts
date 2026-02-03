export type EquipmentType = "GRINDER" | "BREWER";

export interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  createdAt: Date;
  updatedAt: Date;
}

export type EquipmentList = Equipment[];

export interface CreateEquipment {
  name: string;
  type: EquipmentType;
}

export interface UpdateEquipment {
  name: string;
}

export interface Coffee {
  id: number;
  roaster: string;
  name: string;
  roastDate: Date | null;
  process: string | null;
  notes: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CoffeeList = Coffee[];

export interface CreateCoffee {
  roaster: string;
  name: string;
  roastDate: Date | null;
  process: string | null;
  notes: string | null;
  archived?: boolean;
}

export interface UpdateCoffee {
  roaster?: string;
  name?: string;
  roastDate?: Date | null;
  process?: string | null;
  notes?: string | null;
  archived?: boolean;
}

export interface EquipmentReference {
  id: number;
  name: string;
}

export interface CoffeeReference {
  id: number;
  name: string;
}

export interface Extraction {
  id: number;
  coffee: CoffeeReference;
  brewer: EquipmentReference;
  grinder: EquipmentReference | null;
  grindSetting: string | null;
  dose: number;
  yield: number;
  brewTime: number;
  waterTemp: number | null;
  rating: number;
  tastingNotes: string | null;
  recipeMetadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export type ExtractionList = Extraction[];

export interface CreateExtraction {
  coffeeId: number;
  brewerId: number;
  grinderId: number | null;
  grindSetting: string | null;
  dose: number;
  yield: number;
  brewTime: number;
  waterTemp: number | null;
  rating: number;
  tastingNotes: string | null;
  recipeMetadata: Record<string, unknown> | null;
}

export interface UpdateExtraction {
  dose?: number;
  yield?: number;
  brewTime?: number;
  waterTemp?: number | null;
  rating?: number;
  tastingNotes?: string | null;
  recipeMetadata?: Record<string, unknown> | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PaginatedExtractions {
  data: ExtractionList;
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface ExtractionFilterParams {
  coffeeId?: number;
  brewerId?: number;
  grinderId?: number;
}
