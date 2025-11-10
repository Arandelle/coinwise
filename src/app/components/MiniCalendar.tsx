"use client";

import React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";

type CalendarEvent = {
  id: string | number;
  date: string; // ISO yyyy-mm-dd recommended
  color?: string; // optional dot color
  title?: string;
};

type MiniCalendarProps = {
  value?: Date; // selected date
  onChange?: (d: Date) => void;
  events?: CalendarEvent[];
  showMonthYearHeader?: boolean;
  startWeekOnMonday?: boolean;
  size?: "sm" | "md";
};

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  value,
  onChange,
  events = [],
  showMonthYearHeader = true,
  startWeekOnMonday = false,
  size = "md",
}) => {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    value ?? new Date()
  );
  const selectedDate = value ?? null;

  const handlePrev = () => setCurrentMonth((m) => subMonths(m, 1));
  const handleNext = () => setCurrentMonth((m) => addMonths(m, 1));
  const handleDateClick = (day: Date) => {
    onChange?.(day);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: startWeekOnMonday ? 1 : 0 });
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: startWeekOnMonday ? 1 : 0 });

  // helper to get events for a day
  const getEventsForDay = (day: Date) => {
    const iso = format(day, "yyyy-MM-dd");
    return events.filter((e) => {
      // event.date could be ISO or date string; normalize
      try {
        return format(parseISO(e.date), "yyyy-MM-dd") === iso;
      } catch {
        return e.date === iso;
      }
    });
  };

  // sizing classes
  const cellSizeClasses = size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10 text-base";

  const rows = [];
  let day = weekStart;
  while (day <= weekEnd) {
    const daysRow = [];
    for (let i = 0; i < 7; i++) {
      const eventsForDay = getEventsForDay(day);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
      daysRow.push(
        <button
          key={day.toISOString()}
          onClick={() => handleDateClick(day)}
          className={`
            relative flex items-center justify-center rounded-md
            ${cellSizeClasses}
            ${isCurrentMonth ? "text-gray-800" : "text-gray-400"}
            ${isSelected ? "bg-amber-500 text-white" : "hover:bg-gray-100"}
            focus:outline-none focus:ring-2 focus:ring-amber-400
          `}
          aria-pressed={isSelected}
          aria-label={`Select ${format(day, "MMMM d, yyyy")}`}
        >
          <span>{format(day, "d")}</span>

          {/* small event indicators */}
          {eventsForDay.length > 0 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
              {eventsForDay.slice(0, 3).map((ev, idx) => (
                <span
                  key={idx}
                  style={{ backgroundColor: ev.color ?? "#F59E0B" }}
                  className="inline-block h-1 w-1 rounded-full"
                />
              ))}
            </div>
          )}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toISOString() + Math.random()} className="grid grid-cols-7 gap-1">
        {daysRow}
      </div>
    );
  }

  const weekDayLabels = startWeekOnMonday
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-md bg-white rounded-lg shadow-sm p-3">
      {/* header */}
      <div className="flex items-center justify-between mb-2">
        {showMonthYearHeader && (
          <div>
            <div className="text-sm font-semibold text-gray-700">
              {format(currentMonth, "MMMM yyyy")}
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label="Previous month"
            className="p-1 rounded hover:bg-gray-100"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            aria-label="Next month"
            className="p-1 rounded hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>

      {/* weekday labels */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
        {weekDayLabels.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* days grid */}
      <div className="space-y-1">{rows}</div>
    </div>
  );
};

export default MiniCalendar;
