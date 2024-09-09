// @ts-nocheck
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function DateTimePickerV2({
  selectedDate = () => {}, // Default to an empty function if not provided
  placholder,
}: {
  selectedDate: (date: string) => void;
  placholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  const handleDateChange = (selected: Date | null) => {
    if (selected) {
      setDate(selected);
      const formattedDate = format(selected, "dd/MM/yyyy");
      selectedDate(formattedDate); // Pass the selected date back to the parent
    }
  };

  return (
    <>
      <div className="flex w-full gap-4">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div
              variant={"outline"}
              className={cn(
                "w-full font-normal flex items-center bg-white border cursor-pointer py-2 px-2 rounded-sm",
                !date && "text-muted-foreground"
              )}
            >
              {date ? (
                `${format(date, "dd/MM/yyyy")}`
              ) : (
                <span>{placholder && placholder}</span>
              )}
              <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={date}
              onSelect={handleDateChange}
              fromYear={1940}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
