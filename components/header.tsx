"use client"

import { Menu, Bell, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DateRangePicker } from "@/components/date-range-picker"
import { useFilters } from "@/context/filter-context"

export function DashboardHeader({ onMenuButtonClick }: { onMenuButtonClick: () => void }) {
  const { theme, setTheme } = useTheme()
  const { filters, updateFilter } = useFilters()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="lg:hidden" onClick={onMenuButtonClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-bold md:text-2xl">Dashboard Operativo</h1>
      </div>
      <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4">
        <div className="hidden md:block">
          <DateRangePicker
            from={filters.fechaInicio ? new Date(filters.fechaInicio) : undefined}
            to={filters.fechaFin ? new Date(filters.fechaFin) : undefined}
            onSelect={(range) => {
              if (range?.from) {
                updateFilter("fechaInicio", range.from.toISOString().split("T")[0])
              }
              if (range?.to) {
                updateFilter("fechaFin", range.to.toISOString().split("T")[0])
              }
            }}
          />
        </div>
      </div>
      <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Button variant="outline" size="icon">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  )
}
