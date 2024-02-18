export interface logIn {
  email: string;
  password: string;
}

export interface Activate {
  email: string;
  code: string;
}

export interface register {
  mobile: string;
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
}
