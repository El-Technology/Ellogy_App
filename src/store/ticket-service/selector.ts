import {RootState} from "../store";

export const getTicketsLoader = (state: RootState) => state.ticketRedux.loading;

export const getTicketsLoadingMore = (state: RootState) => state.ticketRedux.loadingMore;

export const getTicketUpdating = (state: RootState) => state.ticketRedux.updating;

export const getTickets = (state: RootState) => state.ticketRedux.tickets;

export const getActiveTicket = (state: RootState) => state.ticketRedux.activeTicket;

export const getIsTicketUpdate = (state: RootState) => state.ticketRedux.isTicketUpdate;
