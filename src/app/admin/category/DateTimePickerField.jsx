import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export default function DateTimePickerField({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [timeInput, setTimeInput] = useState("");

  // Initialize time input when value changes
  useEffect(() => {
    if (value) {
      setTimeInput(format(value, "HH:mm"));
    } else {
      setTimeInput("");
    }
  }, [value]);

  const handleDateSelect = (date) => {
    if (!date) return;

    // If we have existing time, combine with new date
    if (timeInput && timeInput.includes(":")) {
      const [hours, minutes] = timeInput.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      onChange(newDate);
    } else {
      // Default to current time if no time set
      const now = new Date();
      const newDate = new Date(date);
      newDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      onChange(newDate);
      setTimeInput(format(newDate, "HH:mm"));
    }
    setOpen(false);
  };

  const handleTimeChange = (time) => {
    setTimeInput(time);
    if (value && time && time.includes(":")) {
      const [hours, minutes] = time.split(":");
      const newDate = new Date(value);
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      onChange(newDate);
    }
  };

  const displayValue = value
    ? `${format(value, "dd MMM yyyy")} ${format(value, "HH:mm")}`
    : placeholder;

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              !value ? "text-muted-foreground" : ""
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            fromYear={2020}
            toYear={2030}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Input
          type="time"
          value={timeInput}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="flex-1"
          placeholder="HH:MM"
        />
      </div>
    </div>
  );
}
