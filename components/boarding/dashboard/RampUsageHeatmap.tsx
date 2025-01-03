import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartConfiguration,
  ScriptableContext,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, MatrixController, MatrixElement);

interface MatrixDataPoint {
  x: number;
  y: number;
  v: number;
}

// Fetcher para SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HeatmapTest() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Datos cargados con SWR
  const { data, error } = useSWR(
    `/boarding/dashboard/api?type=rampDemand&startDate=2024-12-01&endDate=2024-12-31`,
    fetcher
  );

  useEffect(() => {
    let chartInstance: ChartJS | null = null;
  
    if (canvasRef.current && data) {
      // Configuración del gráfico
      const dataset = data.map((item: { x: number; y: number; v: number }) => ({
        x: item.x,
        y: item.y,
        v: item.v,
      }));
  
      const config: ChartConfiguration<'matrix', MatrixDataPoint[], MatrixDataPoint> = {
        type: 'matrix',
        data: {
          datasets: [
            {
              label: 'Demanda de Rampa',
              data: dataset,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
              backgroundColor: (context: ScriptableContext<'matrix'>) => {
                const rawData = context.raw as MatrixDataPoint; // Asegurarse de que 'raw' tiene el tipo esperado
                const value = rawData.v;
              
                if (value <= 3) {
                  const alpha = (value / 3) * 0.8 + 0.2;
                  return `rgba(0, 255, 0, ${alpha})`; // Verde
                } else if (value <= 7) {
                  const alpha = ((value - 3) / 4) * 0.8 + 0.2;
                  return `rgba(255, 255, 0, ${alpha})`; // Amarillo
                } else {
                  const alpha = ((value - 7) / 3) * 0.8 + 0.2;
                  return `rgba(255, 0, 0, ${alpha})`; // Rojo
                }
              },
              width: ({ chart }: { chart: ChartJS }) => (chart.chartArea?.width || 0) / 12 - 1,
              height: ({ chart }: { chart: ChartJS }) => (chart.chartArea?.height || 0) / 7 - 1,

            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
                display: true,
                min: 1, // Comienza desde el centro de la primera celda
                max: 12 , // Llega al centro de la última celda
                ticks: {
                  stepSize: 1, // Avance de 1 en 1
                  callback: (value: string | number) => {
                    const hours = [
                      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
                      '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
                    ];
                    const numValue = typeof value === 'number' ? value : parseFloat(value as string);
                    return hours[numValue - 1] || ''; // Ajuste de las etiquetas
                  },
                },
                offset: true, // Asegura que las celdas estén alineadas con las etiquetas
                grid: {
                  display: false, // Desactiva las líneas de la cuadrícula
                },
              },
            y: {
                display: true, // Aseguramos que el eje Y se muestre
                min: 0, // Mínimo 1
                max: 8, // Máximo 7
                grid: {
                    display: false, // Desactiva las líneas de la cuadrícula para el eje Y
                  },
                ticks: {
                  stepSize: 1, // Incremento de 1
                  callback: (val: string | number) => {
                    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                    const numVal = typeof val === 'number' ? val : parseInt(val as string, 10);
                    if (numVal >= 0 && numVal <= 7) {
                      return days[numVal - 1]; // Asignar día
                    }
                    return '';
                  },
                },
              },
          },
          plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                      const rawData = tooltipItems[0].raw as { x: number; y: number };
                      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                      const day = days[rawData.y - 1]; // Convertir Y en el día
                      const hour = `${(rawData.x - 1) * 2}:00`; // Multiplicar x por 2 para obtener la hora correcta
                      return `Día: ${day} | Hora: ${hour}`;
                    },
                    label: () => '', // No mostrar ninguna etiqueta adicional
                  },
            },
            legend: {
                display: false, // Oculta la leyenda
              },
            datalabels: {
                display: false, // Desactiva la visualización de etiquetas
              },
              
          },
        },
      };
  
      // Crear nueva instancia del gráfico
      chartInstance = new ChartJS(canvasRef.current, config);
    }
  
    // Cleanup: destruir la instancia del gráfico anterior
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]);
  

  if (error) {
    return <div>Error al cargar los datos</div>;
  }

  if (!data) {
    return <div>Cargando...</div>;
  }

  return(

    <div
    style={{
        backgroundColor: '#FFFFFF', // Fondo del contenedor del gráfico
        borderRadius: '10px', // Bordes redondeados
        border: '2px solid #FFFFFF ', // Color y grosor del borde
        padding: '8px', // Espaciado interno
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra suave
      }}
    
    >
        <h2 className="text-lg font-medium mb-2 text-gray-600">Demanda de Rampas</h2>
        <canvas ref={canvasRef} id="heatmap" />
    </div>
  ) 
  
}
