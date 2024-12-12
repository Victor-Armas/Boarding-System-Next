import AddUserCreateForm from '@/components/boarding/AddUserCreateForm'
import UserCreateForm from '@/components/boarding/UserCreateForm'
import Heading from '@/components/ui/Heading'
import NavButtonPagination from '@/components/ui/NavButtonPagination'
import React from 'react'

export default function CreateUser() {
  return (
    <div>
        <div className="flex items-center justify-between">
            <div >
                <Heading>Crear Usuario</Heading>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el formulario para crear un usuario</p>
            </div>
            <NavButtonPagination
                link="/boarding"
                text="Menu Principal"
            />
        </div>

        <AddUserCreateForm/>
    </div>
  )
}
