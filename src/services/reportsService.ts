
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { getExperienceYears, getExperienceTitle } from './utils/experienceUtils';

// Get statistics for reports
export async function getReportsData() {
  try {
    // Get descriptive data
    const { data: descriptiveResults, error: descriptiveError } = await supabase
      .from('resultados_descriptivos')
      .select('*')
      .order('fecha_analisis', { ascending: false })
      .limit(10);

    if (descriptiveError) throw descriptiveError;

    // Get skills data for charts
    const { data: candidateSkills, error: skillsError } = await supabase
      .from('datos_postulantes')
      .select('habilidades')
      .not('habilidades', 'is', null);
    
    if (skillsError) throw skillsError;

    // Analyze skills data for chart
    const skillsCount: Record<string, number> = {};
    candidateSkills.forEach(candidate => {
      if (candidate.habilidades && candidate.habilidades.length > 0) {
        candidate.habilidades.forEach((skill: string) => {
          skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });
      }
    });
    
    // Convert to chart format
    const skillsData = Object.entries(skillsCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Get experience data for charts
    const { data: experienceData, error: experienceError } = await supabase
      .from('datos_postulantes')
      .select('experiencia');
    
    if (experienceError) throw experienceError;

    // Analyze years of experience
    const experienceRanges: Record<string, number> = {
      '0-1 años': 0,
      '1-3 años': 0,
      '3-5 años': 0,
      '5-8 años': 0,
      '8+ años': 0
    };
    
    experienceData.forEach(item => {
      if (item.experiencia && Array.isArray(item.experiencia)) {
        // Calculate total years of experience by adding all experiences
        const totalYears = item.experiencia.reduce((sum: number, exp: Json) => {
          return sum + getExperienceYears(exp);
        }, 0);
        
        // Assign to corresponding category using proper type checking
        const years = totalYears;
        if (years <= 1) experienceRanges['0-1 años']++;
        else if (years <= 3) experienceRanges['1-3 años']++;
        else if (years <= 5) experienceRanges['3-5 años']++;
        else if (years <= 8) experienceRanges['5-8 años']++;
        else experienceRanges['8+ años']++;
      }
    });
    
    // Convert to chart format
    const formattedExperienceData = Object.entries(experienceRanges)
      .map(([range, count]) => ({ range, count }));

    return {
      descriptiveResults: descriptiveResults || [],
      skillsData: skillsData.length ? skillsData : [],
      experienceData: formattedExperienceData
    };
  } catch (error) {
    console.error('Error getting report data:', error);
    throw error;
  }
}
