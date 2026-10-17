export interface Reservation {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
}

export interface GuestMessage {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}
