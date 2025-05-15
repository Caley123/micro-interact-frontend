import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
  fecha_creacion: string;
  ultimo_login: string | null;
}

// Interfaces para tipado fuerte
interface Experiencia {
  title?: string;
  position?: string;
  years?: number;
  duration?: number;
}

// Función auxiliar para manejar experiencia en formato Json
function isExperienciaObject(exp: Json): exp is { [key: string]: Json } {
  return typeof exp === 'object' && exp !== null && !Array.isArray(exp);
}

// Función para extraer años de experiencia de forma segura
function getExperienceYears(exp: Json): number {
  if (!isExperienciaObject(exp)) return 0;
  
  const years = exp.years || exp.duration;
  if (typeof years === 'number') return years;
  return 0;
}

// Función para obtener título/posición de forma segura
function getExperienceTitle(exp: Json): string {
  if (!isExperienciaObject(exp)) return 'No especificado';
  
  const title = exp.title || exp.position;
  if (typeof title === 'string') return title;
  return 'No especificado';
}

// Autenticación de usuarios
export async function authenticateUser(username: string, password: string): Promise<Usuario | null> {
  try {
    // En una implementación real, deberíamos verificar el hash de la contraseña
    // pero para este ejemplo comparamos con el usuario 'admin' / 'password'
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombre_usuario', username)
      .single();
    
    if (error) {
      console.error('Error al autenticar:', error);
      return null;
    }
    
    // Simulamos la verificación de contraseña (en producción usar bcrypt)
    // La contraseña es 'password' para el usuario 'admin'
    if (data && username === 'admin' && password === 'password') {
      // Actualizar último login
      await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('usuario_id', data.usuario_id);
      
      return data as Usuario;
    }
    
    return null;
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return null;
  }
}

// Obtener estadísticas para informes
export async function getReportsData() {
  try {
    // Obtener datos descriptivos
    const { data: descriptiveResults, error: descriptiveError } = await supabase
      .from('resultados_descriptivos')
      .select('*')
      .order('fecha_analisis', { ascending: false })
      .limit(10);

    if (descriptiveError) throw descriptiveError;

    // Obtener datos de habilidades para gráficos
    const { data: candidateSkills, error: skillsError } = await supabase
      .from('datos_postulantes')
      .select('habilidades')
      .not('habilidades', 'is', null);
    
    if (skillsError) throw skillsError;

    // Analizar datos de habilidades para crear gráfico
    const skillsCount: Record<string, number> = {};
    candidateSkills.forEach(candidate => {
      if (candidate.habilidades && candidate.habilidades.length > 0) {
        candidate.habilidades.forEach((skill: string) => {
          skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });
      }
    });
    
    // Convertir a formato para gráficos
    const skillsData = Object.entries(skillsCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Obtener datos de experiencia para gráficos
    const { data: experienceData, error: experienceError } = await supabase
      .from('datos_postulantes')
      .select('experiencia');
    
    if (experienceError) throw experienceError;

    // Analizar años de experiencia
    const experienceRanges: Record<string, number> = {
      '0-1 años': 0,
      '1-3 años': 0,
      '3-5 años': 0,
      '5-8 años': 0,
      '8+ años': 0
    };
    
    experienceData.forEach(item => {
      if (item.experiencia && Array.isArray(item.experiencia)) {
        // Calculamos los años totales de experiencia sumando todas las experiencias
        const totalYears = item.experiencia.reduce((sum: number, exp: Json) => {
          return sum + getExperienceYears(exp);
        }, 0);
        
        // Asignamos a la categoría correspondiente
        if (totalYears <= 1) experienceRanges['0-1 años']++;
        else if (totalYears <= 3) experienceRanges['1-3 años']++;
        else if (totalYears <= 5) experienceRanges['3-5 años']++;
        else if (totalYears <= 8) experienceRanges['5-8 años']++;
        else experienceRanges['8+ años']++;
      }
    });
    
    // Convertir a formato para gráficos
    const formattedExperienceData = Object.entries(experienceRanges)
      .map(([range, count]) => ({ range, count }));

    return {
      descriptiveResults: descriptiveResults || [],
      skillsData: skillsData.length ? skillsData : [],
      experienceData: formattedExperienceData
    };
  } catch (error) {
    console.error('Error al obtener datos de informes:', error);
    throw error;
  }
}

// Obtener recomendaciones
export async function getRecommendations() {
  try {
    const { data, error } = await supabase
      .from('recomendaciones')
      .select('*')
      .order('fecha_creacion', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.recomendacion_id.toString(),
      title: item.mensaje,
      description: item.descripcion || '',
      impact: calculateImpact(item.mensaje),
      category: item.tipo as 'Skills' | 'Process' | 'Tools',
      isImplemented: false
    })) || [];
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    throw error;
  }
}

// Función para determinar el impacto de una recomendación
function calculateImpact(message: string): 'High' | 'Medium' | 'Low' {
  const highImpactKeywords = ['crucial', 'crítico', 'importante', 'esencial', 'mejorar', 'optimizar'];
  const mediumImpactKeywords = ['considerar', 'evaluar', 'analizar', 'posible', 'puede'];
  
  const messageLower = message.toLowerCase();
  
  if (highImpactKeywords.some(keyword => messageLower.includes(keyword))) {
    return 'High';
  } else if (mediumImpactKeywords.some(keyword => messageLower.includes(keyword))) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

// Guardar configuración de usuario
export async function saveUserSettings(userId: number, settings: any) {
  try {
    // En una implementación real, guardaríamos los ajustes en una tabla específica
    console.log('Guardando configuración para el usuario:', userId, settings);
    return true;
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return false;
  }
}

// Obtener datos de candidatos
export async function getCandidates() {
  try {
    const { data, error } = await supabase
      .from('datos_postulantes')
      .select(`
        postulante_id,
        nombre_completo,
        habilidades,
        experiencia,
        cv_id,
        curriculums(fecha_carga),
        predicciones(probabilidad_exito)
      `)
      .order('postulante_id', { ascending: false });
    
    if (error) throw error;
    
    // Transformar los datos al formato esperado por la interfaz
    return data.map(candidate => {
      // Calcular la experiencia total
      let totalExperience = 0;
      if (candidate.experiencia && Array.isArray(candidate.experiencia)) {
        totalExperience = candidate.experiencia.reduce((sum: number, exp: Json) => {
          return sum + getExperienceYears(exp);
        }, 0);
      }
      
      // Obtener la posición basada en la experiencia
      let position = 'No especificado';
      if (candidate.experiencia && Array.isArray(candidate.experiencia) && candidate.experiencia.length > 0) {
        position = getExperienceTitle(candidate.experiencia[0]);
      }
      
      return {
        id: candidate.postulante_id.toString(),
        name: candidate.nombre_completo || 'Candidato sin nombre',
        position: position,
        experience: totalExperience,
        skills: candidate.habilidades || [],
        score: candidate.predicciones?.probabilidad_exito || Math.floor(Math.random() * 30) + 70,
        date: candidate.curriculums?.fecha_carga || new Date().toISOString()
      };
    }) || [];
  } catch (error) {
    console.error('Error al obtener candidatos:', error);
    return [];
  }
}

// Obtener métricas para el dashboard
export async function getDashboardMetrics() {
  try {
    const { data: totalCandidatesData, error: candidatesError } = await supabase
      .from('datos_postulantes')
      .select('postulante_id', { count: 'exact' });
      
    const { data: processedResumesData, error: resumesError } = await supabase
      .from('curriculums')
      .select('cv_id', { count: 'exact' });
      
    const { data: qualifiedCandidatesData, error: qualifiedError } = await supabase
      .from('predicciones')
      .select('prediccion_id')
      .gte('probabilidad_exito', 75);
    
    if (candidatesError || resumesError || qualifiedError) {
      throw new Error('Error al obtener métricas del dashboard');
    }
    
    // Calcular promedios y totales
    const totalCandidates = totalCandidatesData?.length || 0;
    const processedResumes = processedResumesData?.length || 0;
    const qualifiedCandidates = qualifiedCandidatesData?.length || 0;
    
    // Tiempo promedio de procesamiento (simulado)
    const avgProcessingTime = 2.5;
    
    return {
      totalCandidates,
      processedResumes,
      qualifiedCandidates,
      avgProcessingTime
    };
  } catch (error) {
    console.error('Error al obtener métricas del dashboard:', error);
    // Devolver valores por defecto si hay error
    return {
      totalCandidates: 0,
      processedResumes: 0,
      qualifiedCandidates: 0,
      avgProcessingTime: 0
    };
  }
}

// Obtener candidatos recientes para el dashboard
export async function getRecentCandidates() {
  try {
    const { data, error } = await supabase
      .from('datos_postulantes')
      .select(`
        postulante_id,
        nombre_completo,
        experiencia,
        predicciones(probabilidad_exito),
        curriculums(fecha_carga)
      `)
      .order('postulante_id', { ascending: false })
      .limit(3);
    
    if (error) throw error;
    
    return data.map(candidate => {
      // Determinar la posición basándose en la experiencia
      let position = 'No especificado';
      if (candidate.experiencia && Array.isArray(candidate.experiencia) && candidate.experiencia.length > 0) {
        position = getExperienceTitle(candidate.experiencia[0]);
      }
      
      // Calcular tiempo desde la carga
      let timeAgo = 'Recientemente';
      if (candidate.curriculums?.fecha_carga) {
        const uploadDate = new Date(candidate.curriculums.fecha_carga);
        const now = new Date();
        const diffHours = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60));
        
        if (diffHours < 1) {
          timeAgo = 'Hace menos de una hora';
        } else if (diffHours < 24) {
          timeAgo = `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
        } else {
          const diffDays = Math.floor(diffHours / 24);
          timeAgo = `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
        }
      }
      
      return {
        id: candidate.postulante_id.toString(),
        name: candidate.nombre_completo || 'Candidato sin nombre',
        position,
        score: candidate.predicciones?.probabilidad_exito || Math.floor(Math.random() * 20) + 75,
        date: timeAgo
      };
    }) || [];
  } catch (error) {
    console.error('Error al obtener candidatos recientes:', error);
    return [];
  }
}
