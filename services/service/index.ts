import { fetchApi } from "../../api/api";
import {
  assignTicketRequest,
  serviceResponse,
  serviceWorker,
  userServiceResponse,
} from "../../models/service";

export const fetchServices = async (
  byrate: boolean
): Promise<serviceResponse[]> => {
  const response = await fetchApi(
    byrate ? "/ticket/service/listbyrate" : "/ticket/service/list",
    "GET"
  );
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

export const fetchUserServiceById = async (
  id: number
): Promise<userServiceResponse> => {
  const response = await fetchApi(`/ticket/client_view/${id}`, "GET");
  return response.data as userServiceResponse;
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

export const ClientRateService = async (data: {
  id: number;
  client_rating: number;
}): Promise<any> => {
  const response = await fetchApi(
    `/ticket/action/client_rate/${data.id}`,
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
  const response = await fetchApi(
    "/ticket/staff_available_tickets_list/",
    "GET"
  );
  return response.data.results as userServiceResponse[];
};

export const fetchWorkerAssignedeServices = async (): Promise<
  userServiceResponse[]
> => {
  const response = await fetchApi("/ticket/workers_tickets_list/", "GET");
  return response.data.results as userServiceResponse[];
};

export const fetchStaffAssignedServices = async (
  filtered: boolean
): Promise<userServiceResponse[]> => {
  const response = await fetchApi(
    filtered
      ? `/ticket/staff_assigned_tickets_list?isfiltered=true`
      : `/ticket/staff_assigned_tickets_list`,
    "GET"
  );
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
    `/ticket/staff_assign_update/${data.id}/`,
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

export const StaffMarkAsPaid = async (data: {
  id: number;
  paycode: string;
}): Promise<any> => {
  const response = await fetchApi(
    `/ticket/action/mark_as_paid/${data.id}`,
    "PATCH",
    data
  );
  return response.data;
};

export const StaffRejectTicket = async (id: number): Promise<any> => {
  const response = await fetchApi(
    `/ticket/action/staff_reject_ticket/${id}`,
    "PATCH"
  );
  return response.data;
};

export const StaffMarkAsDone = async (data: {
  id: number;
  notes: string;
}): Promise<any> => {
  const response = await fetchApi(
    `/ticket/action/mark_as_closed/${data.id}`,
    "PATCH"
  );
  return response.data;
};
