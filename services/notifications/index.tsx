import { fetchApi } from "../../api/api";
import { notificationResponse } from "../../models/notifications";

export const fetchNotifications = async (
  filtered: boolean
): Promise<notificationResponse[]> => {
  const response = await fetchApi(
    filtered ? "/notif/list?filtered=true" : "/notif/list/",
    "GET"
  );
  return response.data.results as notificationResponse[];
};

export const fetchNotificationsNumber = async (): Promise<{
  unseen_count: number;
}> => {
  const response = await fetchApi("/notif/unseen/", "GET");
  return response.data as { unseen_count: number };
};

export const MarkNotificationAsRead = async (data: {
  id: number;
}): Promise<any> => {
  const response = await fetchApi(`/notif/seen/${data.id}/`, "PATCH");
  return response.data;
};
