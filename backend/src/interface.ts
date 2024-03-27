interface EventPrice {
  amount: number;
  name: string;
}

interface EventParticipantReferrals {
  amount: number;
  name: string;
  participant: string;
}

interface EventParticipants {
  participant: string;
  ticket: EventPrice;
  referral_code: string;
  referrals: Array<EventParticipantReferrals>;
}

enum EventStatus {
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
  prices: Array<EventPrice>;
  capacity: number;
  organizer: string;
  dao: boolean;
  referral: boolean;
  status: EventStatus;
  participants: EventParticipants;
  minReferrals: number;
  referralDiscount: number;
  tokenUrl: string;
}

export interface EventPayload {
  id: number;
  name: string;
  action: "add" | "delete" | "get" | "get_all";
}
