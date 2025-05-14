
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SettingsContent = () => {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const handleSaveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    
    // Simulación de guardado
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas correctamente.",
      });
    }, 1000);
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
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Configura las preferencias generales de la aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nombre de la aplicación</Label>
                <Input id="app-name" defaultValue="Lovable Recruiter" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <select id="language" className="w-full p-2 border rounded">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Modo oscuro</Label>
                  <p className="text-sm text-gray-500">Activar tema oscuro</p>
                </div>
                <Switch id="dark-mode" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notificaciones</Label>
                  <p className="text-sm text-gray-500">Recibir notificaciones del sistema</p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Configuración de Base de Datos */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Base de Datos</CardTitle>
              <CardDescription>
                Configura la conexión a la base de datos PostgreSQL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="db-host">Host de base de datos</Label>
                <Input id="db-host" defaultValue="localhost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-port">Puerto</Label>
                <Input id="db-port" defaultValue="5432" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-name">Nombre de base de datos</Label>
                <Input id="db-name" defaultValue="recruit_analytics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-user">Usuario</Label>
                <Input id="db-user" defaultValue="postgres" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-password">Contraseña</Label>
                <Input id="db-password" type="password" defaultValue="********" />
              </div>
              <Button variant="outline" className="w-full">Probar conexión</Button>
            </CardContent>
            <CardFooter>
              <Button type="submit" onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Configuración de Cuenta */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Cuenta</CardTitle>
              <CardDescription>
                Actualiza la información de tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input id="username" defaultValue="admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" defaultValue="admin@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="destructive">Eliminar cuenta</Button>
              <Button type="submit" onClick={handleSaveSettings} disabled={saving}>
                {saving ? "Guardando..." : "Actualizar cuenta"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
