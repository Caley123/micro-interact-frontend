
import { supabase } from '@/integrations/supabase/client';

// Get metrics for dashboard
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
      throw new Error('Error getting dashboard metrics');
    }
    
    // Calculate averages and totals
    const totalCandidates = totalCandidatesData?.length || 0;
    const processedResumes = processedResumesData?.length || 0;
    const qualifiedCandidates = qualifiedCandidatesData?.length || 0;
    
    // Average processing time (simulated)
    const avgProcessingTime = 2.5;
    
    return {
      totalCandidates,
      processedResumes,
      qualifiedCandidates,
      avgProcessingTime
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    // Return default values if there's an error
    return {
      totalCandidates: 0,
      processedResumes: 0,
      qualifiedCandidates: 0,
      avgProcessingTime: 0
    };
  }
}
