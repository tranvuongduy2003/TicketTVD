export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dob: Date;
  gender: Gender;
  avatar: string;
  totalBuyedTickets: number;
  totalEvents: number;
  totalSoldTickets: number;
  status: Status;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

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
