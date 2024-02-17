import { fetchApi } from "../../api/api";
import {
  assignTicketRequest,
  serviceResponse,
  serviceWorker,
  userServiceResponse,
} from "../../models/service";

export const fetchServices = async (): Promise<serviceResponse[]> => {
  const response = await fetchApi("/ticket/service/list", "GET");
  return response.data.results as serviceResponse[];
};

export const fetchUserServices = async (
  inProgress?: boolean
): Promise<userServiceResponse[]> => {
  const response = await fetchApi(
    inProgress ? "/ticket/list?filtered=true" : "/ticket/list/",
    "GET"
  );
  return response.data.results as userServiceResponse[];
};

export const fetchServicesById = async (
  id: number
): Promise<serviceResponse> => {
  const response = await fetchApi(`/ticket/service/show/${id}`, "GET");
  return response.data as serviceResponse;
};

export const AddClientService = async (data: any): Promise<any> => {
  const response = await fetchApi("/ticket/create/", "POST", data);
  return response.data;
};

export const ClientAcceptServicePrice = async (data: {
  id: number;
}): Promise<any> => {
  const response = await fetchApi(
    `/ticket/action/client_accept/${data.id}`,
    "PATCH"
  );
  return response.data;
};

export const ClientRejectServicePrice = async (data: {
  id: number;
}): Promise<any> => {
  const response = await fetchApi(
    `/ticket/action/client_reject/${data.id}`,
    "PATCH"
  );
  return response.data;
};

export const fetchStaffAvailableServices = async (): Promise<
  userServiceResponse[]
> => {
  const response = await fetchApi("/ticket/staff_tickets_list/", "GET");
  return response.data.results as userServiceResponse[];
};

export const fetchStaffServicesById = async (
  id: number
): Promise<userServiceResponse> => {
  const response = await fetchApi(`/ticket/staff_ticket_details/${id}`, "GET");
  return response.data as userServiceResponse;
};

export const AssignTicket = async (data: assignTicketRequest): Promise<any> => {
  const response = await fetchApi(
    `/ticket/staff_assign_update/${data.id}`,
    "PATCH",
    data
  );
  return response.data;
};

export const fetchServiceWorkersById = async (
  id: number
): Promise<serviceWorker[]> => {
  const response = await fetchApi(`/st/workerslistbyserv/${id}`, "GET");
  return response.data.results as serviceWorker[];
};
