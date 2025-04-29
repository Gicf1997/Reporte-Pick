"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DashboardSidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/header"
import { KpiCards } from "@/components/kpi-cards"
import { ChartSection } from "@/components/chart-section"
import { ClientesTable } from "@/components/clientes-table"
import { FilterProvider } from "@/context/filter-context"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <FilterProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader onMenuButtonClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="space-y-6">
                <KpiCards />
                <ChartSection />
                <ClientesTable />
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </FilterProvider>
  )
}
