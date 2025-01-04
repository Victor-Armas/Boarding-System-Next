"use client";
import React from "react";
import useSWR from "swr";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registrar los componentes necesarios para el gráfico
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// Fetcher para SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DownloadsChart() {
  // Obtener datos dinámicamente usando SWR
  const { data, error } = useSWR(`/boarding/dashboard/api?type=dailyDownloads`, fetcher,{
      refreshInterval: 1000,
      revalidateOnFocus: false,
  });

  if (error) {
    return <div>Error al cargar los datos</div>;
  }

  if (!data) {
    return <div>Cargando...</div>;
  }

  // Extraer etiquetas y valores del resultado del backend
  const labels = data.map((item: { day: string }) => item.day); // Días de la semana
  const downloads = data.map((item: { count: number }) => item.count); // Descargas

  // Suponiendo que la API también proporciona la fecha en formato "dd/mmm/yyyy"
  const formattedDates = data.map((item: { day: string; date: string }) => item.date); // Fechas correspondientes a cada día

  // Colores para las barras
  const barColors = [
    "rgba(0, 109, 228, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(255, 159, 64, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(201, 203, 207, 0.5)",
  ];

  // Datos para el gráfico
  const chartData = {
    labels,
    datasets: [
      {
        label: "Descargas Diarias",
        data: downloads,
        backgroundColor: barColors,
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Opciones de configuración del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Ocultar leyenda
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItem: TooltipItem<"bar">[]) {
            const index = tooltipItem[0].dataIndex;
            const day = labels[index];
            const date = formattedDates[index]; // Obtenemos la fecha correspondiente
            return `${day} | ${date}`; // Muestra el día y la fecha
          },
          label: function (tooltipItem: TooltipItem<"bar">) {
            return `Descargas: ${tooltipItem.raw}`;
          },
        },
      },
      datalabels: {
        anchor: "end" as const,
        align: "top" as const,
        color: "#000000",
        font: {
          weight: "bold" as const,
          size: 12,
        },
        formatter: (value: number) => value, // Aquí sabemos que 'value' es un número
        offset: 5,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Día de la Semana",
        },
      },
      y: {
        title: {
          display: false,
          text: "Cantidad de Descargas",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        border: "2px solid #FFFFFF",
        padding: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 className="text-lg font-medium mb-2 text-gray-600">Descargas Diarias</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
