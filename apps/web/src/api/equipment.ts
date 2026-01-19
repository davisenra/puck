import client from "./client";
import type { Equipment, EquipmentList, CreateEquipment } from "@puck/api";

export const equipmentApi = {
  listAll: () => client.get<EquipmentList>("/equipment"),
  get: (id: number) => client.get<Equipment>(`/equipment/${id}`),
  create: (data: CreateEquipment) =>
    client.post<CreateEquipment, Equipment>("/equipment", data),
  delete: (id: number) => client.delete(`/equipment/${id}`),
};
