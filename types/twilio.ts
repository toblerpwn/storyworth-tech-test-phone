export enum TwilioCallStatus {
  QUEUED = "queued",
  INITIATED = "initiated",
  RINGING = "ringing",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  BUSY = "busy",
  FAILED = "failed",
  NO_ANSWER = "no-answer",
  CANCELED = "canceled",
}

// TODO: this is just a partial type def for demo purposes
export type TwilioCallResponse = {
  sid: string; // sid for the call
  status: TwilioCallStatus;
};
