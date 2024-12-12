import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      fetch("/api/user/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.role) {
            setRole(data.role); // Asignar el rol al estado
          } else {
            toast.error("No se pudo obtener el rol del usuario.");
          }
        })
        .catch((error) => {
          console.error("Error al obtener los detalles del usuario:", error);
          toast.error("Error al obtener el rol.");
        })
        .finally(() => setLoading(false)); // Finaliza el estado de carga
    } else {
      setLoading(false); // Si no hay token, detener carga
    }
  }, []);

  return { role, loading };
}
