'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

interface Gasto {
  fecha: string
  hora: string
  tipo: string
  descripcion: string
  monto: number
}

export default function GestionGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [nuevoGasto, setNuevoGasto] = useState<Gasto>({
    fecha: '',
    hora: '',
    tipo: '',
    descripcion: '',
    monto: 0
  })

  useEffect(() => {
    // Set initial date only on client-side
    setNuevoGasto(prev => ({
      ...prev,
      fecha: new Date().toISOString().split('T')[0]
    }))

    // Load gastos from localStorage
    const savedGastos = localStorage.getItem('gastos')
    if (savedGastos) {
      setGastos(JSON.parse(savedGastos))
    }
  }, [])

  useEffect(() => {
    // Save gastos to localStorage whenever it changes
    localStorage.setItem('gastos', JSON.stringify(gastos))
  }, [gastos])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNuevoGasto(prev => ({ ...prev, [name]: name === 'monto' ? parseFloat(value) : value }))
  }

  const guardarGasto = () => {
    const ahora = new Date();
    const gastoConFechaYHora = {
      ...nuevoGasto,
      fecha: ahora.toISOString().split('T')[0],
      hora: ahora.toTimeString().split(' ')[0]
    };
    setGastos(prev => [...prev, gastoConFechaYHora]);
    setNuevoGasto(prev => ({
      ...prev,
      tipo: '',
      descripcion: '',
      monto: 0
    }));
  };

  const exportarAExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(gastos)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos")
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    const fechaActual = new Date().toISOString().split('T')[0]
    FileSaver.saveAs(data, `gastos_${fechaActual}.xlsx`)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Gastos</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Input
          type="text"
          name="tipo"
          value={nuevoGasto.tipo}
          onChange={handleInputChange}
          placeholder="Tipo"
        />
        <Input
          type="text"
          name="descripcion"
          value={nuevoGasto.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
        />
        <Input
          type="number"
          name="monto"
          value={nuevoGasto.monto}
          onChange={handleInputChange}
          placeholder="Monto"
        />
      </div>
      
      <div className="flex justify-between mb-4">
        <Button onClick={guardarGasto}>Guardar Gasto</Button>
        <Button onClick={exportarAExcel}>Cerrar Caja y Exportar</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gastos.map((gasto, index) => (
            <TableRow key={index}>
              <TableCell>{gasto.fecha}</TableCell>
              <TableCell>{gasto.hora}</TableCell>
              <TableCell>{gasto.tipo}</TableCell>
              <TableCell>{gasto.descripcion}</TableCell>
              <TableCell>{gasto.monto}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

