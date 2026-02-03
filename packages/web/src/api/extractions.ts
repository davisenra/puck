import client from "./client";
import type {
  Extraction,
  PaginatedExtractions,
  CreateExtraction,
  UpdateExtraction,
  PaginationParams,
} from "@/types";

export const extractionApi = {
  listAll: (params?: PaginationParams) =>
    client.get<PaginatedExtractions>("/extractions", {
      query: params as Record<string, unknown>,
    }),
  get: (id: number) => client.get<Extraction>(`/extractions/${id}`),
  create: (data: CreateExtraction) =>
    client.post<CreateExtraction, Extraction>("/extractions", data),
  update: (id: number, data: UpdateExtraction) =>
    client.put<UpdateExtraction, Extraction>(`/extractions/${id}`, data),
  delete: (id: number) => client.delete(`/extractions/${id}`),
};
