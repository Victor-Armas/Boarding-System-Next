
export function formatDuration(minutes: number): string {
    const days = Math.floor(minutes / (24 * 60)); // Convertir a días
    const hours = Math.floor((minutes % (24 * 60)) / 60); // Horas restantes
    const remainingMinutes = minutes % 60; // Minutos restantes
  
    // Construir el resultado
    const parts = [];
    if (days > 0) parts.push(`${days} día${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} minuto${remainingMinutes > 1 ? "s" : ""}`);
  
    return parts.join(", ");
}
  