import BoardingEfdForm from "@/components/boarding/efd/BoardingEfdForm";
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";


export default function CreateEfdPage() {
  return (
    <div >
      <div className="flex items-center justify-between">
        <div >
          <Heading>Crear EFD</Heading>
          <p className="text-2xl font-light text-gray-500 mt-5">Llena el formulario para crear un EFD</p>
        </div>
        <NavButtonPagination
          link="/boarding"
          text="Menu Principal"
        />

      </div>

      <BoardingEfdForm />
      
      
    </div>
  )
}
