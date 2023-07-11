import { IMessage } from "src/components/Chatbot/Message/Message";

export interface ITicketReducer {
  loading: boolean;
  loadingMore: boolean;
  updating: boolean;
  tickets: TicketType[];
  activeTicket: TicketType | null;
  isTicketUpdate?: boolean;
}

export interface TicketType {
  id: string;
  title: string;
  description: string;
  summary: string;
  messages: IMessage[];
  comment: string;
  createdDate: string;
  updatedDate: Date;
  status: number;
}

export interface TicketData {
  id: string;
  title: string;
  description: string;
  summary: string;
  messages: IMessage[];
  comment: string;
  createdDate: string;
  updatedDate: Date;
  status: number;
}
