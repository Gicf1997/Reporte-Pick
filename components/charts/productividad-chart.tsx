"use client"

import { useProductividad } from "@/hooks/use-api"
import { useFilters } from "@/context/filter-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Chart, type ChartData } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function ProductividadChart() {
  const { filters } = useFilters()
  const { data, isLoading, error } = useProductividad(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="h-[400px] flex flex-col justify-center">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los datos de productividad. Por favor, intente nuevamente más tarde.
        </AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert className="h-[400px] flex flex-col justify-center">
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>No hay datos de productividad disponibles para los filtros seleccionados.</AlertDescription>
      </Alert>
    )
  }

  // Preparar datos para el gráfico
  const labels = data.map((item) => item.trabajador || "Sin nombre")
  const scores = data.map((item) => item.score || 0)

  const chartData: ChartData = {
    labels,
    datasets: [
      {
        label: "Puntuación de Productividad",
        backgroundColor: "rgb(75, 192, 192)",
        data: scores,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Puntuación",
        },
      },
      x: {
        title: {
          display: true,
          text: "Preparador",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return <Chart type="bar" data={chartData} options={options} className="h-full w-full" />
}
