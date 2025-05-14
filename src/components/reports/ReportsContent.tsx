
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';

const ReportsContent = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  
  // Datos de ejemplo para los gráficos
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

  // Datos de ejemplo para la tabla de análisis descriptivos
  const descriptiveResults = [
    {
      id: 1,
      cv_processed: 255,
      top_skills: "JavaScript, React, SQL, AWS, Python",
      avg_experience: "4.2 años",
      date: "2023-05-20"
    },
    {
      id: 2,
      cv_processed: 320,
      top_skills: "Python, SQL, React, TypeScript, Docker",
      avg_experience: "3.8 años",
      date: "2023-06-15"
    },
    {
      id: 3,
      cv_processed: 422,
      top_skills: "React, Node.js, TypeScript, GraphQL, AWS",
      avg_experience: "4.5 años",
      date: "2023-07-10"
    },
  ];

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Datos actualizados",
        description: "Los informes han sido actualizados con los últimos datos.",
      });
    }, 1200);
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
              <BarChart data={skillsData} layout="vertical" margin={{ left: 20 }}>
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
              <BarChart data={experienceData}>
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
              {descriptiveResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.id}</TableCell>
                  <TableCell>{result.cv_processed}</TableCell>
                  <TableCell>{result.top_skills}</TableCell>
                  <TableCell>{result.avg_experience}</TableCell>
                  <TableCell>{result.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsContent;
