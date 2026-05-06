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

interface DateRangePickerInputProps {
  control: any;
  errors: any;
  name: string;
  textLable?: string;
  placeholderName?: string;
  labelMandatory?: boolean;
  requiredMsg?: string;
  disabledDates?: (date: Date) => boolean;
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
}

const DateRangePickerInput = ({
  control,
  errors,
  name,
  textLable,
  placeholderName = "Select date range",
  labelMandatory,
  requiredMsg,
  disabledDates,
  icon,
  // startIcon,
  endIcon,
  disabled = false,
}: DateRangePickerInputProps) => {
  const hasError = errors?.[name];
  const errorMessage = hasError ? errors[name]?.message : "";

  return (
    <div className="space-y-2 w-full">
      {/* Label */}
      {textLable && (
        <Label htmlFor={name} className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {icon && icon}
          {textLable} {labelMandatory && <span className="text-rose-500">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required: requiredMsg }}
        render={({ field }) => (
          <div className="relative w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-black text-xs h-12 rounded-2xl bg-slate-50 border-slate-100 px-6",
                    !field.value && "text-slate-400",
                    hasError && "border-rose-500 focus-visible:ring-rose-500"
                  )}
                  aria-invalid={!!hasError}
                  disabled={disabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, "dd/MM/yyyy")} -{" "}
                        {format(field.value.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(field.value.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>{placeholderName}</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-slate-100" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={field.value?.from}
                  selected={field.value}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                  disabled={disabledDates}
                  className="rounded-2xl"
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
      {errorMessage && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errorMessage}</p>}
    </div>
  );
};

export default DateRangePickerInput;
