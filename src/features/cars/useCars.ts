import { useQuery } from "@apollo/client";
import { GET_CARS, type CarFilters, type CarsData } from "./api";

export function useCars(filters: CarFilters) {
  const { data, loading, error, refetch } = useQuery<CarsData, CarFilters>(GET_CARS, {
    variables: filters,
    notifyOnNetworkStatusChange: true,
  });

  return {
    cars: data?.cars ?? [],
    loading,
    error: error ?? undefined,
    refetch,
  };
}