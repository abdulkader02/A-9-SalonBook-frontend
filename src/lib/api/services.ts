
import type { FeaturedService, Service } from "@/lib/type/services";
import {
  isFeaturedServiceList,
  isService,
  isServiceList,
} from "@/lib/type/services";
import { ApiError, apiRequest, UNEXPECTED_RESPONSE_MESSAGE } from "@/lib/api";

type GetServicesParams = {
  search?: string;
  category?: string;
  sort?: string;
};

const unexpectedResponse = () =>
  new ApiError(500, UNEXPECTED_RESPONSE_MESSAGE);

export const getServices = async ({
  search = "",
  category = "",
  sort = "",
}: GetServicesParams = {}): Promise<Service[]> => {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category && category !== "all") params.set("category", category);
  if (sort && sort !== "default") params.set("sort", sort);

  const query = params.toString();

  const data = await apiRequest<unknown>(
    `/services${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  );

  if (!isServiceList(data)) throw unexpectedResponse();

  return data;
};

export const getServiceById = async (id: string): Promise<Service> => {
  const data = await apiRequest<unknown>(`/services/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (!isService(data)) throw unexpectedResponse();

  return data;
};

// Fetches up to 6 active services for the homepage featured section.
export const getFeaturedServices = async (): Promise<FeaturedService[]> => {
  const data = await apiRequest<unknown>("/services/featured", {
    cache: "no-store",
  });

  if (!isFeaturedServiceList(data)) throw unexpectedResponse();

  return data;
};
