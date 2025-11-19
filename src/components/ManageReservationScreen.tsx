import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Reservation } from '../types/parking';
import { MapPin, Clock, QrCode, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ManageReservationScreenProps {
  onBack: () => void;
  reservation: Reservation | null;
  onCancel: () => void;
  onSimulateEntry?: () => void;
  onSimulateExit?: () => void;
}

export function ManageReservationScreen({ onBack, reservation, onCancel, onSimulateEntry, onSimulateExit }: ManageReservationScreenProps) {
  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <IOSHeader largeTitle="Manage Reservation" onBack={onBack} showBack />
        <div className="p-4">
          <Card className="p-8 rounded-[14px] border-0 shadow-sm text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[17px] text-gray-500">No active reservation</p>
            <p className="text-[13px] text-gray-400 mt-1">
              Book a parking spot to see it here
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'started':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Entry';
      case 'started':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader largeTitle="Manage Reservation" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[13px] text-gray-500">Reservation Status</p>
              <p className="text-[24px] mt-1">Spot {reservation.spotNumber}</p>
              <div className="flex items-center gap-1 text-[13px] text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{reservation.location}</span>
              </div>
            </div>
            <div className={`${getStatusColor(reservation.status)} px-3 py-1 rounded-full`}>
              <p className="text-[13px] text-white">{getStatusText(reservation.status)}</p>
            </div>
          </div>

          <div className="space-y-2 text-[15px]">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reservation ID</span>
              <span>{reservation.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Start Time</span>
              <span>
                {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">End Time</span>
              <span>
                {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </Card>

        {/* QR Code Card - Always visible */}
        <Card className="p-6 rounded-[14px] border-0 shadow-sm bg-white">
          <div className="text-center">
            <p className="text-[13px] text-gray-500 uppercase tracking-wide mb-4">
              {reservation.status === 'pending' ? 'Show this at Entry Gate' : 'Show this at Exit Gate'}
            </p>
            <div className="bg-gray-50 p-6 rounded-[14px] inline-block mb-4">
              <QRCodeSVG 
                value={JSON.stringify({
                  reservationId: reservation.id,
                  spotNumber: reservation.spotNumber,
                  userId: reservation.userId
                })} 
                size={220} 
              />
            </div>
            <p className="text-[15px] text-gray-600 mb-1">Reservation Code</p>
            <p className="text-[17px] tracking-wider">{reservation.id.substring(0, 8).toUpperCase()}</p>
            {reservation.status === 'started' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-green-600 bg-green-50 py-2 px-4 rounded-full">
                <Clock className="w-4 h-4" />
                <span>Session Active - Use at exit</span>
              </div>
            )}
            {reservation.status === 'pending' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[13px] text-blue-600 bg-blue-50 py-2 px-4 rounded-full">
                <QrCode className="w-4 h-4" />
                <span>Ready for entry scan</span>
              </div>
            )}
          </div>
        </Card>

        {/* Demo: Simulate Gate Scanning */}
        {(onSimulateEntry || onSimulateExit) && (
          <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-gray-100">
            <p className="text-[13px] text-gray-500 uppercase tracking-wide mb-3 text-center">
              Demo Controls (Gate Simulation)
            </p>
            <div className="space-y-2">
              {reservation.status === 'pending' && onSimulateEntry && (
                <Button
                  onClick={onSimulateEntry}
                  className="w-full h-12 bg-green-500 hover:bg-green-600 text-[17px] rounded-[10px]"
                >
                  Simulate Entry Gate Scan
                </Button>
              )}
              {reservation.status === 'started' && onSimulateExit && (
                <Button
                  onClick={onSimulateExit}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-[17px] rounded-[10px]"
                >
                  Simulate Exit Gate Scan
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Cancel Button */}
        {(reservation.status === 'pending' || reservation.status === 'started') && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full h-12 text-red-500 border-red-200 hover:bg-red-50 text-[17px] rounded-[10px]"
          >
            Cancel Reservation
          </Button>
        )}
      </div>
    </div>
  );
}
