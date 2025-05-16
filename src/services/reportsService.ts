
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { isObjectJson, getExperienceYears } from './utils/experienceUtils';

export async function getReportsData() {
  try {
    const { data: descriptiveResults, error: descriptiveError } = await supabase
      .from('resultados_descriptivos')
      .select('*')
      .order('fecha_analisis', { ascending: false })
      .limit(10);

    if (descriptiveError) throw descriptiveError;

    const { data: candidateSkills, error: skillsError } = await supabase
      .from('datos_postulantes')
      .select('habilidades')
      .not('habilidades', 'is', null);

    if (skillsError) throw skillsError;

    const skillsCount: Record<string, number> = {};
    candidateSkills?.forEach(candidate => {
      if (Array.isArray(candidate.habilidades)) {
        candidate.habilidades.forEach((skill: string) => {
          skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });
      }
    });

    const skillsData = Object.entries(skillsCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const { data: experienceData, error: experienceError } = await supabase
      .from('datos_postulantes')
      .select('experiencia');

    if (experienceError) throw experienceError;

    const experienceRanges: Record<string, number> = {
      '0-1 años': 0,
      '1-3 años': 0,
      '3-5 años': 0,
      '5-8 años': 0,
      '8+ años': 0
    };

    interface ExperienceItem {
      experiencia?: Json[];
    }

    (experienceData as ExperienceItem[])?.forEach((item) => {
      if (Array.isArray(item.experiencia)) {
        // Filtrar solo objetos JSON válidos
        const experienciaObjects = item.experiencia.filter(isObjectJson);

        const totalYears: number = experienciaObjects.reduce((sum: number, exp) => {
          const years = getExperienceYears(exp);
          return sum + years;
        }, 0);

        // Clasificamos según rangos de años usando comparaciones numéricas
        if (totalYears <= 1) experienceRanges['0-1 años']++;
        else if (totalYears <= 3) experienceRanges['1-3 años']++;
        else if (totalYears <= 5) experienceRanges['3-5 años']++;
        else if (totalYears <= 8) experienceRanges['5-8 años']++;
        else experienceRanges['8+ años']++;
      }
    });
    
    const formattedExperienceData = Object.entries(experienceRanges).map(([range, count]) => ({
      range,
      count
    }));

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
