"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Para GAS necesitamos usar un enfoque diferente debido a CORS
      const isProduction = process.env.NODE_ENV === "production"
      const apiUrl = isProduction
        ? "https://script.google.com/macros/s/AKfycbwylvGDM9sqOofSPfTIU1tPyTOJqPGAfUcXhRnq3gQtItF_RCutecsGPiuArr01S0PoKw/exec"
        : "/api/auth"

      if (isProduction) {
        // Enfoque para producción: redirección con parámetros
        const params = new URLSearchParams({
          usuario: username,
          contrasena: password,
          callback: window.location.origin + "/auth-callback",
        }).toString()

        // Guardar el nombre de usuario en sessionStorage para recuperarlo después
        sessionStorage.setItem("pendingUsername", username)

        // Redirigir a GAS con parámetros
        window.location.href = `${apiUrl}?${params}`
        return // Detener la ejecución aquí
      } else {
        // En desarrollo, seguimos usando fetch
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            usuario: username,
            contrasena: password,
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Guardar información del usuario en localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              username,
              role: data.role || data.rol, // Manejar ambos formatos de respuesta
              isAuthenticated: true,
            }),
          )

          // Redirigir al portal
          router.push("/portal")
        } else {
          toast({
            title: "Error de autenticación",
            description: data.message || data.error || "Usuario o contraseña incorrectos",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
