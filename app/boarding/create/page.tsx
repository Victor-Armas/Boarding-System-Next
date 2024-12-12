import AddBoardingForm from "@/components/boarding/AddBoardingForm";
import BoardingForm from "@/components/boarding/BoardingForm";
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";

export default function CreateBoarding() {
  return (
    <div >
      <div className="flex items-center justify-between">
        <div >
          <Heading>Crear Embarque</Heading>
          <p className="text-2xl font-light text-gray-500 mt-5">Llena el formulario para crear un embarque</p>
        </div>
        <NavButtonPagination
          link="/boarding"
          text="Menu Principal"
        />

      </div>

      <AddBoardingForm>
        <BoardingForm/>
      </AddBoardingForm>
      
    </div>

  )
}


