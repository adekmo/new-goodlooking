"use client";

import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { format, parse, startOfWeek, getDay } from "date-fns";
import {enUS} from "date-fns/locale/en-US";

import { useState } from "react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent extends Event {
  status: string;
  stylist: string;
  customer: string;
  services: string[];
  total: number;
}

interface Props {
  events: BookingEvent[];
  stylists: string[];
}

const BookingCalendar = ({ events, stylists }: Props) => {

  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [stylistFilter, setStylistFilter] = useState("ALL");

  const filteredEvents =
    stylistFilter === "ALL"
      ? events
      : events.filter((e) => e.stylist === stylistFilter);
  
  const eventStyleGetter = (event: BookingEvent) => {
    let backgroundColor = "#9CA3AF";

    if (event.status === "PENDING") backgroundColor = "#FBBF24";
    if (event.status === "CONFIRMED") backgroundColor = "#3B82F6";
    if (event.status === "COMPLETED") backgroundColor = "#10B981";
    if (event.status === "CANCELLED") backgroundColor = "#EF4444";

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        color: "white",
        border: "none",
        padding: "2px 6px",
      },
    };
  };
  return (
    <div className="space-y-4">

      {/* FILTER STYLIST */}
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">Filter Stylist:</span>

        <select
          className="border rounded px-2 py-1 text-sm"
          value={stylistFilter}
          onChange={(e) => setStylistFilter(e.target.value)}
        >
          <option value="ALL">All</option>

          {stylists.map((stylist) => (
            <option key={stylist} value={stylist}>
              {stylist}
            </option>
          ))}
        </select>
      </div>

      {/* CALENDAR */}
      <div className="h-[700px] bg-white rounded-xl shadow p-4">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          defaultView="week"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedEvent(event as BookingEvent)}
        />
      </div>

      {/* MODAL DETAIL BOOKING */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4 shadow-lg">

            <h2 className="text-lg font-bold">
              Booking Detail
            </h2>

            <p>
              <strong>Customer:</strong> {selectedEvent.customer}
            </p>

            <p>
              <strong>Stylist:</strong> {selectedEvent.stylist}
            </p>

            <p>
              <strong>Status:</strong> {selectedEvent.status}
            </p>

            <p>
              <strong>Services:</strong>
            </p>

            <ul className="list-disc list-inside text-sm text-gray-600">
              {selectedEvent.services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <p>
              <strong>Total:</strong> Rp {selectedEvent.total.toLocaleString()}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-black text-white py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar