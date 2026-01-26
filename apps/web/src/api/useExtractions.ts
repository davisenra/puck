import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { extractionApi } from "./extractions";
import type { CreateExtraction, UpdateExtraction } from "@/types";

export function useExtractions() {
  return useQuery({
    queryKey: ["extractions"],
    queryFn: extractionApi.listAll,
  });
}

export function useExtraction(id: number) {
  return useQuery({
    queryKey: ["extractions", id],
    queryFn: () => extractionApi.get(id),
  });
}

export function useCreateExtraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExtraction) => extractionApi.create(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["extractions"] }),
  });
}

export function useUpdateExtraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExtraction }) =>
      extractionApi.update(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["extractions"] }),
  });
}

export function useDeleteExtraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => extractionApi.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["extractions"] }),
  });
}
