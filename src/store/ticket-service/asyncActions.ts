import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/API";
import { TicketData, TicketType } from "./types";
import { appendTickets, setTickets } from "./ticketSlice";

export const getTicketsByUserId = createAsyncThunk(
  "tickets/getByUserId",
  async (
    {
      userId,
      currentPageNumber,
      recordsPerPage,
    }: { userId: string; currentPageNumber?: number; recordsPerPage?: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await instance.post(`/Tickets/tickets/${userId}`, {
        currentPageNumber: currentPageNumber ?? 1,
        recordsPerPage: recordsPerPage ?? 8,
      });

      const { data } = response.data;

      if (currentPageNumber) {
        dispatch(appendTickets(data));
      } else {
        dispatch(setTickets(data));
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (
    { userId, ticket }: { userId: string; ticket: Partial<TicketType> },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(`/Tickets/${userId}`, ticket);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async (data: TicketType, { rejectWithValue }) => {
    try {
      const { id, title, description, messages } = data;
      const currentDate = new Date().toISOString();

      const response = await instance.put(`/Tickets/${id}`, {
        title,
        description,
        comment: "",
        summary: "",
        status: 0,
        messages,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/Tickets/${ticketId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchTickets = createAsyncThunk(
  "tickets/searchTickets",
  async (
    { userId, ticketTitle }: { userId: string; ticketTitle: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await instance.post(`/Tickets/search/${userId}`, {
        ticketTitle,
        pagination: {
          currentPageNumber: 1,
          recordsPerPage: 12,
        },
      });

      const { data } = response.data;

      dispatch(setTickets(data));

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
