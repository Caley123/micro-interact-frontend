
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
    
    // If we don't have any real data, use mock data
    if (totalCandidates === 0 && processedResumes === 0 && qualifiedCandidates === 0) {
      return {
        totalCandidates: 128,
        processedResumes: 87,
        qualifiedCandidates: 42,
        avgProcessingTime: 1.8
      };
    }
    
    return {
      totalCandidates,
      processedResumes,
      qualifiedCandidates,
      avgProcessingTime
    };
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    // Return mock values if there's an error
    return {
      totalCandidates: 128,
      processedResumes: 87,
      qualifiedCandidates: 42,
      avgProcessingTime: 1.8
    };
  }
}

// Get recent candidates (mock data)
export async function getRecentCandidatesDashboard() {
  try {
    const { data, error } = await supabase
      .from('datos_postulantes')
      .select('postulante_id, nombre_completo, email')
      .order('postulante_id', { ascending: false })
      .limit(5);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(candidate => ({
        id: candidate.postulante_id,
        name: candidate.nombre_completo || 'Nombre no disponible',
        position: 'Desarrollador Frontend',
        score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        date: new Date().toLocaleDateString()
      }));
    }
    
    // Return mock data if no real data is available
    return [
      { id: 1, name: 'Ana Martínez', position: 'Frontend Developer', score: 92, date: '18/05/2025' },
      { id: 2, name: 'Carlos Sánchez', position: 'UI/UX Designer', score: 87, date: '17/05/2025' },
      { id: 3, name: 'Luis García', position: 'Backend Developer', score: 76, date: '16/05/2025' },
      { id: 4, name: 'Sofía Rodríguez', position: 'Full Stack Developer', score: 65, date: '15/05/2025' },
      { id: 5, name: 'Javier López', position: 'DevOps Engineer', score: 82, date: '14/05/2025' }
    ];
  } catch (error) {
    console.error('Error getting recent candidates:', error);
    // Return mock data if there's an error
    return [
      { id: 1, name: 'Ana Martínez', position: 'Frontend Developer', score: 92, date: '18/05/2025' },
      { id: 2, name: 'Carlos Sánchez', position: 'UI/UX Designer', score: 87, date: '17/05/2025' },
      { id: 3, name: 'Luis García', position: 'Backend Developer', score: 76, date: '16/05/2025' },
      { id: 4, name: 'Sofía Rodríguez', position: 'Full Stack Developer', score: 65, date: '15/05/2025' },
      { id: 5, name: 'Javier López', position: 'DevOps Engineer', score: 82, date: '14/05/2025' }
    ];
  }
}

// Get mock chart data for dashboard
export async function getMockChartData() {
  // Mock skills data for the Skills Qualification Analysis
  const barData = [
    { name: 'JavaScript', qualified: 72, unqualified: 28 },
    { name: 'React', qualified: 68, unqualified: 32 },
    { name: 'Node.js', qualified: 54, unqualified: 46 },
    { name: 'TypeScript', qualified: 62, unqualified: 38 },
    { name: 'SQL', qualified: 75, unqualified: 25 },
  ];
  
  // Mock data for the Candidates by Skills pie chart
  const pieData = [
    { name: 'Frontend', value: 45 },
    { name: 'Backend', value: 30 },
    { name: 'Full Stack', value: 15 },
    { name: 'DevOps', value: 5 },
    { name: 'Design', value: 5 },
  ];
  
  return { barData, pieData };
}
