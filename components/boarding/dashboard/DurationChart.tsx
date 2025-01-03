import useSWR from 'swr';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registrar todos los plugins necesarios
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ChartDataLabels);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DurationChart() {
  const { data, error } = useSWR('/boarding/dashboard/api?type=durations', fetcher);

  if (error) return <div>Error al cargar los datos</div>;
  if (!data) return <div>Cargando...</div>;

  // Redondear los valores para eliminar los decimales
  const avgDownloadDuration = Math.round(data.durations.avgDownloadDuration);
  const avgValidationDuration = Math.round(data.durations.avgValidationDuration);
  const avgCaptureDuration = Math.round(data.durations.avgCaptureDuration);
  const avgTimeUntilRamp = Math.round(data.durations.avgTimeUntilRamp);

  const chartData = {
    labels: ['Asignar Rampa','Descarga', 'Validación', 'Captura'],
    datasets: [
      {
        label: 'Duración promedio (minutos)',
        data: [avgTimeUntilRamp, avgDownloadDuration, avgValidationDuration, avgCaptureDuration],
        borderColor: 'rgba(0,193,205,255)',
        backgroundColor: 'rgba(0,227,205,0.5)',  // Color de relleno
        fill: true,  // Rellenar el área bajo la línea
        tension: 0.4,
        pointBackgroundColor: 'rgba(85,199,230,255)',
        pointBorderColor: 'rgba(0,193,205,255)',
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"line">) => {
            const rawValue = tooltipItem.raw as number; // Casting explícito a number
            return `${tooltipItem.dataset.label}: ${Math.round(rawValue)} minutos`;
          },
        },
      },
      datalabels: {
        anchor: 'end' as const, // Anclar las etiquetas al final de las barras
        align: 'top' as const,  // Alinearlas en la parte superior de las barras
        color: '#000000', // Color de la etiqueta
        font: {
          weight: 'bold' as const, // Peso de la fuente
          size: 12, // Tamaño de la fuente
        },
        formatter: (value: number | string) => value, // Mostrar el valor como está
        offset: 5, // Distancia desde la parte superior de la barra
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: false,
          text: 'Duración promedio (minutos)',
        },
        ticks: {
          callback: (value: number | string) => {
            return Math.round(Number(value)); // Aseguramos que el valor es un número y lo redondeamos
          },
        },
      },
      x: {
        title: {
          display: false,
          text: 'Etapas del embarque',
        },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF', // Fondo del contenedor del gráfico
        borderRadius: '10px', // Bordes redondeados
        border: '2px solid #FFFFFF ', // Color y grosor del borde
        padding: '8px', // Espaciado interno
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra suave
      }}
    >
      <h2 className="text-lg font-medium mb-2 text-gray-600">Duración Promedio de las Etapas del Embarque</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
