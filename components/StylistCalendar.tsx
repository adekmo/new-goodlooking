"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CalendarEvent } from "@/types/calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

type Props = {
  events: CalendarEvent[];
  backgroundEvents: CalendarEvent[];
};

export default function StylistCalendar({
  events,
  backgroundEvents,
}: Props) {
  return (
    <div className="h-125 bg-white rounded-xl p-4">
      <Calendar
        localizer={localizer}
        events={events}
        backgroundEvents={backgroundEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["day", "week", "month"]}
      />
    </div>
  );
}