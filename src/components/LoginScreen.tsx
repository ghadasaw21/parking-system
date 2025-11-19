import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { User, UserType } from '../types/parking';
import { GraduationCap } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onCreateAccount: () => void;
}

export function LoginScreen({ onLogin, onCreateAccount }: LoginScreenProps) {
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would verify credentials
    const mockUser: User = {
      id: crypto.randomUUID(),
      fullName: 'Ghada Alajmi',
      universityId,
      phoneNumber: '+966501234567',
      userType: 'student',
      freeHours: 2,
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-500 w-20 h-20 rounded-[22px] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-11 h-11 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-[28px] tracking-tight mb-1">University Parking</h1>
          <p className="text-[15px] text-gray-500">Reservation System</p>
        </div>

        <Card className="p-6 rounded-[14px] border-0 shadow-md">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="universityId" className="text-[13px] text-gray-600 uppercase tracking-wide">
                University ID
              </Label>
              <Input
                id="universityId"
                placeholder="Enter your ID"
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="h-11 text-[17px] rounded-[10px] border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px] text-gray-600 uppercase tracking-wide">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 text-[17px] rounded-[10px] border-gray-300"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px] mt-6"
            >
              Sign In
            </Button>
          </form>
        </Card>

        <button
          onClick={onCreateAccount}
          className="w-full mt-4 text-blue-500 text-[17px]"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}