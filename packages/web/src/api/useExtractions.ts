import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref, computed } from "vue";
import { extractionApi } from "./extractions";
import type {
  CreateExtraction,
  UpdateExtraction,
  PaginationMeta,
} from "@/types";

export function useExtractions() {
  return useQuery({
    queryKey: ["extractions"],
    queryFn: () => extractionApi.listAll(),
  });
}

export function useExtraction(id: number) {
  return useQuery({
    queryKey: ["extractions", id],
    queryFn: () => extractionApi.get(id),
  });
}

export function usePaginatedExtractions(initialPage = 1, perPage = 25) {
  const page = ref(initialPage);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["extractions", { page, perPage }],
    queryFn: () => extractionApi.listAll({ page: page.value, perPage }),
  });

  const meta = computed<PaginationMeta | undefined>(
    () => query.data.value?.meta,
  );

  function setPage(newPage: number) {
    page.value = newPage;
  }

  function nextPage() {
    if (meta.value && page.value < meta.value.totalPages) {
      setPage(page.value + 1);
    }
  }

  function prevPage() {
    if (page.value > 1) {
      setPage(page.value - 1);
    }
  }

  return {
    ...query,
    meta,
    setPage,
    nextPage,
    prevPage,
  };
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
