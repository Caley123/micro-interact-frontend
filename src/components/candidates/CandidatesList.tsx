import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, ChevronUp, ArrowUpDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getCandidates } from '@/services/DatabaseService';

interface Candidate {
  id: string;
  name: string;
  position: string;
  experience: number;
  skills: string[];
  score: number;
  date: string;
}

const CandidatesList = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'date' | 'score'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    loadCandidates();
  }, []);
  
  const loadCandidates = async () => {
    setIsLoading(true);
    try {
      const data = await getCandidates();
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (error) {
      console.error('Error al cargar candidatos:', error);
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los candidatos. Inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!candidates.length) return;
    
    let filtered = [...candidates];
    
    if (searchTerm) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === 'score') {
        return sortDirection === 'asc' 
          ? a.score - b.score 
          : b.score - a.score;
      } else {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    
    // Animate the transition
    setFilteredCandidates([]);
    setTimeout(() => {
      setFilteredCandidates(filtered);
    }, 300);
    
  }, [searchTerm, candidates, sortField, sortDirection]);
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const handleSort = (field: 'name' | 'date' | 'score') => {
    if (field === sortField) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold">Candidates</h2>
          
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="search"
                placeholder="Search candidates..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
              Filters
              {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>
        
        {filterOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md animate-accordion-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filter controls would go here */}
              <div className="col-span-full flex justify-end">
                <Button size="sm" variant="outline" className="mr-2">Reset</Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('name')}
                >
                  Candidate
                  <ArrowUpDown size={14} className={cn(
                    "transition-colors",
                    sortField === 'name' && "text-primary"
                  )} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skills
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('score')}
                >
                  Match Score
                  <ArrowUpDown size={14} className={cn(
                    "transition-colors",
                    sortField === 'score' && "text-primary"
                  )} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button 
                  className="flex items-center gap-1"
                  onClick={() => handleSort('date')}
                >
                  Date Added
                  <ArrowUpDown size={14} className={cn(
                    "transition-colors",
                    sortField === 'date' && "text-primary"
                  )} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-3/4"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-2/3"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-1/4"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-2/5"></div>
                  </td>
                </tr>
              ))
            ) : filteredCandidates.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No candidates found matching your search.
                </td>
              </tr>
            ) : (
              filteredCandidates.map((candidate, index) => (
                <tr 
                  key={candidate.id}
                  className="hover:bg-gray-50 transition-colors duration-150 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/candidates/${candidate.id}`} className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.experience} years exp.</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {candidate.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{candidate.skills.length - 3} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        getScoreColor(candidate.score)
                      )}></div>
                      <span className="font-medium">{candidate.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(candidate.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredCandidates.length}</span> of{' '}
            <span className="font-medium">{candidates.length}</span> candidates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;
