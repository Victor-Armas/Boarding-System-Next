import AddBoardingForm from "@/components/boarding/AddBoardingForm";
import BoardingForm from "@/components/boarding/BoardingForm";
import Heading from "@/components/ui/Heading";
import NavButtonPagination from "@/components/ui/NavButtonPagination";

export default function CreateBoarding() {
  return (
    <div >
      <div className="flex items-center justify-between mt-10">
        <div>
          <Heading>Crear Embarque</Heading>
          <p className="text-lg font-light text-gray-600 mt-3">Llena el formulario para crear un embarque</p>
        </div>
        <NavButtonPagination
          link="/boarding"
          text="Menú Principal"
          className="border-2 border-gray-300 hover:bg-gray-200"
        />
      </div>


      <AddBoardingForm>
        <BoardingForm />
      </AddBoardingForm>

    </div>

  )
}


