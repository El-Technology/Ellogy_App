import {createSlice} from '@reduxjs/toolkit';
import {createTicket, deleteTicket, getTicketsByUserId, updateTicket} from "./asyncActions";
import {ITicketReducer, TicketData} from "./types";

const initialState: ITicketReducer = {
  loading: false,
  updating: false,
  tickets: [],
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setActiveTicket: (state, action) => {
      state.activeTicket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTicketsByUserId.fulfilled, (state, action) => {
        const { data } = action.payload;
        state.tickets = data.sort((a: TicketData, b: TicketData) => {
          const dateA = a.updatedDate || a.createdDate;
          const dateB = b.updatedDate || b.createdDate;
          const timestampA = new Date(dateA).getTime();
          const timestampB = new Date(dateB).getTime();
          return timestampB - timestampA;
        });
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
      })
  }
});

export const { setActiveTicket } = ticketSlice.actions;

export default ticketSlice.reducer;
