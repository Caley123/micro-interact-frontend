
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { getReportsData } from '@/services';

const ReportsContent = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>({
    descriptiveResults: [],
    skillsData: [],
    experienceData: []
  });
  
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const data = await getReportsData();
      setReportData(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los informes. Intente nuevamente más tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    fetchReportData();
    toast({
      title: "Datos actualizados",
      description: "Los informes han sido actualizados con los últimos datos.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Informes de Reclutamiento</h1>
        <button
          onClick={handleRefreshData}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar datos"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de habilidades principales */}
        <Card>
          <CardHeader>
            <CardTitle>Habilidades más demandadas</CardTitle>
            <CardDescription>
              Distribución de habilidades técnicas entre los candidatos
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.skillsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de experiencia */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de experiencia</CardTitle>
            <CardDescription>
              Años de experiencia de los candidatos analizados
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.experienceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de resultados descriptivos */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Análisis descriptivo histórico</CardTitle>
          <CardDescription>Resultados agregados de análisis anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Historial de análisis descriptivos realizados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>CVs Procesados</TableHead>
                <TableHead>Habilidades Top</TableHead>
                <TableHead>Experiencia Promedio</TableHead>
                <TableHead>Fecha Análisis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.descriptiveResults.length > 0 ? (
                reportData.descriptiveResults.map((result: any) => (
                  <TableRow key={result.analisis_id}>
                    <TableCell>{result.analisis_id}</TableCell>
                    <TableCell>{result.cv_procesados || 'N/A'}</TableCell>
                    <TableCell>{result.habilidades_top ? result.habilidades_top.join(', ') : 'N/A'}</TableCell>
                    <TableCell>{result.experiencia_promedio ? JSON.stringify(result.experiencia_promedio) : 'N/A'}</TableCell>
                    <TableCell>{new Date(result.fecha_analisis).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {loading ? 'Cargando datos...' : 'No hay datos de análisis disponibles'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsContent;
