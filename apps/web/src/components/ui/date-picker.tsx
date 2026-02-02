"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onSelect,
  onDateChange,
  placeholder = "选择日期",
  className,
  disabled,
}: DatePickerProps) {
  const handleSelect = (selected: Date | undefined) => {
    onSelect?.(selected);
    onDateChange?.(selected);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-role="date-trigger"
          className={cn(
            "w-full justify-start text-left h-9 rounded-lg bg-background/60 border-border/60 shadow-sm backdrop-blur",
            "font-mono text-[0.78rem] tracking-[0.08em]",
            "hover:border-muted-foreground/40",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          <span
            className={cn(
              "truncate",
              date ? "text-foreground/90" : "text-muted-foreground/60"
            )}
          >
            {date ? format(date, "PPP", { locale: zhCN }) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateRangePickerProps {
  date?: DateRange;
  from?: Date;
  to?: Date;
  onSelect?: (range: { from?: Date; to?: Date }) => void;
  onDateChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  date,
  from,
  to,
  onSelect,
  onDateChange,
  placeholder = "选择日期范围",
  className,
  disabled,
}: DateRangePickerProps) {
  const resolvedRange = date ?? (from || to ? { from, to } : undefined);
  const displayFrom = date?.from ?? from;
  const displayTo = date?.to ?? to;

  const handleSelect = (range: DateRange | undefined) => {
    onSelect?.({ from: range?.from, to: range?.to });
    onDateChange?.(range);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-role="date-trigger"
          className={cn(
            "w-full justify-start text-left h-9 rounded-lg bg-background/60 border-border/60 shadow-sm backdrop-blur",
            "font-mono text-[0.78rem] tracking-[0.08em]",
            "hover:border-muted-foreground/40",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          {displayFrom ? (
            displayTo ? (
              <span className="flex items-center gap-1 text-foreground/90">
                <span>{format(displayFrom, "yyyy/MM/dd", { locale: zhCN })}</span>
                <span className="text-muted-foreground/70">-</span>
                <span>{format(displayTo, "yyyy/MM/dd", { locale: zhCN })}</span>
              </span>
            ) : (
              <span className="text-foreground/90">
                {format(displayFrom, "yyyy/MM/dd", { locale: zhCN })}
              </span>
            )
          ) : (
            <span className="text-muted-foreground/60">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={resolvedRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
