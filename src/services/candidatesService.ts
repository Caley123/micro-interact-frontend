
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { getExperienceYears, getExperienceTitle } from './utils/experienceUtils';

// Get candidates data
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
    
    // Transform data to expected UI format
    return data.map(candidate => {
      // Calculate total experience
      let totalExperience = 0;
      if (candidate.experiencia && Array.isArray(candidate.experiencia)) {
        totalExperience = candidate.experiencia.reduce((sum: number, exp: Json) => {
          return sum + getExperienceYears(exp);
        }, 0);
      }
      
      // Get position based on experience
      let position = 'No especificado';
      if (candidate.experiencia && Array.isArray(candidate.experiencia) && candidate.experiencia.length > 0) {
        position = getExperienceTitle(candidate.experiencia[0]);
      }
      
      // Use proper type checking and parsing for the score
      const score = typeof candidate.predicciones?.probabilidad_exito === 'number' 
        ? candidate.predicciones.probabilidad_exito 
        : Math.floor(Math.random() * 30) + 70;
      
      return {
        id: candidate.postulante_id.toString(),
        name: candidate.nombre_completo || 'Candidato sin nombre',
        position: position,
        experience: totalExperience,
        skills: candidate.habilidades || [],
        score: score,
        date: candidate.curriculums?.fecha_carga || new Date().toISOString()
      };
    }) || [];
  } catch (error) {
    console.error('Error getting candidates:', error);
    return [];
  }
}

// Get recent candidates for dashboard
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
      // Determine position based on experience
      let position = 'No especificado';
      if (candidate.experiencia && Array.isArray(candidate.experiencia) && candidate.experiencia.length > 0) {
        position = getExperienceTitle(candidate.experiencia[0]);
      }
      
      // Calculate time since upload
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
      
      // Use proper type checking and parsing for the score
      const score = typeof candidate.predicciones?.probabilidad_exito === 'number' 
        ? candidate.predicciones.probabilidad_exito 
        : Math.floor(Math.random() * 20) + 75;
      
      return {
        id: candidate.postulante_id.toString(),
        name: candidate.nombre_completo || 'Candidato sin nombre',
        position,
        score,
        date: timeAgo
      };
    }) || [];
  } catch (error) {
    console.error('Error getting recent candidates:', error);
    return [];
  }
}
