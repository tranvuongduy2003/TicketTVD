export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dob: Date;
  gender: Gender | string;
  avatar: string;
  status: Status | string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  totalBoughtTickets?: number;
  totalEvents?: number;
  totalSoldTickets?: number;
}

export interface Customer extends User {
  totalBoughtTickets: number;
}

export interface Organizer extends User {
  totalEvents: number;
  totalSoldTickets: number;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE'
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  phoneNumber: string;
  password: string;
  role: Role;
}
