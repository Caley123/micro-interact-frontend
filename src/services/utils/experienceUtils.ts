
import { Json } from '@/integrations/supabase/types';

// Interfaces for strong typing
export interface Experiencia {
  title?: string;
  position?: string;
  years?: number;
  duration?: number;
}

// Function to check if JSON is an experience object
export function isExperienciaObject(exp: Json): exp is { [key: string]: Json } {
  return typeof exp === 'object' && exp !== null && !Array.isArray(exp);
}

// Function to safely extract years of experience
export function getExperienceYears(exp: Json): number {
  if (!isExperienciaObject(exp)) return 0;
  
  const years = exp.years || exp.duration;
  if (typeof years === 'number') return years;
  return 0;
}

// Function to safely get title/position
export function getExperienceTitle(exp: Json): string {
  if (!isExperienciaObject(exp)) return 'No especificado';
  
  const title = exp.title || exp.position;
  if (typeof title === 'string') return title;
  return 'No especificado';
}
