
import { Json } from '@/integrations/supabase/types';

// Valida que el valor sea un objeto JSON (pero no un array)
export function isObjectJson(exp: Json): exp is Record<string, Json> {
  return typeof exp === 'object' && exp !== null && !Array.isArray(exp);
}

// Extrae de forma segura los años de experiencia
export function getExperienceYears(exp: Json): number {
  if (!isObjectJson(exp)) return 0;

  // Primero intentamos obtener años desde propiedades comunes
  let years: number | null = null;
  
  if ('years' in exp && exp['years'] !== null) {
    const yearsValue = exp['years'];
    if (typeof yearsValue === 'number') {
      years = yearsValue;
    } else if (typeof yearsValue === 'string') {
      // Intenta convertir string a número
      const parsed = parseFloat(yearsValue);
      if (!isNaN(parsed)) {
        years = parsed;
      }
    }
  }
  
  // Si no encontramos años en years, buscamos en duration
  if (years === null && 'duration' in exp && exp['duration'] !== null) {
    const durationValue = exp['duration'];
    if (typeof durationValue === 'number') {
      years = durationValue;
    } else if (typeof durationValue === 'string') {
      // Intenta convertir string a número
      const parsed = parseFloat(durationValue);
      if (!isNaN(parsed)) {
        years = parsed;
      }
    }
  }

  // Si aún no tenemos años, calculamos a partir de fecha_inicio y fecha_fin
  if (years === null) {
    if ('fecha_inicio' in exp && typeof exp['fecha_inicio'] === 'string' &&
        'fecha_fin' in exp && typeof exp['fecha_fin'] === 'string') {
      try {
        const startDate = new Date(exp['fecha_inicio'] as string);
        const endDate = new Date(exp['fecha_fin'] as string);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
        years = Number(diffYears.toFixed(1));
      } catch (error) {
        // Si hay error en el cálculo, retornamos 0
        return 0;
      }
    }
  }
  
  return years !== null ? years : 0;
}

// Extrae de forma segura el título o puesto
export function getExperienceTitle(exp: Json): string {
  if (!isObjectJson(exp)) return 'No especificado';

  // Intentamos diferentes campos comunes para el título
  let title: string | null = null;
  
  if ('title' in exp && exp['title'] !== null && typeof exp['title'] === 'string') {
    title = exp['title'] as string;
  } else if ('position' in exp && exp['position'] !== null && typeof exp['position'] === 'string') {
    title = exp['position'] as string;
  } else if ('cargo' in exp && exp['cargo'] !== null && typeof exp['cargo'] === 'string') {
    title = exp['cargo'] as string;
  }
  
  return title || 'No especificado';
}
