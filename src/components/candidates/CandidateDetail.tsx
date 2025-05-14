
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Download, Printer, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CandidateDetailProps {
  candidateId?: string;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  company: string;
  photo: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  score: number;
  status: 'New' | 'Contacted' | 'Interview' | 'Offer' | 'Rejected';
  resume: string;
  assessment: Assessment;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface Assessment {
  technicalSkills: number;
  communication: number;
  teamwork: number;
  leadership: number;
  culturalFit: number;
  strengths: string[];
  weaknesses: string[];
  notes: string;
}

const mockCandidate: Candidate = {
  id: '1',
  name: 'Alexandra Johnson',
  email: 'alexandra@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  currentRole: 'Senior Frontend Developer',
  company: 'Tech Innovations Inc.',
  photo: '/placeholder.svg',
  skills: ['React', 'TypeScript', 'CSS/SCSS', 'Node.js', 'GraphQL', 'Jest', 'CI/CD'],
  education: [
    {
      degree: 'M.S. Computer Science',
      institution: 'Stanford University',
      year: '2018'
    },
    {
      degree: 'B.S. Software Engineering',
      institution: 'UC Berkeley',
      year: '2016'
    }
  ],
  experience: [
    {
      role: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      duration: '2020 - Present',
      description: 'Led frontend development for enterprise SaaS applications. Implemented CI/CD pipelines and improved performance by 40%.'
    },
    {
      role: 'Frontend Developer',
      company: 'WebSolutions Co.',
      duration: '2018 - 2020',
      description: 'Developed responsive web applications using React and TypeScript. Collaborated with designers to implement UI/UX improvements.'
    }
  ],
  score: 87,
  status: 'Interview',
  resume: '/resume.pdf',
  assessment: {
    technicalSkills: 90,
    communication: 85,
    teamwork: 80,
    leadership: 75,
    culturalFit: 95,
    strengths: ['Strong React knowledge', 'Excellent problem-solving', 'Great communicator'],
    weaknesses: ['Limited backend experience', 'Needs improvement in documentation'],
    notes: 'Alexandra would be an excellent addition to our frontend team. Her strong React expertise aligns perfectly with our tech stack.'
  }
};

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidateId }) => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    skills: true,
    education: true,
    experience: true,
    assessment: true
  });

  useEffect(() => {
    const loadCandidate = async () => {
      try {
        // In a real application, you would fetch the candidate data from an API
        // For demo purposes, we'll simulate an API call with a setTimeout
        await new Promise(resolve => setTimeout(resolve, 800));
        setCandidate(mockCandidate);
      } catch (error) {
        console.error('Error loading candidate:', error);
        toast({
          title: 'Error',
          description: 'Failed to load candidate data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadCandidate();
  }, [candidateId, toast]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDownloadResume = () => {
    toast({
      title: 'Resume Downloaded',
      description: 'The resume has been downloaded successfully.',
    });
  };

  const handlePrintProfile = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusColor = (status: Candidate['status']) => {
    const statusMap = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-purple-100 text-purple-800',
      'Interview': 'bg-amber-100 text-amber-800',
      'Offer': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 animate-pulse">
        <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/candidates')}
          className="mb-6 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
          Back to Candidates
        </Button>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">Candidate not found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/candidates')}
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
          Back to Candidates
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadResume}
            className="group"
          >
            <Download className="mr-2 h-4 w-4 group-hover:translate-y-[1px] transition-transform" />
            Download Resume
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePrintProfile}
            className="group"
          >
            <Printer className="mr-2 h-4 w-4 group-hover:scale-105 transition-transform" />
            Print Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={candidate.photo} 
                      alt={candidate.name} 
                      className="w-20 h-20 rounded-full border-2 border-white animate-fadeIn"
                    />
                    <span 
                      className={cn(
                        "absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white",
                        candidate.status === 'Interview' ? 'bg-amber-400' :
                        candidate.status === 'Offer' ? 'bg-green-400' :
                        candidate.status === 'Rejected' ? 'bg-red-400' :
                        'bg-blue-400'
                      )}
                    ></span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{candidate.name}</h2>
                    <p className="text-sm opacity-90">{candidate.currentRole}</p>
                    <p className="text-sm opacity-75">{candidate.company}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Candidate Score</h3>
                  <div className="flex items-center">
                    <span className={cn("text-2xl font-bold animate-countUp", getScoreColor(candidate.score))}>
                      {candidate.score}%
                    </span>
                    <Star className="h-5 w-5 text-yellow-400 ml-1 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Match Rate</span>
                    <span>{candidate.score}%</span>
                  </div>
                  <Progress 
                    value={candidate.score} 
                    className="animate-progressFill" 
                    indicatorClassName={
                      candidate.score >= 80 ? "bg-green-500" :
                      candidate.score >= 60 ? "bg-amber-500" :
                      "bg-red-500"
                    }
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${candidate.email}`} className="text-sm text-blue-600 hover:underline">
                        {candidate.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${candidate.phone}`} className="text-sm">
                        {candidate.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm">{candidate.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('skills')}>
              <CardTitle className="text-lg flex items-center justify-between">
                Skills
                <span className="text-xs text-gray-400">
                  {expandedSections.skills ? '▼' : '▶'}
                </span>
              </CardTitle>
            </CardHeader>
            {expandedSections.skills && (
              <CardContent className="animate-expandVertical">
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        
        {/* Right column - Details and Assessment */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-6 mt-6 animate-fadeIn">
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleSection('experience')}>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Professional Experience
                    </div>
                    <span className="text-xs text-gray-400">
                      {expandedSections.experience ? '▼' : '▶'}
                    </span>
                  </CardTitle>
                </CardHeader>
                {expandedSections.experience && (
                  <CardContent className="animate-expandVertical">
                    <div className="space-y-6">
                      {candidate.experience.map((exp, index) => (
                        <div 
                          key={index} 
                          className="relative pl-6 border-l-2 border-gray-200 animate-slideInFromLeft"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                          <h3 className="font-medium">{exp.role}</h3>
                          <div className="text-sm text-gray-600">
                            {exp.company} • {exp.duration}
                          </div>
                          <p className="mt-2 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
              
              <Card>
                <CardHeader className="cursor-pointer" onClick={() => toggleSection('education')}>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </div>
                    <span className="text-xs text-gray-400">
                      {expandedSections.education ? '▼' : '▶'}
                    </span>
                  </CardTitle>
                </CardHeader>
                {expandedSections.education && (
                  <CardContent className="animate-expandVertical">
                    <div className="space-y-6">
                      {candidate.education.map((edu, index) => (
                        <div 
                          key={index} 
                          className="relative pl-6 border-l-2 border-gray-200 animate-slideInFromLeft"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <div className="text-sm text-gray-600">
                            {edu.institution} • {edu.year}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="assessment" className="space-y-6 mt-6 animate-fadeIn">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Technical Skills</span>
                        <span>{candidate.assessment.technicalSkills}%</span>
                      </div>
                      <Progress value={candidate.assessment.technicalSkills} className="animate-progressFill" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Communication</span>
                        <span>{candidate.assessment.communication}%</span>
                      </div>
                      <Progress value={candidate.assessment.communication} className="animate-progressFill" style={{ animationDelay: '100ms' }} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Teamwork</span>
                        <span>{candidate.assessment.teamwork}%</span>
                      </div>
                      <Progress value={candidate.assessment.teamwork} className="animate-progressFill" style={{ animationDelay: '200ms' }} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Leadership</span>
                        <span>{candidate.assessment.leadership}%</span>
                      </div>
                      <Progress value={candidate.assessment.leadership} className="animate-progressFill" style={{ animationDelay: '300ms' }} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cultural Fit</span>
                        <span>{candidate.assessment.culturalFit}%</span>
                      </div>
                      <Progress value={candidate.assessment.culturalFit} className="animate-progressFill" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {candidate.assessment.strengths.map((strength, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-2 animate-fadeIn"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-lg">Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {candidate.assessment.weaknesses.map((weakness, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-2 animate-fadeIn"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recruiter Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="italic text-gray-600 animate-typewriter">"{candidate.assessment.notes}"</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="animate-fadeIn">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-gray-500">Activity tracking will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
