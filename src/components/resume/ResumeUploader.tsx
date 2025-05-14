
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type FileWithPreview = File & {
  preview?: string;
  id: string;
};

const ResumeUploader = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dropzoneActive, setDropzoneActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setDropzoneActive(false);
    
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        id: Math.random().toString(36).substring(2),
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Show success toast
    toast('Files added successfully', {
      description: `Added ${acceptedFiles.length} file(s)`,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    });
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 10,
  });
  
  useEffect(() => {
    setDropzoneActive(isDragActive);
  }, [isDragActive]);
  
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    
    // Show info toast
    toast('File removed', {
      icon: <X className="h-4 w-4 text-gray-500" />,
    });
  };
  
  const uploadFiles = async () => {
    if (files.length === 0) {
      toast('No files to upload', {
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      });
      return;
    }
    
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    // Simulate API request
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast('Upload complete', {
        description: `Successfully uploaded ${files.length} file(s)`,
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
      
      // Redirect or continue to next step would happen here
    } catch (error) {
      toast('Upload failed', {
        description: 'There was an error uploading your files.',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      });
    } finally {
      setIsUploading(false);
      clearInterval(interval);
      setProgress(0);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Upload Resumes</h2>
      
      <div 
        {...getRootProps()} 
        className={cn(
          "dropzone group",
          dropzoneActive && "active-dropzone"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full bg-primary/10 mb-3 group-hover:bg-primary/20 transition-all duration-300">
            <Upload 
              size={32} 
              className="text-primary group-hover:scale-110 transition-all duration-300" 
            />
          </div>
          
          <p className="text-lg font-medium text-gray-700 mb-1">
            {dropzoneActive ? 'Drop files here' : 'Drag & Drop files here'}
          </p>
          <p className="text-gray-500 mb-3">or</p>
          
          <Button 
            type="button" 
            variant="outline" 
            className="group-hover:bg-primary/10 transition-all duration-300"
          >
            <Upload size={16} className="mr-2 group-hover:translate-y-[-2px] transition-all duration-300" />
            Select Files
          </Button>
          
          <p className="mt-3 text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
        
        {dropzoneActive && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <rect 
              width="100%" 
              height="100%" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeDasharray="8 4" 
              strokeDashoffset="0" 
              strokeLinecap="round" 
              className="text-primary animate-dash-animation" 
            />
          </svg>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Selected Files ({files.length})</h3>
          
          <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {files.map((file, index) => (
              <li 
                key={file.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-fade-in border border-gray-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center">
                  <File size={20} className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[200px] md:max-w-[300px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  onClick={() => removeFile(file.id)}
                >
                  <X size={16} className="text-gray-500 hover:text-red-500 transition-colors duration-200" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6">
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <Button
          type="button"
          className="w-full btn-primary"
          onClick={uploadFiles}
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Start Analysis'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ResumeUploader;
