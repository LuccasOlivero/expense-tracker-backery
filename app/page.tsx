"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Modal } from "@/components/Modal";

interface Gasto {
  fecha: string;
  hora: string;
  tipo: string;
  descripcion: string;
  monto: number;
}

interface DatosCierre {
  dineroReparto: number;
  dineroCaja: number;
  dineroQueda: number;
  totalTransferencias: number;
}

export default function GestionGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [nuevoGasto, setNuevoGasto] = useState<Gasto>({
    fecha: "",
    hora: "",
    tipo: "",
    descripcion: "",
    monto: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datosCierre, setDatosCierre] = useState<DatosCierre>({
    dineroReparto: 0,
    dineroCaja: 0,
    dineroQueda: 0,
    totalTransferencias: 0,
  });

  useEffect(() => {
    setNuevoGasto((prev) => ({
      ...prev,
      fecha: new Date().toISOString().split("T")[0],
    }));

    const savedGastos = localStorage.getItem("gastos");
    if (savedGastos) {
      setGastos(JSON.parse(savedGastos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoGasto((prev) => ({
      ...prev,
      [name]: name === "monto" ? parseFloat(value) : value,
    }));
  };

  const handleCierreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosCierre((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const guardarGasto = () => {
    const ahora = new Date();
    const gastoConFechaYHora = {
      ...nuevoGasto,
      fecha: ahora.toISOString().split("T")[0],
      hora: ahora.toTimeString().split(" ")[0],
    };
    setGastos((prev) => [...prev, gastoConFechaYHora]);
    setNuevoGasto((prev) => ({
      ...prev,
      tipo: "",
      descripcion: "",
      monto: 0,
    }));
  };

  const abrirModalCierre = () => {
    setIsModalOpen(true);
  };

  const cerrarCajaYExportar = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        Concepto: "Dinero de reparto",
        Monto: datosCierre.dineroReparto,
      },
      {
        Concepto: "Dinero de caja",
        Monto: datosCierre.dineroCaja,
      },
      {
        Concepto: "Dinero que queda",
        Monto: datosCierre.dineroQueda,
      },
      {
        Concepto: "Total transferencias",
        Monto: datosCierre.totalTransferencias,
      },
      {
        Concepto: "GASTOS",
        Monto: "",
      },
    ]);

    XLSX.utils.sheet_add_json(worksheet, gastos, { origin: "A7" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fechaActual = new Date().toISOString().split("T")[0];
    FileSaver.saveAs(data, `gastos_${fechaActual}.xlsx`);

    setIsModalOpen(false);
  };

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
        <Button onClick={abrirModalCierre}>Cerrar Caja y Exportar</Button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cerrar Caja"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            cerrarCajaYExportar();
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="dineroReparto"
              className="block text-sm font-medium text-gray-700"
            >
              Dinero de reparto
            </label>
            <Input
              type="number"
              id="dineroReparto"
              name="dineroReparto"
              value={datosCierre.dineroReparto}
              onChange={handleCierreInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="dineroCaja"
              className="block text-sm font-medium text-gray-700"
            >
              Dinero de caja
            </label>
            <Input
              type="number"
              id="dineroCaja"
              name="dineroCaja"
              value={datosCierre.dineroCaja}
              onChange={handleCierreInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="dineroQueda"
              className="block text-sm font-medium text-gray-700"
            >
              Dinero que queda
            </label>
            <Input
              type="number"
              id="dineroQueda"
              name="dineroQueda"
              value={datosCierre.dineroQueda}
              onChange={handleCierreInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="totalTransferencias"
              className="block text-sm font-medium text-gray-700"
            >
              Total transferencias
            </label>
            <Input
              type="number"
              id="totalTransferencias"
              name="totalTransferencias"
              value={datosCierre.totalTransferencias}
              onChange={handleCierreInputChange}
              required
            />
          </div>
          <Button type="submit">Cerrar Caja</Button>
        </form>
      </Modal>
    </div>
  );
}
