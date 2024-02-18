export interface serviceResponse {
  id: number;
  title: string;
  description: string;
  initial_price: number;
  service_category: number;
  picture: string;
  type: "Fixing" | "Setting" | "Support";
  service: serviceResponse;
  is_final_price: boolean;
}

export interface serviceRequest {
  service: number;
  location: { latitude: number; longitude: number } | null;
  pictures: any[];
  description: string;
  info_fields: {
    device_type?: string;
    company_size?: string;
  };
}

export interface userServiceResponse {
  id: number;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  info_fields: {
    device_type?: string;
    company_size?: string;
  };
  assigned_to: null | number;
  status:
    | "Open"
    | "Rejected"
    | "Pending"
    | "Pending Approval"
    | "Client Rejected"
    | "In Progress"
    | "Closed"
    | "Rated"
    | "Pending Payment";
  client_rating: null | number;
  notes: null | string;
  submission_date: string;
  workers: number[];
  service: serviceResponse;
  final_price: number;
  client_id: number;
  email: string;
  full_name: string;
  mobile: string;
}

export interface assignTicketRequest {
  workers: number[];
  final_price?: number;
  id: number;
}

export interface serviceWorker {
  id: number;
  user: {
    id: number;
    email: string;
    full_name: string;
    is_staff: boolean;
    mobile: string;
  };
  department: string;
  salary: string;
  availability: boolean;
  services: number[];
}
