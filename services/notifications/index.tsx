import { fetchApi } from "../../api/api";
import { notificationResponse } from "../../models/notifications";

export const fetchNotifications = async (): Promise<notificationResponse[]> => {
  const response = await fetchApi("/notif/list/", "GET");
  return response.data.results as notificationResponse[];
};
