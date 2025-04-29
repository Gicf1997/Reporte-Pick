"use client"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DateRangePicker } from "@/components/date-range-picker"
import { FilterSelector } from "@/components/filter-selector"
import { useFilters } from "@/context/filter-context"
import { useClientes, useEstadosPedidoUnicos, usePreparadores } from "@/hooks/use-api"

export function DashboardSidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { filters, updateFilter } = useFilters()

  // Cargar datos de filtros desde la API
  const { data: clientes, isLoading: isLoadingClientes } = useClientes()
  const { data: estadosPedido, isLoading: isLoadingEstados } = useEstadosPedidoUnicos()
  const { data: preparadores, isLoading: isLoadingPreparadores } = usePreparadores()

  // Datos de ejemplo para los filtros de eventos (no hay endpoint específico para esto)
  const eventos = ["Todos", "Faltante", "Sobrante", "Averiado", "ErrorDeCodigo"]

  // Preparar opciones para los selectores
  const clientesOptions = isLoadingClientes ? ["Cargando..."] : ["Todos", ...(clientes || [])]
  const estadosOptions = isLoadingEstados ? ["Cargando..."] : ["Todos", ...(estadosPedido || [])]
  const preparadoresOptions = isLoadingPreparadores ? ["Cargando..."] : ["Todos", ...(preparadores || [])]

  return (
    <>
      {/* Versión móvil */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-xl font-bold">Filtros</SheetTitle>
          </SheetHeader>
          <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Rango de fechas</h3>
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

            <FilterSelector
              title="Estado del Pedido"
              options={estadosOptions}
              value={filters.estadoPedido || "Todos"}
              onChange={(value) => updateFilter("estadoPedido", value === "Todos" ? "" : value)}
              isLoading={isLoadingEstados}
            />

            <FilterSelector
              title="Evento"
              options={eventos}
              value={filters.evento || "Todos"}
              onChange={(value) => updateFilter("evento", value === "Todos" ? "" : value)}
            />

            <FilterSelector
              title="Cliente"
              options={clientesOptions}
              value={filters.cliente || "Todos"}
              onChange={(value) => updateFilter("cliente", value === "Todos" ? "" : value)}
              isLoading={isLoadingClientes}
            />

            <FilterSelector
              title="Preparador"
              options={preparadoresOptions}
              value={filters.preparador || "Todos"}
              onChange={(value) => updateFilter("preparador", value === "Todos" ? "" : value)}
              isLoading={isLoadingPreparadores}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Versión desktop */}
      <div className="hidden lg:block w-[280px] border-r bg-card overflow-y-auto h-screen">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Filtros</h2>
        </div>
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Rango de fechas</h3>
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

          <FilterSelector
            title="Estado del Pedido"
            options={estadosOptions}
            value={filters.estadoPedido || "Todos"}
            onChange={(value) => updateFilter("estadoPedido", value === "Todos" ? "" : value)}
            isLoading={isLoadingEstados}
          />

          <FilterSelector
            title="Evento"
            options={eventos}
            value={filters.evento || "Todos"}
            onChange={(value) => updateFilter("evento", value === "Todos" ? "" : value)}
          />

          <FilterSelector
            title="Cliente"
            options={clientesOptions}
            value={filters.cliente || "Todos"}
            onChange={(value) => updateFilter("cliente", value === "Todos" ? "" : value)}
            isLoading={isLoadingClientes}
          />

          <FilterSelector
            title="Preparador"
            options={preparadoresOptions}
            value={filters.preparador || "Todos"}
            onChange={(value) => updateFilter("preparador", value === "Todos" ? "" : value)}
            isLoading={isLoadingPreparadores}
          />
        </div>
      </div>
    </>
  )
}
