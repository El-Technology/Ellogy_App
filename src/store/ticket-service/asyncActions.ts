import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../utils/API";
import { TicketData } from "./types";
import {appendTickets, setTickets} from "./ticketSlice";

export const getTicketsByUserId = createAsyncThunk(
  "tickets/getByUserId",
  async (
    { userId, currentPageNumber, recordsPerPage }: { userId: string; currentPageNumber?: number, recordsPerPage?: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      console.log(recordsPerPage)
      const response = await instance.post(`/Tickets/getTickets/${userId}`, {
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
  async (userId, { rejectWithValue }) => {
    try {
      const currentDate = new Date().toISOString();

      const response = await instance.post(`/Tickets/${userId}`, {
        title: "New request",
        description:
          "We will generate a description automatically as soon as we get some information from you.\n\nYou can change the title and description at any time.",
        createdDate: currentDate,
        status: 0,
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async (data: TicketData, { rejectWithValue }) => {
    try {
      const { id, title, description } = data;
      const currentDate = new Date().toISOString();

      const response = await instance.put("/Tickets", {
        id,
        title,
        description,
        comment: "",
        summary: "",
        updatedDate: currentDate,
        status: 0,
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
