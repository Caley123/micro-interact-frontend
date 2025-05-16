import { Json } from '@/integrations/supabase/types';

// Valida que el valor sea un objeto JSON (pero no un array)
export function isObjectJson(exp: Json): exp is Record<string, Json> {
  return typeof exp === 'object' && exp !== null && !Array.isArray(exp);
}

// Extrae de forma segura los años de experiencia
export function getExperienceYears(exp: Json): number {
  if (!isObjectJson(exp)) return 0;

  const years = exp['years'] ?? exp['duration'];
  return typeof years === 'number' ? years : 0;
}

// Extrae de forma segura el título o puesto
export function getExperienceTitle(exp: Json): string {
  if (!isObjectJson(exp)) return 'No especificado';

  const title = exp['title'] ?? exp['position'];
  return typeof title === 'string' ? title : 'No especificado';
}
