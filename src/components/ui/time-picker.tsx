import * as React from "react";
import { cn } from "@/lib/utils";

function generateNumbers(limit) {
  return Array.from({ length: limit }, (_, i) => i);
}

export function TimePicker({ value, onChange, disabled = false, className }) {
  const hours = generateNumbers(24);
  const minutes = generateNumbers(60);

  // Fix: allow null value
  const dateValue = value instanceof Date ? value : new Date();

  const handleHourChange = (e) => {
    const newHour = Number(e.target.value);
    const newDate = new Date(dateValue);
    newDate.setHours(newHour);
    onChange(newDate);
  };

  const handleMinuteChange = (e) => {
    const newMin = Number(e.target.value);
    const newDate = new Date(dateValue);
    newDate.setMinutes(newMin);
    onChange(newDate);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Hours */}
      <select
        disabled={disabled}
        className={cn(
          "border rounded-lg px-2 py-1 bg-background",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        value={dateValue.getHours()}
        onChange={handleHourChange}
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {String(h).padStart(2, "0")}
          </option>
        ))}
      </select>

      <span className="text-lg">:</span>

      {/* Minutes */}
      <select
        disabled={disabled}
        className={cn(
          "border rounded-lg px-2 py-1 bg-background",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        value={dateValue.getMinutes()}
        onChange={handleMinuteChange}
      >
        {minutes.map((m) => (
          <option key={m} value={m}>
            {String(m).padStart(2, "0")}
          </option>
        ))}
      </select>
    </div>
  );
}
