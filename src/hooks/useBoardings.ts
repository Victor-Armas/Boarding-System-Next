import { useQuery } from '@tanstack/react-query';

const fetchBoardings = async () => {
  const res = await fetch('/api/boarding');
  if (!res.ok) throw new Error('Error al obtener los embarques');
  return res.json();
};

export const useBoardings = () => {
  return useQuery(['boardings'], fetchBoardings {
    staleTime: 30000, // Opcional: evita recargar frecuentemente
  });
};
