// src/components/CalendarComponent.jsx
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/CalendarOverride.css';


const locales = {
  es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarComponent({ events = [], title = 'Calendario', color = '#0d3b66' }) {
  return (
    <div className="mb-4">
      <h5 className="mb-3">{title}</h5>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: color,
            color: 'white',
            borderRadius: '4px',
            padding: '2px 6px',
          },
        })}
      />
    </div>
  );
}
