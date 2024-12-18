'use client'

import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Gasto {
  fecha: string
  hora: string
  tipo: string
  descripcion: string
  monto: number
}

export default function Graficos() {
  const [gastos, setGastos] = useState<Gasto[]>([])

  useEffect(() => {
    const savedGastos = localStorage.getItem('gastos')
    if (savedGastos) {
      setGastos(JSON.parse(savedGastos))
    }
  }, [])

  const gastosPorTipo = gastos.reduce((acc, gasto) => {
    acc[gasto.tipo] = (acc[gasto.tipo] || 0) + gasto.monto
    return acc
  }, {} as Record<string, number>)

  const data = {
    labels: Object.keys(gastosPorTipo),
    datasets: [
      {
        label: 'Gastos por Tipo',
        data: Object.values(gastosPorTipo),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Tipo de Gasto'
        }
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Monto'
        },
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gastos por Tipo',
      },
    },
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gráficos de Gastos</h1>
      <div className="w-full h-96">
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

