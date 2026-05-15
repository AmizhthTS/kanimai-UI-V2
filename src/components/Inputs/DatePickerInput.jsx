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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getValueFromPath } from "../../utils";

const DatePickerInput = ({
  control,
  errors,
  name,
  textLable,
  placeholderName = "Select date",
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

  const currentYear = new Date().getFullYear();
  const fromYear = minDate ? minDate.getFullYear() : currentYear - 100;
  const toYear = maxDate ? maxDate.getFullYear() : currentYear + 10;

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
                    ? format(field.value, "dd/MM/yyyy")
                    : placeholderName}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    if (!date) return;

                    if (minDate && date < minDate) return;
                    if (maxDate && date > maxDate) return;

                    field.onChange(date);
                  }}
                  initialFocus
                  disabled={(date) =>
                    (minDate && date < minDate) || (maxDate && date > maxDate)
                  }
                  captionLayout="dropdown"
                  fromYear={fromYear}
                  toYear={toYear}
                  classNames={{
                    caption_dropdowns: "flex justify-center gap-1",
                    caption_label: "hidden",
                    dropdown: "text-sm font-medium border rounded p-1 bg-white",
                  }}
                />
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

export default DatePickerInput;
