import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserAuth } from "../types";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // Estado para guardar el userId
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
        .then((data: UserAuth) => {
          if (data.role && data.userId && data.name) {
            setRole(data.role);  // Asignar el rol al estado
            setUserId(data.userId); // Asignar el userId al estado
            setName(data.name)
          } else {
            toast.error("No se pudo obtener el rol o el ID del usuario.");
          }
        })
        .catch((error) => {
          console.error("Error al obtener los detalles del usuario:", error);
          toast.error("Error al obtener el rol y el ID del usuario.");
        })
        .finally(() => setLoading(false)); // Finaliza el estado de carga
    } else {
      setLoading(false); // Si no hay token, detener carga
    }
  }, []);

  return { role, userId, loading, name };
}
