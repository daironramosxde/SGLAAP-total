// src/components/CalendarComponent.jsx
import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarComponent.css'; 

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarComponent({ events = [], title = 'Calendario', color = '#0d3b66' }) {
  return (
    <div className="calendar-wrapper">
      <h5 className="calendar-title">{title}</h5>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ minHeight: 400 }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: color,
            color: 'white',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.85rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
          },
        })}
      />
    </div>
  );
}
