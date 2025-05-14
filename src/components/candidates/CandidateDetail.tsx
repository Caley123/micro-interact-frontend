
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CandidateDetailProps {
  candidateId?: string;
}

interface PredictionScore {
  value: number;
  label: string;
  color: string;
}

interface Section {
  title: string;
  content: string;
  isOpen: boolean;
}

const CandidateDetail = ({ candidateId = '1' }: CandidateDetailProps) => {
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(75);
  const [showJustification, setShowJustification] = useState(false);
  const [sections, setSections] = useState<Section[]>([
    {
      title: 'Skills & Experience',
      content: 'The candidate has 5+ years of experience in frontend development with React.js, and has demonstrated expertise in UI/UX design principles. They have led multiple projects at their previous company and have shown ability to work in team settings.',
      isOpen: true
    },
    {
      title: 'Education',
      content: 'Bachelor of Computer Science from University of Technology. Additional certifications in Web Development and UX Design from recognized institutions.',
      isOpen: false
    },
    {
      title: 'Achievements',
      content: 'Led the redesign of a major client website that increased conversion rates by 25%. Speaker at ReactConf 2023. Published articles on modern web development techniques.',
      isOpen: false
    }
  ]);
  
  const predictionScores: PredictionScore[] = [
    { value: 85, label: 'Technical Skills', color: 'bg-green-500' },
    { value: 70, label: 'Cultural Fit', color: 'bg-yellow-500' },
    { value: 90, label: 'Experience', color: 'bg-green-500' },
    { value: 65, label: 'Education', color: 'bg-yellow-500' }
  ];
  
  // Animate score counting
  useEffect(() => {
    if (score < finalScore) {
      const timeout = setTimeout(() => {
        setScore(prev => Math.min(prev + 1, finalScore));
      }, 15);
      return () => clearTimeout(timeout);
    }
    
    if (score === finalScore) {
      setTimeout(() => {
        setShowJustification(true);
      }, 500);
    }
  }, [score, finalScore]);
  
  const toggleSection = (index: number) => {
    setSections(prev => prev.map((section, i) => {
      if (i === index) {
        return { ...section, isOpen: !section.isOpen };
      }
      return section;
    }));
  };
  
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreClass = (value: number) => {
    if (value >= 80) return 'stroke-green-500';
    if (value >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden animate-fade-in">
      <div className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center">
          <Link 
            to="/candidates" 
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <ArrowLeft size={20} className="group-hover:translate-x-[-2px] transition-all duration-200" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">John Doe</h1>
            <p className="text-sm text-gray-500">Frontend Developer</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => toggleSection(index)}
              >
                <h3 className="font-medium text-gray-800">{section.title}</h3>
                {section.isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {section.isOpen && (
                <div 
                  className="px-4 py-3 animate-accordion-down"
                >
                  <p className="text-gray-700">{section.content}</p>
                </div>
              )}
            </div>
          ))}
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-3">Prediction Justification</h3>
            
            <div className="space-y-4">
              {predictionScores.map((item, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      getScoreColor(item.value)
                    )}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${item.color} transition-all duration-700 ease-out`} 
                      style={{ 
                        width: `${item.value}%`,
                        transitionDelay: `${index * 100}ms` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Match Score</h3>
            
            <div className="circle-progress w-36 h-36 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  className={getScoreClass(score)}
                  strokeWidth="8" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * score) / 100} 
                  strokeLinecap="round"
                />
              </svg>
              <span className={`circle-progress-text ${getScoreColor(score)}`}>
                {score}%
              </span>
            </div>
            
            <div 
              className={cn(
                "text-center transform transition-all duration-500",
                showJustification 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[-10px]"
              )}
            >
              <p className="text-gray-700 text-sm">
                This candidate is a <strong className={getScoreColor(score)}>good match</strong> for the position based on their skills and experience.
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-3">Actions</h3>
            
            <div className="space-y-2">
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-1"
              >
                <Check size={16} />
                Approve Candidate
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-1"
              >
                <X size={16} />
                Reject Candidate
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
              >
                Schedule Interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
