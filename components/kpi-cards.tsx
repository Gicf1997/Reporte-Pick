"use client"

import { motion } from "framer-motion"
import { Clock, AlertTriangle, DollarSign, Percent } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useResumenDiario, useCostoErroresVsFacturacion } from "@/hooks/use-api"
import { useFilters } from "@/context/filter-context"
import { Skeleton } from "@/components/ui/skeleton"

export function KpiCards() {
  const { filters } = useFilters()
  const { data: resumenData, isLoading: isLoadingResumen, error: errorResumen } = useResumenDiario(filters)
  const { data: costoData, isLoading: isLoadingCosto, error: errorCosto } = useCostoErroresVsFacturacion(filters)

  const isLoading = isLoadingResumen || isLoadingCosto
  const error = errorResumen || errorCosto

  // Valores para los KPIs basados en los datos de la API
  const kpiData = {
    horasTotales: resumenData ? resumenData.reduce((sum, day) => sum + (day.horas_trabajadas || 0), 0) : 0,
    eventosRegistrados: resumenData ? resumenData.length : 0,
    perdidaEconomica: costoData ? costoData.costoEventos : 0,
    porcentajeFacturacion: costoData ? costoData.porcentaje : 0,
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Error de carga</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-destructive">No se pudieron cargar los datos</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabajadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.horasTotales.toFixed(0)}h</div>
            <p className="text-xs text-muted-foreground">Total en el período seleccionado</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Registrados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.eventosRegistrados}</div>
            <p className="text-xs text-muted-foreground">Incidencias en el período</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pérdida Económica</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₲ {kpiData.perdidaEconomica.toLocaleString("es-PY")}</div>
            <p className="text-xs text-muted-foreground">Impacto financiero total</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Facturación Afectada</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.porcentajeFacturacion.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Del total facturado</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
