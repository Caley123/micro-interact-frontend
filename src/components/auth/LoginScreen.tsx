
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, AlertCircle } from 'lucide-react';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Form validation
    const newErrors: string[] = [];
    if (!username) newErrors.push('Username is required');
    if (!password) newErrors.push('Password is required');
    if (password && password.length < 6) newErrors.push('Password must be at least 6 characters');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes only - successful login for specific credentials
      if (username === 'admin' && password === 'password') {
        toast({
          title: 'Login successful',
          description: 'Welcome back to Lovable Recruiter!',
          variant: 'default',
        });
        navigate('/');
      } else {
        setErrors(['Invalid username or password']);
      }
    } catch (error) {
      setErrors(['An error occurred. Please try again.']);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Lovable Recruiter</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md animate-slideInDown flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 animate-pulse" />
            {errors.length === 1 ? (
              <span>{errors[0]}</span>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="animate-staggeredFadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Label htmlFor="username" className="text-sm font-medium">
                Username / Email
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 transition-all focus:border-2 focus:border-primary"
                  disabled={isLoading}
                  placeholder="Enter your username or email"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                {username && username.length >= 3 && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 animate-scaleIn">
                    ✓
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 transition-all focus:border-2 focus:border-primary"
                  disabled={isLoading}
                  placeholder="Enter your password"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-transform"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 animate-rotate" />
                  ) : (
                    <Eye className="w-4 h-4 animate-rotate" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isLoading}
                  className="animate-checkmark"
                />
                <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:shadow-md group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                <span className="group-active:scale-95 transition-transform">Log in</span>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
