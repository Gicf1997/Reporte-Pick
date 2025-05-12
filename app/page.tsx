"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Portal OS</CardTitle>
          <CardDescription>Seleccione una opción para continuar</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Gestionar Pedidos
            </Button>
          </Link>
          <Link href="/portal?app=preparacion" className="w-full">
            <Button className="w-full" variant="outline" size="lg">
              Realizar Picking
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
