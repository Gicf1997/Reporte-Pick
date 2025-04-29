"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Filters {
  fechaInicio?: string
  fechaFin?: string
  evento?: string
  estadoPedido?: string
  cliente?: string
  preparador?: string
}

interface FilterContextType {
  filters: Filters
  updateFilter: (key: keyof Filters, value: string) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  // Inicializar con fechas por defecto (abril 2025)
  const [filters, setFilters] = useState<Filters>({
    fechaInicio: "2025-04-01",
    fechaFin: "2025-04-30",
  })

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      fechaInicio: "2025-04-01",
      fechaFin: "2025-04-30",
    })
  }

  return <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>{children}</FilterContext.Provider>
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}
