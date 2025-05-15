
import { supabase } from '@/integrations/supabase/client';

export interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
  fecha_creacion: string;
  ultimo_login: string | null;
}

// User authentication
export async function authenticateUser(username: string, password: string): Promise<Usuario | null> {
  try {
    // In a real implementation, we would verify the password hash
    // but for this example we compare with the user 'admin' / 'password'
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('nombre_usuario', username)
      .single();
    
    if (error) {
      console.error('Error authenticating:', error);
      return null;
    }
    
    // Simulating password verification (in production use bcrypt)
    // Password is 'password' for user 'admin'
    if (data && username === 'admin' && password === 'password') {
      // Update last login
      await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('usuario_id', data.usuario_id);
      
      return data as Usuario;
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Save user settings
export async function saveUserSettings(userId: number, settings: any) {
  try {
    // In a real implementation, we would save settings in a specific table
    console.log('Saving settings for user:', userId, settings);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}
