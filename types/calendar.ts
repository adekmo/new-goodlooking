export type CalendarEvent = {
  title?: string;
  start: Date;
  end: Date;
  resource?: {
    bookingId?: string;
    status?: string;
  };
};