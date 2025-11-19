import { IOSCard } from './IOSCard';
import { User, Reservation } from '../types/parking';
import { 
  MapPin, 
  Calendar, 
  QrCode, 
  Clock,
  UserCircle
} from 'lucide-react';
import { Card } from './ui/card';

interface HomeDashboardProps {
  user: User;
  activeReservation: Reservation | null;
  onNavigate: (screen: string) => void;
}

export function HomeDashboard({ user, activeReservation, onNavigate }: HomeDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* iOS Status Bar Space */}
      <div className="h-11 bg-white" />
      
      {/* Large Title Header */}
      <div className="bg-white px-4 pt-2 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[34px] tracking-tight">Welcome</h1>
          <button
            onClick={() => onNavigate('profile')}
            className="text-blue-500 active:opacity-50 p-2 -mr-2"
          >
            <UserCircle className="w-7 h-7" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[17px] text-gray-500">{user.fullName}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Reservation Card */}
        {activeReservation && (
          <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[13px] text-blue-100">Active Reservation</p>
                <p className="text-[24px] mt-1">Spot {activeReservation.spotNumber}</p>
                <p className="text-[15px] text-blue-100">{activeReservation.location}</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <p className="text-[13px]">
                  {activeReservation.status === 'started' ? 'In Progress' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[15px] text-blue-100">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(activeReservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(activeReservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </Card>
        )}

        {/* User Info Card */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] text-gray-500">Your Plan</p>
              <p className="text-[17px] capitalize">{user.userType.replace('_', ' ')}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-gray-500">Free Hours</p>
              <p className="text-[24px] text-blue-500">{user.freeHours}h</p>
            </div>
          </div>
        </Card>

        {/* Main Actions */}
        <div className="space-y-3">
          <IOSCard
            icon={MapPin}
            title="Book Parking"
            subtitle="Reserve your spot"
            color="bg-blue-500"
            onClick={() => onNavigate('book')}
          />

          <IOSCard
            icon={Calendar}
            title="Manage Reservation"
            subtitle={activeReservation ? 'View current booking' : 'No active reservation'}
            color="bg-purple-500"
            onClick={() => onNavigate('manage')}
            badge={activeReservation ? '1' : undefined}
          />

          <IOSCard
            icon={Calendar}
            title="View Reservations"
            subtitle="See all your bookings"
            color="bg-indigo-500"
            onClick={() => onNavigate('viewReservations')}
          />
        </div>
      </div>
    </div>
  );
}