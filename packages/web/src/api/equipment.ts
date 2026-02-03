import client from "./client";
import type {
  Equipment,
  EquipmentList,
  CreateEquipment,
  UpdateEquipment,
} from "@/types";

export const equipmentApi = {
  listAll: () => client.get<EquipmentList>("/equipment"),
  get: (id: number) => client.get<Equipment>(`/equipment/${id}`),
  create: (data: CreateEquipment) =>
    client.post<CreateEquipment, Equipment>("/equipment", data),
  update: (id: number, data: UpdateEquipment) =>
    client.put<UpdateEquipment, Equipment>(`/equipment/${id}`, data),
  delete: (id: number) => client.delete(`/equipment/${id}`),
};
