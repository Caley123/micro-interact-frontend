
import { supabase } from '@/integrations/supabase/client';

export interface Usuario {
  usuario_id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
  fecha_creacion: string;
  ultimo_login: string | null;
}

// Autenticación de usuario
export async function authenticateUser(username: string, password: string): Promise<Usuario | null> {
  try {
    // En una implementación real, verificaríamos el hash de la contraseña
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
    
    // Simulando verificación de contraseña (en producción usar bcrypt)
    // La contraseña es 'password' para el usuario 'admin'
    if (data && username === 'admin' && password === 'password') {
      // Actualizar último inicio de sesión
      await supabase
        .from('usuarios')
        .update({ ultimo_login: new Date().toISOString() })
        .eq('usuario_id', data.usuario_id);
      
      return data as Usuario;
    }
    
    return null;
  } catch (error) {
    console.error('Error de autenticación:', error);
    return null;
  }
}

// Cerrar sesión de usuario
export async function logoutUser(): Promise<boolean> {
  try {
    // Limpiar datos del usuario de localStorage
    localStorage.removeItem('currentUser');
    
    // En una implementación real con Supabase Auth, usaríamos:
    // await supabase.auth.signOut();
    
    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return false;
  }
}

// Guardar configuración de usuario
export async function saveUserSettings(userId: number, settings: any) {
  try {
    // En una implementación real, guardaríamos la configuración en una tabla específica
    console.log('Guardando configuración para usuario:', userId, settings);
    return true;
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return false;
  }
}
