
import type { Service } from "@/lib/type/services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type GetServicesParams = {
  search?: string;
  category?: string;
  sort?: string;
};

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

  const res = await fetch(
    `${API_BASE_URL}/services${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch services (${res.status})`);
  }

  return res.json();
};

export const getServiceById = async (id: string): Promise<Service> => {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, { cache: "no-store" })
    if (!res.ok) {
        throw new Error(`Failed to fetch service (${res.status})`)
    }
    return res.json()
}
