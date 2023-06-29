export interface ITicketReducer {
  loading: boolean;
  updating: boolean;
  tickets: TicketType[],
  activeTicket?: TicketData
}

export interface TicketType {
  id: string;
  title: string,
  description: string,
  createdDate: Date,
  status: number
}

export interface TicketData {
  id: string;
  title: string;
  description: string;
  summary: string;
  comment: string;
  createdDate: string;
  updatedDate: Date;
  status: number;
}