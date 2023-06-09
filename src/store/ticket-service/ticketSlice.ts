import { createSlice } from "@reduxjs/toolkit";
import {
  createTicket,
  deleteTicket,
  getTicketsByUserId,
  searchTickets,
  updateTicket,
} from "./asyncActions";
import { ITicketReducer, TicketData } from "./types";

const initialState: ITicketReducer = {
  loading: false,
  loadingMore: false,
  updating: false,
  tickets: [],
  activeTicket: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setActiveTicket: (state, action) => {
      state.activeTicket = action.payload;
    },
    addLocalTicket: (state, action) => {
      state.tickets.unshift(action.payload);
    },
    removeLocalTicket: (state) => {
      state.tickets.shift();
    },
    resetTickets: (state) => {
      state.tickets = initialState.tickets;
      state.activeTicket = initialState.activeTicket;
    },
    updateLocalTicket: (state, action) => {
      const ticketIndex = state.tickets.findIndex(
        (ticket) => ticket.id === action.payload.id
      );
      if (ticketIndex !== -1) {
        const existingTicket = state.tickets[ticketIndex];
        const updatedTicket = { ...existingTicket, ...action.payload };
        state.tickets.splice(ticketIndex, 1, updatedTicket);
      }
    },
    setIsTicketUpdate: (state, action) => {
      state.isTicketUpdate = action.payload;
    },
    setTickets: (state, action) => {
      const data = action.payload;
      const sortedData = data.sort((a: TicketData, b: TicketData) => {
        const dateA = a.updatedDate || a.createdDate;
        const dateB = b.updatedDate || b.createdDate;
        const timestampA = new Date(dateA).getTime();
        const timestampB = new Date(dateB).getTime();
        return timestampA - timestampB;
      });

      state.tickets = sortedData;
    },
    appendTickets: (state, action) => {
      state.tickets.push(...action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTicketsByUserId.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(getTicketsByUserId.fulfilled, (state) => {
        state.loadingMore = false;
      })
      .addCase(searchTickets.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(searchTickets.fulfilled, (state) => {
        state.loadingMore = false;
      })
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTicket.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateTicket.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateTicket.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateTicket.rejected, (state) => {
        state.updating = false;
      })
      .addCase(deleteTicket.pending, (state) => {
        state.updating = true;
      })
      .addCase(deleteTicket.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(deleteTicket.rejected, (state) => {
        state.updating = false;
      });
  },
});

export const {
  setActiveTicket,
  setTickets,
  appendTickets,
  addLocalTicket,
  resetTickets,
  removeLocalTicket,
  updateLocalTicket,
  setIsTicketUpdate,
} = ticketSlice.actions;

export default ticketSlice.reducer;
