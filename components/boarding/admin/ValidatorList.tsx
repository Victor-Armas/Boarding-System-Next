import { Validator } from '@prisma/client';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';
import useSWR from 'swr';
import ActionModal from '../ActionModal';
import { useState } from 'react';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useUserRole } from '@/src/utils/useUserRole';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ValidatorList() {
    const { role } = useUserRole();
    const [isModalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [modalType, setModalType] = useState<'create' | 'edit'>('create'); // Tipo de acción
    const [editingId, setEditingId] = useState<Validator['id'] | null>(null); // ID del validador a editar
    const url = '/boarding/admin/api?type=validators';
    const { data: validadores, error, isLoading, mutate } = useSWR<Validator[]>(url, fetcher);

    const handleEdit = (id: Validator['id'], name: string) => {
        setModalType('edit');
        setEditingId(id); // Establecer el id para edición
        setName(name); // Establecer el nombre del validador a editar
        setModalOpen(true); // Abrir el modal
    };

    const handleCreate = () => {
        setModalType('create');
        setName(''); // Limpiar el nombre al crear un nuevo validador
        setModalOpen(true); // Abrir el modal
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (modalType === 'create') {
            // Lógica para crear un nuevo validador
            if (role === "BUYER" || role === "ASSIST") {
                toast.error("No tienes permiso para realizar esta acción.");
                return;
              }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nameValidator: name, action: 'createValidator' }),
                });
                if (response.ok) {
                    toast.success('Validador creado correctamente');
                    mutate(); // Refresca la lista automáticamente
                    setModalOpen(false); // Cierra el modal
                } else {
                    toast.error('Error al crear el validador');
                }
            } catch (error) {
                console.error('Error al crear el validador:', error);
            }
        } else if (modalType === 'edit' && editingId !== null) {
            // Lógica para editar un validador existente

            if (role === "BUYER" || role === "ASSIST") {
                toast.error("No tienes permiso para realizar esta acción.");
                return;
              }
            try {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'updateValidator',
                        idValidator: editingId,
                        nameValidator: name,
                    }),
                });
                if (response.ok) {
                    toast.success('Validador actualizado correctamente');
                    mutate(); // Refresca la lista automáticamente
                    setModalOpen(false); // Cierra el modal
                } else {
                    toast.error('Error al actualizar el validador');
                }
            } catch (error) {
                console.error('Error al actualizar el validador:', error);
            }
        }
    };

    const handleToggleActive = async (id: Validator['id'], isActive: Validator['isActive'], name: Validator['name']) => {
        try {
            const updatedActive = !isActive;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idValidator: id,
                    isActive: updatedActive,
                    action: 'updateActiveValidator',
                }),
            });
            if (response.ok) {
                toast.success(`Validador ${name} cambiado correctamente`);
                mutate(); // Refresca la lista automáticamente
            } else {
                toast.error('Error al cambiar la disponibilidad');
            }
        } catch (error) {
            console.error('Error al cambiar el estado activo:', error);
        }
    };

    const handleDelete =  async (id: Validator['id']) => {
        if (role === "BUYER" || role === "ASSIST") {
            toast.error("No tienes permiso para realizar esta acción.");
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idValidator: id,
                    action: 'deleteValidator'
                })
            })

            if(response.ok){
                toast.success("Validador eliminado correctamente")
                mutate();
            }else{
                toast.error('Error al eliminar al validador');
            }
            
        } catch (error) {
            console.log(error)
        }

    }

    if (isLoading) return <div>Cargando validadores...</div>;
    if (error) return <div>Error al cargar los validadores</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-blue-700">Listado de Validadores</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    Crear Nuevo
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-200 hidden sm:table">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 border w-72 border-gray-200">Acciones</th>
                            <th className="p-3 border border-gray-200">ID</th>
                            <th className="p-3 border border-gray-200">Nombre</th>
                            <th className="p-3 border border-gray-200">Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validadores?.map((validador) => (
                            <tr key={validador.id} className="hover:bg-gray-50">
                                <td className="p-3 border border-gray-200">
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => handleEdit(validador.id, validador.name)}
                                            className="flex items-center px-3 py-2 font-bold bg-amber-400 bg-opacity-90 text-amber-800 rounded-md shadow-md hover:bg-amber-500 transition duration-300"
                                        >
                                            <FaEdit className="mr-2 text-white" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(validador.id)}
                                            className="flex items-center px-3 py-2 font-bold bg-red-400 bg-opacity-90 text-red-800 rounded-md shadow-md hover:bg-red-500 transition duration-300"
                                        >
                                            <RiDeleteBin5Line className="mr-2 text-white" />
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                                <td className="p-3 border border-gray-200">{validador.id}</td>
                                <td className="p-3 border border-gray-200">{validador.name}</td>
                                <td className="p-3 border border-gray-200">
                                    <button
                                        onClick={() => handleToggleActive(validador.id, validador.isActive, validador.name)}
                                        className={`px-4 py-1 rounded-full font-bold shadow-md transition duration-300 ${validador.isActive ? 'bg-green-600 bg-opacity-30 text-green-800 hover:bg-green-400' : 'bg-red-600 bg-opacity-30 text-red-800 hover:bg-red-400'
                                            }`}
                                    >
                                        {validador.isActive ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Responsive view for small screens */}
            <div className="sm:hidden">
                {validadores?.map((validador) => (
                    <div
                        key={validador.id}
                        className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-700">ID: {validador.id}</h2>
                            <button
                                onClick={() => handleToggleActive(validador.id, validador.isActive, validador.name)}
                                className={`px-4 py-1 rounded-full font-bold shadow-md transition duration-300 ${validador.isActive ? 'bg-green-600 bg-opacity-30 text-green-800 hover:bg-green-400' : 'bg-red-600 bg-opacity-30 text-red-800 hover:bg-red-400'
                                    }`}
                            >
                                {validador.isActive ? 'Activo' : 'Inactivo'}
                            </button>
                        </div>
                        <p className="mb-2 text-gray-600">
                            <strong>Nombre:</strong> {validador.name}
                        </p>
                        <div className="flex justify-around gap-2">
                            <button
                                onClick={() => handleEdit(validador.id, validador.name)}
                                className="flex items-center px-4 py-2 font-bold bg-amber-400 bg-opacity-90 text-amber-800 rounded-md shadow-md hover:bg-amber-500 transition duration-300"
                            >
                                <FaEdit className="mr-2 text-white" />
                                
                            </button>
                            <button
                                onClick={() => handleDelete(validador.id)}
                                className="flex items-center px-4 py-2 font-bold bg-red-400 bg-opacity-90 text-red-800 rounded-md shadow-md hover:bg-red-500 transition duration-300"
                            >
                                <RiDeleteBin5Line className="mr-2 text-white" />
                                
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={modalType === 'create' ? 'Crear Validador' : 'Editar Validador'}
                size="max-w-md" // Ajustamos el tamaño del modal para que soporte dos columnas
            >
                <form onSubmit={handleSave} className="px-10">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            Nombre del Validador
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full p-3 bg-slate-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre del Validador"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition duration-300"
                    >
                        {modalType === 'create' ? 'Crear' : 'Actualizar'}
                    </button>
                </form>
            </ActionModal>
        </div>
    );

}
