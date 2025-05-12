"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Función para generar hash SHA-256
async function generarHash256(texto: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(texto)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

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
      // Generar hash de la contraseña
      const hash = await generarHash256(password)

      // URL del script de Google
      const scriptUrl =
        "https://script.google.com/macros/s/AKfycbzwAI_iR6jTwd3fj37NPKY5nkaJpV9EboEnbUZj7_4EYx7kQFRnujEBZYz9uBo4L5dxog/exec"

      // Construir URL con parámetros
      const url = `${scriptUrl}?usuario=${encodeURIComponent(username)}&hash=${encodeURIComponent(hash)}`

      // Realizar la solicitud GET
      const response = await fetch(url)
      const data = await response.json()

      if (data.rol) {
        // Guardar información del usuario en localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            username,
            name: data.nombre || username,
            role: data.rol,
            isAuthenticated: true,
          }),
        )

        // Redirigir al portal
        router.push("/portal")
      } else {
        toast({
          title: "Error de autenticación",
          description: "Usuario o contraseña incorrectos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error de autenticación:", error)
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
