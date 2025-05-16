
import React, { useState, useEffect } from 'react';
import { Lightbulb, Filter, Star, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getRecommendations } from '@/services';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Skills' | 'Process' | 'Tools';
  isImplemented: boolean;
}

const Recommendations = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    impact: [] as ('High' | 'Medium' | 'Low')[],
    category: [] as ('Skills' | 'Process' | 'Tools')[],
    status: [] as ('Implemented' | 'Not Implemented')[]
  });
  const [filterOpen, setFilterOpen] = useState(false);
  
  useEffect(() => {
    loadRecommendations();
  }, []);
  
  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const data = await getRecommendations();
      setRecommendations(data);
      setFilteredRecommendations(data);
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar las recomendaciones. Inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (!recommendations.length) return;
    
    let filtered = [...recommendations];
    
    if (activeFilters.impact.length) {
      filtered = filtered.filter(rec => activeFilters.impact.includes(rec.impact));
    }
    
    if (activeFilters.category.length) {
      filtered = filtered.filter(rec => activeFilters.category.includes(rec.category));
    }
    
    if (activeFilters.status.length) {
      filtered = filtered.filter(rec => {
        if (activeFilters.status.includes('Implemented') && rec.isImplemented) return true;
        if (activeFilters.status.includes('Not Implemented') && !rec.isImplemented) return true;
        return false;
      });
    }
    
    setFilteredRecommendations([]);
    setTimeout(() => {
      setFilteredRecommendations(filtered);
    }, 300);
  }, [activeFilters, recommendations]);
  
  const toggleFilter = (
    filterType: 'impact' | 'category' | 'status',
    value: any
  ) => {
    setActiveFilters(prev => {
      const currentFilters = [...prev[filterType]];
      const valueIndex = currentFilters.indexOf(value);
      
      if (valueIndex === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(valueIndex, 1);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters
      };
    });
  };
  
  const resetFilters = () => {
    setActiveFilters({
      impact: [],
      category: [],
      status: []
    });
  };
  
  const getImpactColor = (impact: 'High' | 'Medium' | 'Low') => {
    switch (impact) {
      case 'High':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-gray-500';
    }
  };
  
  const getCategoryColor = (category: 'Skills' | 'Process' | 'Tools') => {
    switch (category) {
      case 'Skills':
        return 'bg-blue-100 text-blue-800';
      case 'Process':
        return 'bg-purple-100 text-purple-800';
      case 'Tools':
        return 'bg-indigo-100 text-indigo-800';
    }
  };
  
  const toggleImplemented = (id: string) => {
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          isImplemented: !rec.isImplemented
        };
      }
      return rec;
    }));
  };
  

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <Lightbulb size={24} className="text-yellow-500 mr-2 animate-pulse" />
            <h2 className="text-xl font-semibold">Strategic Recommendations</h2>
          </div>
          
          <div>
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
              Filters
              {filterOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </Button>
          </div>
        </div>
        
        {filterOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md animate-accordion-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2 text-sm text-gray-700">Impact</h3>
                <div className="space-y-2">
                  {(['High', 'Medium', 'Low'] as const).map((impact) => (
                    <label key={impact} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-2"
                        checked={activeFilters.impact.includes(impact)}
                        onChange={() => toggleFilter('impact', impact)}
                      />
                      <span className="text-sm">{impact}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 text-sm text-gray-700">Category</h3>
                <div className="space-y-2">
                  {(['Skills', 'Process', 'Tools'] as const).map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-2"
                        checked={activeFilters.category.includes(category)}
                        onChange={() => toggleFilter('category', category)}
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 text-sm text-gray-700">Status</h3>
                <div className="space-y-2">
                  {(['Implemented', 'Not Implemented'] as const).map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary mr-2"
                        checked={activeFilters.status.includes(status)}
                        onChange={() => toggleFilter('status', status)}
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <Button variant="outline" onClick={resetFilters} className="mr-2">
                  Reset Filters
                </Button>
                <Button onClick={() => setFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No recommendations found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRecommendations.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className={cn(
                  "border border-gray-200 rounded-lg p-4 transform transition-all duration-300 hover:shadow-md animate-fade-in",
                  recommendation.isImplemented && "bg-gray-50"
                )}
                style={{ 
                  animationDelay: `${index * 150}ms`, 
                  transform: `translateX(${index % 2 === 0 ? '-20px' : '20px'})`,
                  opacity: 0, 
                  animation: `slideIn 0.5s ${index * 0.1}s forwards` 
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    {recommendation.impact === 'High' && (
                      <div className="mr-2 mt-1">
                        <Star size={16} className="text-yellow-500 animate-pulse" />
                      </div>
                    )}
                    <div>
                      <h3 className={cn(
                        "font-semibold text-gray-800 mb-2",
                        recommendation.isImplemented && "line-through text-gray-500"
                      )}>
                        {recommendation.title}
                      </h3>
                      <p className={cn(
                        "text-sm text-gray-600 mb-3",
                        recommendation.isImplemented && "text-gray-500"
                      )}>
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={recommendation.isImplemented ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "ml-2 flex-shrink-0",
                      recommendation.isImplemented 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => toggleImplemented(recommendation.id)}
                  >
                    {recommendation.isImplemented ? (
                      <>
                        <Check size={14} className="mr-1" />
                        Done
                      </>
                    ) : "Implement"}
                  </Button>
                </div>
                
                <div className="flex items-center mt-2 space-x-2">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getCategoryColor(recommendation.category)
                  )}>
                    {recommendation.category}
                  </span>
                  <div className="flex items-center">
                    <div className={cn(
                      "w-2 h-2 rounded-full mr-1",
                      getImpactColor(recommendation.impact)
                    )}></div>
                    <span className="text-xs text-gray-500">
                      {recommendation.impact} Impact
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
