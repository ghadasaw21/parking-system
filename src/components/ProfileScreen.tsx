import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User } from '../types/parking';
import { UserCircle, Mail, Phone, IdCard, Clock, LogOut } from 'lucide-react';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ user, onBack, onLogout }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader largeTitle="Profile" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card className="p-6 rounded-[14px] border-0 shadow-sm text-center">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-[24px] mb-1">{user.fullName}</h2>
          <p className="text-[15px] text-gray-500 capitalize">
            {user.userType.replace('_', ' ')}
          </p>
        </Card>

        {/* Account Information */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <h3 className="text-[13px] text-gray-600 uppercase tracking-wide mb-4">
            Account Information
          </h3>
          
          <div className="space-y-0 divide-y divide-gray-100">
            <div className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 bg-blue-100 rounded-[10px] flex items-center justify-center">
                <IdCard className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-500">University ID</p>
                <p className="text-[17px]">{user.universityId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 bg-green-100 rounded-[10px] flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-500">Phone Number</p>
                <p className="text-[17px]">{user.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 bg-purple-100 rounded-[10px] flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-gray-500">Free Hours</p>
                <p className="text-[17px]">{user.freeHours} hours</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Parking Plan */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-[15px] text-blue-900 mb-2">Parking Plan</h3>
          <div className="space-y-2 text-[13px] text-blue-800">
            <div className="flex justify-between">
              <span>User Type:</span>
              <span className="capitalize">{user.userType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Free Parking:</span>
              <span>{user.freeHours} hours/session</span>
            </div>
            <div className="flex justify-between">
              <span>Extra Fee:</span>
              <span>10 SAR/hour</span>
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <h3 className="text-[13px] text-gray-600 uppercase tracking-wide mb-3">
            About
          </h3>
          <div className="space-y-2 text-[15px] text-gray-600">
            <div className="flex justify-between py-2">
              <span>App Version</span>
              <span className="text-gray-400">1.0.0</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Terms of Service</span>
              <span className="text-gray-400">›</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Privacy Policy</span>
              <span className="text-gray-400">›</span>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 text-red-500 border-red-200 hover:bg-red-50 text-[17px] rounded-[10px] flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
