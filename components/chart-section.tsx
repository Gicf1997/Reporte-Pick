"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumenDiarioChart } from "@/components/charts/resumen-diario-chart"
import { TopSKUChart } from "@/components/charts/top-sku-chart"
import { ProductividadChart } from "@/components/charts/productividad-chart"
import { ImpactoEconomicoChart } from "@/components/charts/impacto-economico-chart"
import { EstadosPedidoChart } from "@/components/charts/estados-pedido-chart"

export function ChartSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="resumen">Resumen Diario</TabsTrigger>
          <TabsTrigger value="topsku">Top SKU</TabsTrigger>
          <TabsTrigger value="productividad">Productividad</TabsTrigger>
          <TabsTrigger value="impacto">Impacto Económico</TabsTrigger>
          <TabsTrigger value="estados">Estados Pedido</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolución Diaria de Horas Trabajadas</CardTitle>
              <CardDescription>Análisis de horas trabajadas y eventos registrados por día</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResumenDiarioChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topsku" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top SKU Afectados</CardTitle>
              <CardDescription>Productos con mayor número de incidencias</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TopSKUChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productividad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productividad por Preparador</CardTitle>
              <CardDescription>Rendimiento individual de cada preparador</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ProductividadChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impacto" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Eventos</CardTitle>
              <CardDescription>Impacto económico por tipo de evento</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ImpactoEconomicoChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estados del Pedido</CardTitle>
              <CardDescription>Distribución de pedidos por estado</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <EstadosPedidoChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
