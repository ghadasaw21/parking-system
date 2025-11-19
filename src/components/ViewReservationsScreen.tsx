import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Reservation } from '../types/parking';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ViewReservationsScreenProps {
  onBack: () => void;
  reservations: Reservation[];
}

export function ViewReservationsScreen({ onBack, reservations }: ViewReservationsScreenProps) {
  const activeReservations = reservations.filter(r => 
    r.status === 'pending' || r.status === 'started'
  );
  const pastReservations = reservations.filter(r => 
    r.status === 'completed' || r.status === 'cancelled'
  );

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-700';
        case 'started':
          return 'bg-green-100 text-green-700';
        case 'completed':
          return 'bg-blue-100 text-blue-700';
        case 'cancelled':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <Card className="p-4 rounded-[14px] border-0 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[20px] mb-1">Spot {reservation.spotNumber}</p>
            <div className="flex items-center gap-1 text-[13px] text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{reservation.location}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${getStatusColor(reservation.status)}`}>
            <p className="text-[11px] capitalize">{reservation.status}</p>
          </div>
        </div>

        <div className="space-y-2 text-[15px]">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(reservation.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {reservation.extraFee !== undefined && reservation.extraFee > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Extra Fee Paid</span>
              <span className="text-blue-500">{reservation.extraFee} SAR</span>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader largeTitle="Reservations" onBack={onBack} showBack />

      <div className="p-4">
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-11 rounded-[10px]">
            <TabsTrigger value="active" className="text-[15px] rounded-[8px]">
              Active ({activeReservations.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="text-[15px] rounded-[8px]">
              Past ({pastReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {activeReservations.length === 0 ? (
              <Card className="p-8 rounded-[14px] border-0 shadow-sm text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-[17px] text-gray-500">No active reservations</p>
              </Card>
            ) : (
              activeReservations.map(reservation => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-3">
            {pastReservations.length === 0 ? (
              <Card className="p-8 rounded-[14px] border-0 shadow-sm text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-[17px] text-gray-500">No past reservations</p>
              </Card>
            ) : (
              pastReservations.map(reservation => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
