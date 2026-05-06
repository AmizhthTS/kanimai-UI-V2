import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface MonthPickerProps {
  value: string; // MM-YYYY
  onChange: (value: string) => void;
  className?: string;
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MonthPicker = ({ value, onChange, className }: MonthPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value
  const [initialMonth, initialYear] = value.split("-");
  const [viewYear, setViewYear] = useState(parseInt(initialYear) || new Date().getFullYear());

  const currentMonthIdx = parseInt(initialMonth) - 1;

  const handleYearChange = (offset: number) => {
    setViewYear(prev => prev + offset);
  };

  const handleMonthSelect = (monthIdx: number) => {
    const formattedMonth = (monthIdx + 1).toString().padStart(2, "0");
    onChange(`${formattedMonth}-${viewYear}`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-32 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700 justify-start h-auto hover:bg-slate-100 transition-all",
            className
          )}
        >
          <Calendar className="mr-2 h-3 w-3 text-primary" />
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 rounded-2xl shadow-2xl border-slate-100 bg-white" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => handleYearChange(-1)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-black text-slate-900 tracking-widest">{viewYear}</span>
            <button
              onClick={() => handleYearChange(1)}
              disabled={viewYear >= new Date().getFullYear()}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-900 disabled:opacity-10 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, idx) => {
              const now = new Date();
              const currentYear = now.getFullYear();
              const currentMonth = now.getMonth();
              
              const isSelected = currentMonthIdx === idx && viewYear === parseInt(initialYear);
              const isFuture = viewYear > currentYear || (viewYear === currentYear && idx > currentMonth);
              
              return (
                <button
                  key={month}
                  disabled={isFuture}
                  onClick={() => handleMonthSelect(idx)}
                  className={cn(
                    "py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-500 hover:bg-slate-50 hover:text-primary",
                    isFuture && "opacity-20 cursor-not-allowed hover:bg-transparent hover:text-slate-300"
                  )}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthPicker;
