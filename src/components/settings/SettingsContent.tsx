
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveUserSettings } from '@/services';

const SettingsContent = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Obtener información del usuario desde localStorage
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "No hay un usuario activo. Por favor, inicie sesión nuevamente.",
        variant: "destructive"
      });
      setSaving(false);
      return;
    }
    
    try {
      // Recopilar los datos del formulario
      const formData = new FormData(event.target as HTMLFormElement);
      const settings = Object.fromEntries(formData.entries());
      
      // Guardar configuración
      const success = await saveUserSettings(currentUser.id, settings);
      
      if (success) {
        toast({
          title: "Configuración guardada",
          description: "Tus preferencias han sido actualizadas correctamente.",
        });
      } else {
        throw new Error("Error al guardar la configuración");
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la configuración. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="database">Base de datos</TabsTrigger>
          <TabsTrigger value="account">Cuenta</TabsTrigger>
        </TabsList>
        
        {/* Configuración General */}
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Configura las preferencias generales de la aplicación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Nombre de la aplicación</Label>
                  <Input id="app-name" name="app-name" defaultValue="Lovable Recruiter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <select id="language" name="language" className="w-full p-2 border rounded">
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Modo oscuro</Label>
                    <p className="text-sm text-gray-500">Activar tema oscuro</p>
                  </div>
                  <Switch id="dark-mode" name="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notificaciones</Label>
                    <p className="text-sm text-gray-500">Recibir notificaciones del sistema</p>
                  </div>
                  <Switch id="notifications" name="notifications" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Configuración de Base de Datos */}
        <TabsContent value="database">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>Configuración de Base de Datos</CardTitle>
                <CardDescription>
                  Configura la conexión a la base de datos PostgreSQL.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="db-host">Host de base de datos</Label>
                  <Input id="db-host" name="db-host" defaultValue={`${window.location.hostname}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">Puerto</Label>
                  <Input id="db-port" name="db-port" defaultValue="5432" type="number" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">Nombre de base de datos</Label>
                  <Input id="db-name" name="db-name" defaultValue="postgres" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-user">Usuario</Label>
                  <Input id="db-user" name="db-user" defaultValue="postgres" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-connection">Estado de conexión</Label>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm">Conectado a Supabase</span>
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
        
        {/* Configuración de Cuenta */}
        <TabsContent value="account">
          <Card>
            <form onSubmit={handleSaveSettings}>
              <CardHeader>
                <CardTitle>Configuración de Cuenta</CardTitle>
                <CardDescription>
                  Actualiza la información de tu cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de usuario</Label>
                  <Input id="username" name="username" defaultValue={currentUser?.username || 'admin'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" name="email" defaultValue={currentUser?.email || 'admin@example.com'} type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input id="current-password" name="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input id="new-password" name="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                  <Input id="confirm-password" name="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" type="button">Eliminar cuenta</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Actualizar cuenta"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
