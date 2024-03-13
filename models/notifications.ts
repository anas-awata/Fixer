import { userServiceResponse } from "./service";

export interface notificationResponse {
  id: number;
  user: number;
  type: number;
  date: string;
  title: string;
  body: string;
  is_seen: boolean;
  ticket:userServiceResponse
}
