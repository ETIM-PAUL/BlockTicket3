import { Address } from "viem";

interface EventTicket {
  id: number;
  amount: number;
  name: string;
}

interface EventParticipants {
  participant: string;
  type: EventTicket;
}

export enum EventStatus {
  "Pending",
  "Ongoing",
  "Ended",
  "Cancelled",
}

export interface Event {
  id: number;
  action: string;
  title: string;
  date: string;
  location: string;
  tickets: Array<EventTicket>;
  capacity: number;
  organizer: string;
  dao: boolean;
  referral: boolean;
  status: EventStatus;
  minReferrals: number;
  referralDiscount: number;
  tokenUrl: string;
  logoUrl: string;
  balance: number;
  ether_amount: number;
  referral_code: number;
  ticket: EventParticipants;
  proposal: string;
  purchased_time: string;
  ticket_type: string;
}

export interface EventPayload {
  id: number;
  name: string;
  action: "add" | "delete" | "get" | "get_all";
}
