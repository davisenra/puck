import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { coffeeApi } from "./coffees";
import type { CreateCoffee, UpdateCoffee } from "@/types";

export function useCoffees() {
  return useQuery({ queryKey: ["coffees"], queryFn: coffeeApi.listAll });
}

export function useCoffee(id: number) {
  return useQuery({
    queryKey: ["coffees", id],
    queryFn: () => coffeeApi.get(id),
  });
}

export function useCreateCoffee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoffee) => coffeeApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coffees"] }),
  });
}

export function useUpdateCoffee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCoffee }) =>
      coffeeApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coffees"] }),
  });
}

export function useDeleteCoffee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => coffeeApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coffees"] }),
  });
}
