import { useState } from 'react';
import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { User, UserType } from '../types/parking';

interface CreateAccountScreenProps {
  onBack: () => void;
  onVerify: (user: User) => void;
}

export function CreateAccountScreen({ onBack, onVerify }: CreateAccountScreenProps) {
  const [fullName, setFullName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const freeHours = userType === 'staff' ? 8 : userType === 'gp_student' ? 3 : 2;
    const newUser: User = {
      id: crypto.randomUUID(),
      fullName,
      universityId,
      phoneNumber,
      userType,
      freeHours,
    };
    onVerify(newUser);
  };

  const userTypes = [
    { value: 'student', label: 'Student', hours: 2 },
    { value: 'gp_student', label: 'GP Student', hours: 3 },
    { value: 'staff', label: 'Staff', hours: 8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader title="Create Account" onBack={onBack} showBack />

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-4 rounded-[14px] border-0 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[13px] text-gray-600 uppercase tracking-wide">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 text-[17px] rounded-[10px] border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="universityId" className="text-[13px] text-gray-600 uppercase tracking-wide">
                  University ID
                </Label>
                <Input
                  id="universityId"
                  placeholder="Enter your university ID"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className="h-11 text-[17px] rounded-[10px] border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-[13px] text-gray-600 uppercase tracking-wide">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+966 50 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 text-[17px] rounded-[10px] border-gray-300"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-[14px] border-0 shadow-sm">
            <Label className="text-[13px] text-gray-600 uppercase tracking-wide mb-3 block">
              User Type
            </Label>
            <div className="space-y-0 divide-y divide-gray-100">
              {userTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setUserType(type.value as UserType)}
                  className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        userType === type.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {userType === type.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[17px]">{type.label}</p>
                      <p className="text-[13px] text-gray-500">{type.hours} free hours</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Button 
            type="submit" 
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px]"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
