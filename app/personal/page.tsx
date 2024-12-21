'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PersonalEntry {
  nombre: string
  entrada: string
  salida: string
  observacion: string
}

const HORARIO_ENTRADA = '07:00'

function calcularRetraso(horaEntrada: string): string {
  const [horasEntrada, minutosEntrada] = horaEntrada.split(':').map(Number)
  const [horasEsperadas, minutosEsperados] = HORARIO_ENTRADA.split(':').map(Number)

  const entradaEnMinutos = horasEntrada * 60 + minutosEntrada
  const esperadoEnMinutos = horasEsperadas * 60 + minutosEsperados

  const retrasoEnMinutos = entradaEnMinutos - esperadoEnMinutos

  if (retrasoEnMinutos <= 0) return ''

  const horasRetraso = Math.floor(retrasoEnMinutos / 60)
  const minutosRetraso = retrasoEnMinutos % 60

  if (horasRetraso > 0) {
    return `Llegó ${horasRetraso} hora(s) y ${minutosRetraso} minuto(s) tarde.`
  } else {
    return `Llegó ${minutosRetraso} minuto(s) tarde.`
  }
}

export default function Personal() {
  const [personalEntries, setPersonalEntries] = useState<PersonalEntry[]>([])
  const [newEntry, setNewEntry] = useState<PersonalEntry>({
    nombre: '',
    entrada: '',
    salida: '',
    observacion: ''
  })

  useEffect(() => {
    const savedEntries = localStorage.getItem('personalEntries')
    if (savedEntries) {
      setPersonalEntries(JSON.parse(savedEntries))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('personalEntries', JSON.stringify(personalEntries))
  }, [personalEntries])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEntry(prev => {
      const updatedEntry = { ...prev, [name]: value }
      
      if (name === 'entrada') {
        const retraso = calcularRetraso(value)
        if (retraso) {
          updatedEntry.observacion = retraso + ' ' + updatedEntry.observacion
        }
      }
      
      return updatedEntry
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPersonalEntries(prev => [...prev, newEntry])
    setNewEntry({
      nombre: '',
      entrada: '',
      salida: '',
      observacion: ''
    })
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registro de Personal</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
        <Input
          name="nombre"
          value={newEntry.nombre}
          onChange={handleInputChange}
          placeholder="Nombre"
          required
        />
        <Input
          name="entrada"
          type="time"
          value={newEntry.entrada}
          onChange={handleInputChange}
          required
        />
        <Input
          name="salida"
          type="time"
          value={newEntry.salida}
          onChange={handleInputChange}
          required
        />
        <Textarea
          name="observacion"
          value={newEntry.observacion}
          onChange={handleInputChange}
          placeholder="Observación"
        />
        <Button type="submit" className="col-span-2">Guardar</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead>Observación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personalEntries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.nombre}</TableCell>
              <TableCell>{entry.entrada}</TableCell>
              <TableCell>{entry.salida}</TableCell>
              <TableCell>{entry.observacion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

