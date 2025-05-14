
// Este es un servicio simulado para la conexión a la base de datos
// En una aplicación real, esto se implementaría en el backend con una API REST

export interface User {
  usuario_id: number;
  nombre_usuario: string;
  email: string;
  rol: string;
  fecha_creacion: string;
  ultimo_login: string | null;
}

export interface Curriculum {
  cv_id: number;
  uploader_id: number;
  nombre_archivo: string;
  fecha_carga: string;
  formato: string;
  tamano_bytes: number;
  contenido_texto: string;
}

export interface Postulante {
  postulante_id: number;
  cv_id: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  habilidades: string[];
  experiencia: any;
  educacion: any;
}

export interface Prediccion {
  prediccion_id: number;
  postulante_id: number;
  probabilidad_exito: number;
  factores_clave: string[];
  modelo_utilizado: string;
  fecha_prediccion: string;
}

// Datos de ejemplo para simular la base de datos
const mockUsers: User[] = [
  {
    usuario_id: 1,
    nombre_usuario: 'admin',
    email: 'admin@example.com',
    rol: 'administrador',
    fecha_creacion: '2023-01-01T00:00:00Z',
    ultimo_login: '2023-05-15T10:30:00Z'
  },
  {
    usuario_id: 2,
    nombre_usuario: 'recruiter1',
    email: 'recruiter1@example.com',
    rol: 'empleador',
    fecha_creacion: '2023-02-15T00:00:00Z',
    ultimo_login: '2023-05-10T14:45:00Z'
  }
];

// Función para simular una autenticación
export const authenticateUser = (username: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En una aplicación real, esto verificaría la contraseña hash contra la base de datos
      if (username === 'admin' && password === 'password') {
        const user = mockUsers.find(u => u.nombre_usuario === username);
        resolve(user || null);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Función para obtener un usuario por ID
export const getUserById = (userId: number): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.usuario_id === userId);
      resolve(user || null);
    }, 300);
  });
};

// Función para simular la creación de un usuario
export const createUser = (userData: Omit<User, 'usuario_id' | 'fecha_creacion' | 'ultimo_login'>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        usuario_id: mockUsers.length + 1,
        ...userData,
        fecha_creacion: new Date().toISOString(),
        ultimo_login: null
      };
      mockUsers.push(newUser);
      resolve(newUser);
    }, 500);
  });
};

// Puedes agregar más funciones para interactuar con otras tablas según sea necesario
