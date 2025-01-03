import React, { useState } from 'react';
import ActionModal from '../ActionModal';
import {
  FaFileInvoice, FaIndustry, FaBoxes, FaShippingFast,
  FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaSyncAlt
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Image from 'next/image';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'react-toastify';
import { FaUserGear } from 'react-icons/fa6';
import { useUserRole } from '@/src/utils/useUserRole';
import { DetailsCardsEfdType } from '@/src/types';

type DetailsCardsProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedBoardingEfd: DetailsCardsEfdType;
  userId: number | null;
};

type Note = {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string } | null;
};

const fetchNotes = async (boardingEfdId: number): Promise<Note[]> => {
  const res = await fetch(`/boarding/efd/card-efd/api/notes?boardingEfdId=${boardingEfdId}`);
  if (!res.ok) throw new Error("Error al obtener las notas");
  return res.json();
};

const addNote = async (content: string, boardingEfdId: number, userId: number): Promise<Note> => {
  const res = await fetch(`/boarding/efd/card-efd/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, boardingEfdId, userId }),
  });
  if (!res.ok) throw new Error("Error al agregar la nota");
  return res.json();
};

const DetailsCards = ({ isOpen, onClose, selectedBoardingEfd, userId }: DetailsCardsProps) => {
  const { role } = useUserRole();
  const [newNote, setNewNote] = useState("");
  const { mutate } = useSWRConfig();

  const { data: notes, error, isLoading } = useSWR<Note[]>(
    selectedBoardingEfd?.id
      ? `/boarding/efd/card-efd/api/notes?boardingEfdId=${selectedBoardingEfd.id}`
      : null,
    () => fetchNotes(selectedBoardingEfd!.id)
  );

  const handleAddNote = async () => {
    if (role === "BUYER") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    if (!newNote.trim()) return;
    if (!userId) {
      toast.error("Usuario no autenticado");
      return;
    }
    try {
      await addNote(newNote, selectedBoardingEfd!.id, userId);
      mutate(`/boarding/efd/card-efd/api/notes?boardingEfdId=${selectedBoardingEfd!.id}`);
      setNewNote("");
      toast.success("Nota creada correctamente");
    } catch {
      toast.error("Error al agregar la nota");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (role === "BUYER" || role === "ASSIST") {
      toast.error("No tienes permiso para realizar esta acción.");
      return;
    }
    try {
      await fetch(`/boarding/efd/card-efd/api/notes/${noteId}`, { method: "DELETE" });
      mutate(`/boarding/efd/card-efd/api/notes?boardingEfdId=${selectedBoardingEfd!.id}`);
      toast.success("Nota eliminada correctamente");
    } catch {
      toast.error("Error al eliminar la nota");
    }
  };

  if (!selectedBoardingEfd) return null;

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={`DETALLES DEL EFD #${selectedBoardingEfd.id}`}
      size="max-w-[90%]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        <div className="lg:col-span-1 flex flex-col items-center justify-center bg-gradient-to-tl from-blue-50 to-blue-100 rounded-lg shadow-md">
          <div className="w-full h-56 relative rounded-lg shadow-lg border bg-gradient-to-tl">
            <Image
              src={selectedBoardingEfd.image || "/placeholder.svg"}
              alt="Evidencia"
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className='bg-white w-full mt-10 flex flex-col text-center py-3 rounded-lg shadow-md border'>
              <p className='text-md text-gray-500'>Tipo de Problema</p>
              <p className='font-bold text-lg'>{selectedBoardingEfd.ProblemTypeEfd.name}</p>
          </div>
        </div>

        {/* Información del EFD */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FaFileInvoice, label: 'Número de Factura', value: selectedBoardingEfd.invoiceNumber },
              { icon: FaCalendarAlt, label: 'Fecha de Carga', value: new Date(selectedBoardingEfd.crateEfdDate).toLocaleDateString() },
              { icon: FaSyncAlt, label: 'Días Transcurridos', value: selectedBoardingEfd.daysElapsed ?? 'Pendiente' },
              { icon: FaIndustry, label: 'Cantidad Facturada', value: selectedBoardingEfd.quantityInvoiced },
              { icon: FaShippingFast, label: 'Cantidad Física', value: selectedBoardingEfd.quantityPhysical },
              { icon: FaCheckCircle, label: 'Cantidad ASN', value: selectedBoardingEfd.quantityAsn },
              { icon: FaBoxes, label: 'Material', value: selectedBoardingEfd.material },
              { icon: FaInfoCircle, label: 'ASN Number', value: selectedBoardingEfd.asnNumber },
              { icon: FaUserGear, label: 'Responsable', value: selectedBoardingEfd.responsible },
            ].map(({ icon: Icon, label, value }, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md border flex items-center space-x-4">
                <Icon className="text-blue-500 w-8 h-8" />
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Descripción */}
          {selectedBoardingEfd.description && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-bold text-blue-600">Descripción del Problema</h3>
              <p className="text-gray-800 mt-2">{selectedBoardingEfd.description}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 sm:col-span-2 space-y-6">
          <h3 className="text-lg font-bold">Notas</h3>
          {isLoading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Error al cargar las notas</p>
          ) : (
            <div className="max-h-72 overflow-y-auto"> {/* Scroll añadido */}
              <ul className="space-y-2">
                {notes?.map((note) => (
                  <li key={note.id} className="p-4 bg-white rounded-lg shadow-md border relative">
                    <p className="font-semibold">{note.author?.name ?? 'Autor desconocido'}</p>
                    <p>{note.content}</p>
                    <small>{new Date(note.createdAt).toLocaleString()}</small>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <MdClose />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nota..."
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Agregar Nota
          </button>
        </div>

      </div>
    </ActionModal>
  );
};

export default DetailsCards;
