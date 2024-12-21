'use client'

import { useState, useEffect } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Gasto {
  fecha: string
  hora: string
  tipo: string
  descripcion: string
  monto: number
}

interface DatosCierre {
  fecha: string
  dineroReparto: number
  dineroCaja: number
  dineroQueda: number
  totalTransferencias: number
}

export default function Graficos() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [datosCierre, setDatosCierre] = useState<DatosCierre | null>(null)

  useEffect(() => {
    const savedGastos = localStorage.getItem('gastos')
    if (savedGastos) {
      setGastos(JSON.parse(savedGastos))
    }

    const savedDatosCierre = localStorage.getItem('datosCierre')
    if (savedDatosCierre) {
      setDatosCierre(JSON.parse(savedDatosCierre))
    }
  }, [])

  const gastosPorTipo = gastos.reduce((acc, gasto) => {
    acc[gasto.tipo] = (acc[gasto.tipo] || 0) + gasto.monto
    return acc
  }, {} as Record<string, number>)

  const dataBar = {
    labels: Object.keys(gastosPorTipo),
    datasets: [
      {
        label: 'Gastos por Tipo',
        data: Object.values(gastosPorTipo),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const optionsBar = {
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

  const dataDoughnut = datosCierre ? {
    labels: ['Dinero de Reparto', 'Dinero de Caja', 'Dinero que Queda', 'Total Transferencias'],
    datasets: [
      {
        data: [datosCierre.dineroReparto, datosCierre.dineroCaja, datosCierre.dineroQueda, datosCierre.totalTransferencias],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  } : null

  const optionsDoughnut = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: datosCierre ? `Cierre de Caja - ${datosCierre.fecha}` : 'No hay datos de cierre',
      },
    },
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gráficos de Gastos</h1>
      {datosCierre && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Cierre de Caja</h2>
          <div className="w-full h-96">
            <Doughnut data={dataDoughnut!} options={optionsDoughnut} />
          </div>
        </div>
      )}
      <div className="w-full h-96">
        <Bar options={optionsBar} data={dataBar} />
      </div>
    </div>
  )
}

