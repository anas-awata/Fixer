export interface logIn {
  email: string;
  password: string;
  device_reg_id: string;
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

export interface editProfile {
  mobile: string;
  full_name: string;
  id: number;
}

export interface resetPassword {
  old_password: string;
  new_password1: string;
  new_password2: string;
}
