import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDashboardMetrics, getRecentCandidates, getReportsData } from '@/services';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    processedResumes: 0,
    qualifiedCandidates: 0,
    avgProcessingTime: 0
  });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [chartData, setChartData] = useState({
    barData: [],
    pieData: []
  });
  
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Cargar métricas
      const metrics = await getDashboardMetrics();
      setStats(metrics);
      
      // Cargar candidatos recientes
      const candidates = await getRecentCandidates();
      setRecentCandidates(candidates);
      
      // Cargar datos para gráficos
      const reportsData = await getReportsData();
      
      // Transformar los datos para el gráfico de barras
      const barData = [
        { name: 'Technical', qualified: 65, unqualified: 35 },
        { name: 'Communication', qualified: 78, unqualified: 22 },
        { name: 'Leadership', qualified: 45, unqualified: 55 },
        { name: 'Problem Solving', qualified: 70, unqualified: 30 },
        { name: 'Team Work', qualified: 82, unqualified: 18 },
      ];
      
      // Usar los datos de habilidades para el gráfico de pie
      const pieData = reportsData.skillsData.length ? 
        reportsData.skillsData : 
        [
          { name: 'Frontend', value: 35 },
          { name: 'Backend', value: 25 },
          { name: 'Full Stack', value: 20 },
          { name: 'DevOps', value: 10 },
          { name: 'Design', value: 10 },
        ];
      
      setChartData({ barData, pieData });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos del dashboard. Inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Candidates" 
          value={stats.totalCandidates} 
          isLoading={isLoading} 
          icon={<Users size={24} className="text-blue-500" />}
          change={"+12%"}
          trend="up"
        />
        <StatCard 
          title="Processed Resumes" 
          value={stats.processedResumes} 
          isLoading={isLoading} 
          icon={<FileText size={24} className="text-purple-500" />}
          change={"+8%"}
          trend="up"
        />
        <StatCard 
          title="Qualified Candidates" 
          value={stats.qualifiedCandidates} 
          isLoading={isLoading} 
          icon={<CheckCircle size={24} className="text-green-500" />}
          change={"-5%"}
          trend="down"
        />
        <StatCard 
          title="Avg. Processing Time" 
          value={stats.avgProcessingTime.toFixed(1)} 
          isLoading={isLoading} 
          suffix="min"
          icon={<Clock size={24} className="text-yellow-500" />}
          change={"-20%"}
          trend="up"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              Skills Qualification Analysis
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-gray-500 hover:text-primary">
                View Details <ChevronRight size={14} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="h-72">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }} 
                    />
                    <Legend />
                    <Bar 
                      dataKey="qualified" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                    <Bar 
                      dataKey="unqualified" 
                      fill="#ef4444" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              Candidates by Skills
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-gray-500 hover:text-primary">
                View Details <ChevronRight size={14} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="h-72">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1500}
                    >
                      {chartData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }} 
                      formatter={(value) => [`${value} candidates`, '']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <RecentCandidates isLoading={isLoading} candidates={recentCandidates} />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  suffix?: string;
  isLoading: boolean;
  icon: React.ReactNode;
  change: string;
  trend: 'up' | 'down';
}

const StatCard = ({ title, value, suffix = "", isLoading, icon, change, trend }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-gray-100 rounded-md">
            {icon}
          </div>
          <div className={cn(
            "text-xs font-medium flex items-center",
            trend === 'up' ? "text-green-500" : "text-red-500"
          )}>
            {change}
            <svg 
              className={cn("w-3 h-3 ml-1", trend === 'down' && "transform rotate-180")} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-end mt-1">
            {isLoading ? (
              <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-800">
                {value}
                {suffix && <span className="text-sm font-medium text-gray-500 ml-1">{suffix}</span>}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentCandidates = ({ isLoading, candidates }) => {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Recent Candidates
          <Button variant="ghost" size="sm" className="text-xs gap-1 text-gray-500 hover:text-primary">
            View All <ChevronRight size={14} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay candidatos recientes para mostrar
          </div>
        ) : (
          <div className="space-y-1">
            {candidates.map((candidate, index) => (
              <div 
                key={candidate.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100 + 500}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{candidate.name}</h4>
                    <p className="text-xs text-gray-500">{candidate.position}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    candidate.score >= 80 
                      ? "bg-green-100 text-green-800" 
                      : candidate.score >= 60 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-red-100 text-red-800"
                  )}>
                    {candidate.score}%
                  </div>
                  <span className="text-xs text-gray-500 ml-4">{candidate.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
