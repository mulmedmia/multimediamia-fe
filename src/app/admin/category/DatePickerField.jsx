import React from "react";
import { Input } from "@/components/ui/input";

function toLocalDateString(dateValue) {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
}

export default function DatePickerField({ value, onChange, placeholder, required = false }) {
  const inputValue = toLocalDateString(value);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!val) {
      onChange(null);
      return;
    }
    const newDate = new Date(val);
    if (!isNaN(newDate.getTime())) {
      onChange(newDate);
    }
  };

  return (
    <Input
      type="date"
      value={inputValue}
      onChange={handleChange}
      required={required}
      placeholder={placeholder}
      className="w-full cursor-pointer bg-background"
    />
  );
}
