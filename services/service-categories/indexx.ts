import { fetchApi } from "../../api/api";
import { serviceResponse } from "../../models/service";
import { serviceCategoryResponse } from "../../models/service-categories";

export const fetchServiceCategories = async (): Promise<
  serviceCategoryResponse[]
> => {
  const response = await fetchApi("/ticket/service/cat/list", "GET");
  return response.data.results as serviceCategoryResponse[];
};

export const fetchServiceCategory = async (
  id: number
): Promise<serviceResponse[]> => {
  const response = await fetchApi(
    `/ticket/services_by_category/?category_id=${id}`,
    "GET"
  );
  return response.data.results as serviceResponse[];
};
