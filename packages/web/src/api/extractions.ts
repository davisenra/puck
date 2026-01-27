import client from "./client";
import type {
  Extraction,
  ExtractionList,
  CreateExtraction,
  UpdateExtraction,
} from "@/types";

export const extractionApi = {
  listAll: () => client.get<ExtractionList>("/extractions"),
  get: (id: number) => client.get<Extraction>(`/extractions/${id}`),
  create: (data: CreateExtraction) =>
    client.post<CreateExtraction, Extraction>("/extractions", data),
  update: (id: number, data: UpdateExtraction) =>
    client.put<UpdateExtraction, Extraction>(`/extractions/${id}`, data),
  delete: (id: number) => client.delete(`/extractions/${id}`),
};
