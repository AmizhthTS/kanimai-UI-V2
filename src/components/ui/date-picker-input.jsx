import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export function DatePickerInput({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  minDate,
  maxDate,
  className,
}) {
  const handleSelect = (date) => {
    if (!date) return;

    // min/max date validation
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

    onChange(date);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={(date) =>
            (minDate && date < minDate) || (maxDate && date > maxDate)
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
