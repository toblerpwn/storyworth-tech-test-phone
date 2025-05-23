import { TwilioCallStatus } from "@/types/twilio";

export type FirestoreUser = {
  id: string;
  lastLogin: Date;
  createdAt: Date;
  activeCallSid?: string;
};

export type FirestoreCall = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: TwilioCallStatus;
  recordingUrl: string | null;
};
