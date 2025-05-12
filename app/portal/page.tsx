"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface User {
  username: string
  name?: string
  role: string
  isAuthenticated: boolean
}

export default function Portal() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("preparacion")
  const router = useRouter()
  const searchParams = useSearchParams()
  const appParam = searchParams.get("app")

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const storedUser = localStorage.getItem("user")

    if (appParam === "preparacion") {
      // Si viene de "Realizar Picking", no necesita autenticación
      setActiveTab("preparacion")
    } else if (!storedUser) {
      // Si no hay usuario almacenado y no es "Realizar Picking", redirigir al login
      router.push("/login")
      return
    } else {
      // Si hay usuario almacenado, establecerlo en el estado
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Si el usuario no es admin, solo mostrar preparación
      if (parsedUser.role !== "ADMIN") {
        setActiveTab("preparacion")
      }
    }
  }, [router, appParam])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Portal OS</h1>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm">
              Usuario: <span className="font-medium">{user.name || user.username}</span> | Rol:{" "}
              <span className="font-medium">{user.role === "ADMIN" ? "Administrador" : "Usuario"}</span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Salir
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList className="mb-4">
            {(!user || user.role === "ADMIN") && (
              <>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="administracion">Administración</TabsTrigger>
              </>
            )}
            <TabsTrigger value="preparacion">Preparación</TabsTrigger>
          </TabsList>

          {(!user || user.role === "ADMIN") && (
            <>
              <TabsContent value="dashboard" className="h-[calc(100vh-140px)]">
                <iframe
                  src="https://script.googleusercontent.com/macros/echo?user_content_key=AKfycbyj4h8m5_44SBNDpsMGcO4AJTNkpqO7cHRy_vnEYYcIU_DZHHT5IS4u5exMX8lOac75"
                  className="w-full h-full border-0"
                  title="Dashboard"
                />
              </TabsContent>
              <TabsContent value="administracion" className="h-[calc(100vh-140px)]">
                <iframe
                  src="https://script.googleusercontent.com/macros/echo?user_content_key=AKfycbyH9b_E-knT2OsbSqKcEoS5fLU4U54arQ8XRWUxA5Z9MRVIEI30nQjcB-sk4mZx8xAg"
                  className="w-full h-full border-0"
                  title="Administración"
                />
              </TabsContent>
            </>
          )}

          <TabsContent value="preparacion" className="h-[calc(100vh-140px)]">
            <iframe
              src="https://script.googleusercontent.com/macros/echo?user_content_key=AKfycbwLCEICqyo_W7iyS-SWaX9QpmS4jk73ebfFRfEiUjzPvl8WnKIL9m_X8x5Wdz3icJeX"
              className="w-full h-full border-0"
              title="Preparación"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
