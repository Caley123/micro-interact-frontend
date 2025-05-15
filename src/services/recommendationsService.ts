
import { supabase } from '@/integrations/supabase/client';

// Get recommendations
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
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

// Function to determine recommendation impact
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
