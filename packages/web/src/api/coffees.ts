import client from "./client";
import type { Coffee, CoffeeList, CreateCoffee, UpdateCoffee } from "@/types";

export const coffeeApi = {
  listAll: () => client.get<CoffeeList>("/coffees"),
  get: (id: number) => client.get<Coffee>(`/coffees/${id}`),
  create: (data: CreateCoffee) =>
    client.post<CreateCoffee, Coffee>("/coffees", data),
  update: (id: number, data: UpdateCoffee) =>
    client.put<UpdateCoffee, Coffee>(`/coffees/${id}`, data),
  delete: (id: number) => client.delete(`/coffees/${id}`),
};
