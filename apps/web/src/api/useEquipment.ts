import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { equipmentApi } from "./equipment";
import type { CreateEquipment } from "@puck/api";

export function useEquipment() {
  return useQuery({ queryKey: ["equipment"], queryFn: equipmentApi.listAll });
}

export function useEquipmentItem(id: number) {
  return useQuery({
    queryKey: ["equipment", id],
    queryFn: () => equipmentApi.get(id),
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEquipment) => equipmentApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["equipment"] }),
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => equipmentApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["equipment"] }),
  });
}
