
import React, { useState, useEffect } from 'react';
import { User, KeyRound } from 'lucide-react';
import InputField from '../ui/custom/InputField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  
  // Username validation
  const [usernameValidation, setUsernameValidation] = useState({
    isValid: false,
    message: '',
    showValidation: false
  });
  
  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    message: '',
    showValidation: false
  });
  
  useEffect(() => {
    // Validate username
    if (username.length > 0) {
      if (username.length >= 3) {
        setUsernameValidation({
          isValid: true,
          message: 'Username looks good!',
          showValidation: true
        });
      } else {
        setUsernameValidation({
          isValid: false,
          message: 'Username must be at least 3 characters',
          showValidation: true
        });
      }
    } else {
      setUsernameValidation({
        isValid: false,
        message: '',
        showValidation: false
      });
    }
  }, [username]);
  
  useEffect(() => {
    // Validate password
    if (password.length > 0) {
      if (password.length >= 6) {
        setPasswordValidation({
          isValid: true,
          message: 'Password strength: Good',
          showValidation: true
        });
      } else {
        setPasswordValidation({
          isValid: false,
          message: 'Password must be at least 6 characters',
          showValidation: true
        });
      }
    } else {
      setPasswordValidation({
        isValid: false,
        message: '',
        showValidation: false
      });
    }
  }, [password]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setErrors([]);
    
    // Validate form
    const validationErrors = [];
    
    if (username.length < 3) {
      validationErrors.push('Username must be at least 3 characters');
    }
    
    if (password.length < 6) {
      validationErrors.push('Password must be at least 6 characters');
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Simulate login
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock login failure for demo purposes
      if (username === 'admin' && password === 'password') {
        // Login success logic would go here
        console.log('Login successful');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgba(0,0,0,0.05)] animate-fade-in p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-scale-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">lovable.dev</h1>
          <p className="text-gray-600 mt-1">Resume Analysis Platform</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md animate-slide-in-down flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
        
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md animate-slide-in-down">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-5 h-5 text-red-500 animate-pulse" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="font-medium">Please fix the following errors:</span>
            </div>
            <ul className="list-disc pl-10 space-y-1 mt-1">
              {errors.map((err, index) => (
                <li 
                  key={index} 
                  className="text-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-slide-in-down"
                >
                  {err}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <InputField
            id="username"
            label="Username / Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username or email"
            icon={<User size={18} />}
            validation={usernameValidation}
            autoComplete="username"
            className="pl-10"
          />
          
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={<KeyRound size={18} />}
            showPasswordToggle
            validation={passwordValidation}
            autoComplete="current-password"
            className="pl-10"
          />
          
          <div className="flex items-center justify-between mb-6 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="transition-all duration-300 data-[state=checked]:animate-scale-in"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            
            <a href="#" className="text-sm text-primary hover:underline transition">
              Forgot password?
            </a>
          </div>
          
          <Button
            type="submit"
            className="w-full btn-primary hover:shadow-md transition-all duration-300 active:animate-pulse-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <a href="#" className="text-primary font-medium hover:underline transition">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
