
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authenticateUser } from '@/services/DatabaseService';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    
    if (!username || !password) {
      setErrors(['Por favor, complete todos los campos']);
      return;
    }
    
    try {
      setLoading(true);
      const user = await authenticateUser(username, password);
      
      if (user) {
        toast({
          title: `¡Bienvenido ${user.nombre_usuario}!`,
          description: 'Has iniciado sesión correctamente en Lovable Recruiter!',
          variant: 'default',
        });
        
        // Guardar información de sesión en localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.usuario_id,
          username: user.nombre_usuario,
          email: user.email,
          role: user.rol
        }));
        
        navigate('/dashboard');
      } else {
        setErrors(['Usuario o contraseña incorrectos']);
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setErrors(['Error al intentar iniciar sesión']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Lovable Recruiter</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <ul className="list-disc pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su nombre de usuario"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-gray-500 mt-2">
            <p className="text-center">Credenciales de prueba:</p>
            <p className="text-center">Usuario: <strong>admin</strong> | Contraseña: <strong>password</strong></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginScreen;
