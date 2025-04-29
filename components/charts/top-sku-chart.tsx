"use client"

import { useTopSKUEventos } from "@/hooks/use-api"
import { useFilters } from "@/context/filter-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Chart, type ChartData } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function TopSKUChart() {
  const { filters } = useFilters()
  const { data, isLoading, error } = useTopSKUEventos(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="h-[400px] flex flex-col justify-center">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los datos de SKUs. Por favor, intente nuevamente más tarde.
        </AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert className="h-[400px] flex flex-col justify-center">
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>No hay datos de SKUs disponibles para los filtros seleccionados.</AlertDescription>
      </Alert>
    )
  }

  // Ordenar y limitar a los 10 principales
  const sortedData = [...data].sort((a, b) => (b.cantidad_eventos || 0) - (a.cantidad_eventos || 0)).slice(0, 10)

  // Preparar datos para el gráfico
  const labels = sortedData.map((item) => item.sku || "Sin SKU")
  const cantidadEventos = sortedData.map((item) => item.cantidad_eventos || 0)

  const chartData: ChartData = {
    labels,
    datasets: [
      {
        label: "Cantidad de Eventos",
        backgroundColor: "rgb(54, 162, 235)",
        data: cantidadEventos,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    scales: {
      x: {
        title: {
          display: true,
          text: "Cantidad de Eventos",
        },
      },
      y: {
        title: {
          display: true,
          text: "SKU",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Eventos: ${context.raw}`,
        },
      },
    },
  }

  return <Chart type="bar" data={chartData} options={options} className="h-full w-full" />
}
