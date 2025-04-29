"use client"

import useSWR from "swr"
import type { Filters } from "@/context/filter-context"

// URL correcta de la API de Google Apps Script
const API_BASE_URL =
  "https://script.google.com/macros/s/AKfycbx2fORdWYsodKH_hE7HV0MH8d84jgwPpaQdBBdWrB0loXFZJLUn4RnKQjbtsPcXSN8/exec"

// Habilitar modo de desarrollo cuando la API no esté disponible
const DEV_MODE = false // Cambiado a false para usar la API real

// Fetcher mejorado con mejor manejo de errores y soporte para modo de desarrollo
const fetcher = async (url: string) => {
  // Si estamos en modo de desarrollo y la URL contiene ciertos endpoints, devolver datos de ejemplo
  if (DEV_MODE) {
    console.log("🔧 Modo desarrollo activado - usando datos de ejemplo para:", url)
    return getMockData(url)
  }

  try {
    console.log("📡 Fetching data from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Importante para APIs CORS
      mode: "cors",
      // Aumentar el timeout
      signal: AbortSignal.timeout(15000), // 15 segundos de timeout
    })

    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Datos recibidos:", data)
    return data
  } catch (error) {
    console.error("❌ Error en fetcher:", error)

    // Si hay un error en producción, intentar usar datos de ejemplo como fallback
    if (!DEV_MODE) {
      console.log("⚠️ Usando datos de ejemplo como fallback")
      return getMockData(url)
    }

    throw error
  }
}

// Construye la URL con los filtros aplicados
function buildUrl(action: string, filters: Filters) {
  const url = new URL(API_BASE_URL)
  url.searchParams.append("action", action)

  if (filters.fechaInicio) {
    url.searchParams.append("fechaInicio", filters.fechaInicio)
  }

  if (filters.fechaFin) {
    url.searchParams.append("fechaFin", filters.fechaFin)
  }

  if (filters.evento) {
    url.searchParams.append("evento", filters.evento)
  }

  if (filters.estadoPedido) {
    url.searchParams.append("estadoPedido", filters.estadoPedido)
  }

  if (filters.cliente) {
    url.searchParams.append("cliente", filters.cliente)
  }

  if (filters.preparador) {
    url.searchParams.append("preparador", filters.preparador)
  }

  return url.toString()
}

// Función para generar datos de ejemplo basados en la URL solicitada
function getMockData(url: string) {
  if (url.includes("getResumenDiario")) {
    return generateMockResumenDiario()
  } else if (url.includes("getTopSKUEventos")) {
    return generateMockTopSKU()
  } else if (url.includes("getProductividad")) {
    return generateMockProductividad()
  } else if (url.includes("getImpactoEconomico")) {
    return generateMockImpactoEconomico()
  } else if (url.includes("getCostoErroresVsFacturacion")) {
    return generateMockCostoErrores()
  } else if (url.includes("getEstadosPedido")) {
    return generateMockEstadosPedido()
  } else if (url.includes("getClientesAfectados")) {
    return generateMockClientesAfectados()
  } else if (url.includes("getClientes")) {
    return ["BRUMADO", "DISTRIBUIDORA XYZ", "SUPERMERCADO EL SOL"]
  } else if (url.includes("getEstadosPedidoUnicos")) {
    return ["Pendiente", "Parcialmente Preparado", "Preparado Completo", "No Preparado"]
  } else if (url.includes("getPreparadores")) {
    return ["LILIAN JARA", "RAUL ARAUJO", "ANDY GIMENEZ"]
  }

  return []
}

// Generadores de datos de ejemplo actualizados según la documentación
function generateMockResumenDiario() {
  const startDate = new Date(2025, 3, 1) // 1 de abril de 2025
  const days = 30

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    return {
      fecha: date.toISOString().split("T")[0],
      horas_trabajadas: Math.floor(Math.random() * 10) + 5, // 5-15 horas
    }
  })
}

function generateMockTopSKU() {
  return Array.from({ length: 10 }, (_, i) => ({
    evento: ["Faltante", "Sobrante", "Dañado", "Incorrecto"][Math.floor(Math.random() * 4)],
    sku: 7896181711900 + i,
    descripcion: `PRODUCTO EJEMPLO ${i + 1}`,
    cantidad_eventos: Math.floor(Math.random() * 50) + 10,
    unidades_afectadas: Math.floor(Math.random() * 100) + 20,
    preparadores: ["LILIAN JARA", "RAUL ARAUJO"],
    clientes: ["BRUMADO", "SUPERMERCADO EL SOL"],
  }))
}

function generateMockProductividad() {
  const preparadores = ["LILIAN JARA", "RAUL ARAUJO", "ANDY GIMENEZ"]

  return preparadores.map((trabajador) => ({
    trabajador,
    score: Math.floor(Math.random() * 100) + 50,
  }))
}

function generateMockImpactoEconomico() {
  const eventos = ["Faltante", "Sobrante", "Dañado", "Incorrecto", "Retrasado"]

  return eventos.map((evento) => ({
    evento,
    monto: Math.floor(Math.random() * 5000) + 1000,
  }))
}

function generateMockCostoErrores() {
  const costoEventos = Math.floor(Math.random() * 10000) + 5000
  const totalFacturado = Math.floor(Math.random() * 100000) + 50000

  return {
    costoEventos,
    totalFacturado,
    porcentaje: Number(((costoEventos / totalFacturado) * 100).toFixed(2)),
  }
}

function generateMockEstadosPedido() {
  const estados = ["Pendiente", "Parcialmente Preparado", "Preparado Completo", "No Preparado"]

  return estados.map((estado) => ({
    estado,
    cantidad: Math.floor(Math.random() * 100) + 20,
  }))
}

function generateMockClientesAfectados() {
  const clientes = ["BRUMADO", "DISTRIBUIDORA XYZ", "SUPERMERCADO EL SOL"]

  return clientes.map((cliente) => ({
    cliente,
    cantidad_eventos: Math.floor(Math.random() * 50) + 10,
    costo: Math.floor(Math.random() * 5000) + 1000,
  }))
}

// Hooks para cada endpoint
export function useResumenDiario(filters: Filters) {
  const { data, error } = useSWR(buildUrl("getResumenDiario", filters), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000, // 10 segundos
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function useTopSKUEventos(filters: Filters) {
  const { data, error } = useSWR(buildUrl("getTopSKUEventos", filters), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function useProductividad(filters: Filters) {
  const { data, error } = useSWR(buildUrl("getProductividad", filters), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function useImpactoEconomico(filters: Filters) {
  const { data, error } = useSWR(buildUrl("getImpactoEconomico", filters), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function useCostoErroresVsFacturacion(filters: Filters) {
  const { data, error } = useSWR(buildUrl("getCostoErroresVsFacturacion", filters), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function useEstadosPedido(filters: Filters) {
  const { data, error } = useSWR(buildUrl("getEstadosPedido", filters), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function useClientesAfectados(filters: Filters) {
  const { data, error } = useSWR(buildUrl("getClientesAfectados", filters), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

// Hooks para obtener listas de filtros
export function useClientes() {
  const { data, error } = useSWR(buildUrl("getClientes", {}), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minuto
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function useEstadosPedidoUnicos() {
  const { data, error } = useSWR(buildUrl("getEstadosPedidoUnicos", {}), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minuto
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}

export function usePreparadores() {
  const { data, error } = useSWR(buildUrl("getPreparadores", {}), fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minuto
    errorRetryCount: 3,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
  }
}
