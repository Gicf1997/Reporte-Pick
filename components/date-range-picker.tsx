"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  from?: Date
  to?: Date
  onSelect: (range: DateRange | undefined) => void
}

export function DateRangePicker({ className, from, to, onSelect }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from || new Date(2025, 3, 1), // Default to April 1, 2025
    to: to || new Date(2025, 3, 30), // Default to April 30, 2025
  })

  React.useEffect(() => {
    if (
      from !== undefined &&
      to !== undefined &&
      (date?.from?.getTime() !== from.getTime() || date?.to?.getTime() !== to.getTime())
    ) {
      setDate({ from, to })
    }
  }, [from, to, date])

  // Eliminamos este useEffect que causaba el bucle infinito
  // y movemos la lógica al manejador de cambio de fecha

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: es })} - {format(date.to, "LLL dd, y", { locale: es })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: es })
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              if (newDate) {
                onSelect(newDate)
              }
            }}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
