"use client"

import { useEstadosPedido } from "@/hooks/use-api"
import { useFilters } from "@/context/filter-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Chart, type ChartData } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function EstadosPedidoChart() {
  const { filters } = useFilters()
  const { data, isLoading, error } = useEstadosPedido(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="h-[400px] flex flex-col justify-center">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los datos de estados de pedido. Por favor, intente nuevamente más tarde.
        </AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert className="h-[400px] flex flex-col justify-center">
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>
          No hay datos de estados de pedido disponibles para los filtros seleccionados.
        </AlertDescription>
      </Alert>
    )
  }

  // Preparar datos para el gráfico
  const labels = data.map((item) => item.estado || "Sin estado")
  const cantidadPedidos = data.map((item) => item.cantidad || 0)

  // Generar colores para cada segmento
  const backgroundColors = [
    "rgb(75, 192, 192)",
    "rgb(255, 206, 86)",
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
  ]

  const chartData: ChartData = {
    labels,
    datasets: [
      {
        label: "Cantidad de Pedidos",
        backgroundColor: backgroundColors.slice(0, data.length),
        data: cantidadPedidos,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return <Chart type="doughnut" data={chartData} options={options} className="h-full w-full" />
}
