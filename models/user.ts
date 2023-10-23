export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dob: Date | string;
  gender: string;
  avatar: string;
  totalBuyedTickets: number;
  status: Status;
  role: Role;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER'
}

export enum Status {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE'
}
