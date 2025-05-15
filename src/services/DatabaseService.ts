
import { supabase } from '@/integrations/supabase/client';

export interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
  fecha_creacion: string;
  ultimo_login: string | null;
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
      .limit(3);

    if (descriptiveError) throw descriptiveError;

    // Para los gráficos, simulamos datos si no hay suficientes en la base de datos
    const skillsData = [
      { name: 'JavaScript', value: 120 },
      { name: 'React', value: 98 },
      { name: 'Node.js', value: 86 },
      { name: 'TypeScript', value: 75 },
      { name: 'Python', value: 65 },
      { name: 'SQL', value: 60 },
    ];

    const experienceData = [
      { range: '0-1 años', count: 45 },
      { range: '1-3 años', count: 80 },
      { range: '3-5 años', count: 65 },
      { range: '5-8 años', count: 40 },
      { range: '8+ años', count: 25 },
    ];

    return {
      descriptiveResults: descriptiveResults || [],
      skillsData,
      experienceData
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
    
    return data || [];
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    throw error;
  }
}

// Guardar configuración de usuario
export async function saveUserSettings(userId: number, settings: any) {
  try {
    // En una implementación real, guardaríamos los ajustes en una tabla específica
    // Para este ejemplo, simulamos una respuesta exitosa
    return true;
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return false;
  }
}
