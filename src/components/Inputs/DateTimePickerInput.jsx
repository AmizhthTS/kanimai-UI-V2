import React from "react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getValueFromPath } from "../../utils";
import { TimePicker } from "@/components/ui/time-picker";

const DateTimePickerInput = ({
  control,
  errors,
  name,
  textLable,
  placeholderName = "Select date & time",
  labelMandatory,
  requiredMsg,
  minDate,
  maxDate,
  icon,
  startIcon,
  endIcon,
  disabled = false,
}) => {
  const hasError = errors?.[name];
  const errorMessage = hasError
    ? errors[name]?.message
    : name?.includes(".")
    ? getValueFromPath(errors, `${name}.message`)
    : "";

  return (
    <div className="space-y-2 w-full">
      {/* Label */}
      {textLable && (
        <Label htmlFor={name} className="flex items-center gap-1">
          {icon && icon}
          {textLable} {labelMandatory && "*"}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required: requiredMsg }}
        render={({ field }) => (
          <div className="relative w-full">
            {startIcon && (
              <div
                className="absolute left-0 top-0 h-full flex items-center px-3 
                bg-gray-50 border-r rounded-l-md"
              >
                {startIcon}
              </div>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-sm h-10",
                    startIcon ? "pl-[115px]" : "",
                    !field.value && "text-muted-foreground",
                    hasError && "border-destructive focus-visible:ring-destructive"
                  )}
                  aria-invalid={!!hasError}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value
                    ? format(field.value, "dd/MM/yyyy HH:mm")
                    : placeholderName}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(newDate) => {
                    if (!newDate) return;

                    let currentValue = field.value;
                    if (currentValue && typeof currentValue === "string") {
                      currentValue = new Date(currentValue);
                    }
                    const baseDate =
                      currentValue instanceof Date && !isNaN(currentValue.getTime())
                        ? currentValue
                        : new Date();

                    newDate.setHours(baseDate.getHours());
                    newDate.setMinutes(baseDate.getMinutes());
                    newDate.setSeconds(0);
                    newDate.setMilliseconds(0);

                    if (minDate && newDate < minDate) return;
                    if (maxDate && newDate > maxDate) return;

                    field.onChange(newDate);
                  }}
                  initialFocus
                  disabled={(date) =>
                    (minDate && date < minDate) || (maxDate && date > maxDate)
                  }
                />
                <div className="p-3 border-t bg-muted/20">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Select Time
                  </div>
                  <TimePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* End Icon */}
            {endIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground">
                {endIcon}
              </div>
            )}
          </div>
        )}
      />

      {/* Error Message */}
      {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
    </div>
  );
};

export default DateTimePickerInput;
