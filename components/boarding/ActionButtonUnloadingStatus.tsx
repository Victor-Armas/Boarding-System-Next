interface ActionButtonUnloadingStatusProps {
    color: "yellow" | "blue" | "purple" | "green" | "red";  // Los colores disponibles para el botón
    label: string;  // El texto que se muestra en el botón
    onClick: () => void;  // La función que se ejecutará al hacer clic
  }
  
  export default function ActionButtonUnloadingStatus({ color, label, onClick }: ActionButtonUnloadingStatusProps) {
    return (
      <button
        onClick={onClick}
        className={`bg-${color}-400 text-white px-3 py-1 rounded hover:bg-${color}-600 transition-colors`}
      >
        {label}
      </button>
    );
  }
  