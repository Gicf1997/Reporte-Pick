"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useClientesAfectados } from "@/hooks/use-api"
import { useFilters } from "@/context/filter-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function ClientesTable() {
  const { filters } = useFilters()
  const { data, isLoading, error } = useClientesAfectados(filters)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes Afectados</CardTitle>
          <CardDescription>Error al cargar los datos</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="h-[300px] flex flex-col justify-center">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No se pudieron cargar los datos de clientes afectados. Por favor, intente nuevamente más tarde.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes Afectados</CardTitle>
          <CardDescription>Sin datos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="h-[300px] flex flex-col justify-center">
            <AlertTitle>Sin datos</AlertTitle>
            <AlertDescription>
              No hay datos de clientes afectados disponibles para los filtros seleccionados.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Clientes Afectados</CardTitle>
          <CardDescription>Listado de clientes con mayor número de incidencias</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Cantidad de Eventos</TableHead>
                <TableHead className="text-right">Impacto Económico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((cliente) => (
                <TableRow key={cliente.cliente}>
                  <TableCell className="font-medium">{cliente.cliente || "Sin nombre"}</TableCell>
                  <TableCell>{cliente.cantidad_eventos || 0}</TableCell>
                  <TableCell className="text-right">₲ {(cliente.costo || 0).toLocaleString("es-PY")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
