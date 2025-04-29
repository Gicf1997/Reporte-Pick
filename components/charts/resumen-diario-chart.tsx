"use client"

import { useResumenDiario } from "@/hooks/use-api"
import { useFilters } from "@/context/filter-context"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Chart, type ChartData } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function ResumenDiarioChart() {
  const { filters } = useFilters()
  const { data, isLoading, error } = useResumenDiario(filters)

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="h-[400px] flex flex-col justify-center">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudieron cargar los datos del resumen diario. Por favor, intente nuevamente más tarde.
        </AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert className="h-[400px] flex flex-col justify-center">
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>
          No hay datos disponibles para el período seleccionado. Intente con otro rango de fechas.
        </AlertDescription>
      </Alert>
    )
  }

  // Preparar datos para el gráfico
  const labels = data.map((item) => {
    // Manejar diferentes formatos de fecha que podría devolver la API
    try {
      const date = typeof item.fecha === "string" ? parseISO(item.fecha) : new Date(item.fecha)
      return format(date, "dd MMM", { locale: es })
    } catch (e) {
      return String(item.fecha)
    }
  })

  const horasTrabajadas = data.map((item) => item.horas_trabajadas || 0)

  // Contar eventos por fecha
  const eventosRegistrados = labels.map((_, index) => {
    return data.filter((item) => {
      const itemDate = typeof item.fecha === "string" ? parseISO(item.fecha) : new Date(item.fecha)
      const itemDateStr = format(itemDate, "dd MMM", { locale: es })
      return itemDateStr === labels[index]
    }).length
  })

  const chartData: ChartData = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Horas Trabajadas",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        fill: false,
        data: horasTrabajadas,
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "Eventos Registrados",
        backgroundColor: "rgb(255, 99, 132)",
        data: eventosRegistrados,
        yAxisID: "y1",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        position: "left" as const,
        title: {
          display: true,
          text: "Horas Trabajadas",
        },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        title: {
          display: true,
          text: "Eventos Registrados",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return <Chart type="bar" data={chartData} options={options} className="h-full w-full" />
}
