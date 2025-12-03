import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Reservation } from '../types/parking';
import { MapPin, Clock, QrCode, AlertCircle, Edit2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ManageReservationScreenProps {
  onBack: () => void;
  reservation: Reservation | null;
  onCancel: () => void;
  onSimulateEntry?: () => void;
  onSimulateExit?: () => void;
  onUpdateReservation?: (startTime: Date, endTime: Date) => void;
}

export function ManageReservationScreen({ 
  onBack, 
  reservation, 
  onCancel, 
  onSimulateEntry, 
  onSimulateExit,
  onUpdateReservation 
}: ManageReservationScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('00');
  const [endPeriod, setEndPeriod] = useState('PM');

  // Generate time options
  const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutes = ['00', '15', '30', '45'];

  const convertTo24Hour = (hour: string, minute: string, period: string) => {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    return { hour24, minute };
  };

  const convertFrom24Hour = (date: Date) => {
    let hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour >= 12 ? 'PM' : 'AM';
    
    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour = hour - 12;
    }
    
    return {
      hour: hour.toString().padStart(2, '0'),
      minute: minute.toString().padStart(2, '0'),
      period
    };
  };

  const handleEdit = () => {
    if (reservation) {
      const start = convertFrom24Hour(new Date(reservation.startTime));
      const end = convertFrom24Hour(new Date(reservation.endTime));
      
      setStartHour(start.hour);
      setStartMinute(start.minute);
      setStartPeriod(start.period);
      setEndHour(end.hour);
      setEndMinute(end.minute);
      setEndPeriod(end.period);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!reservation || !onUpdateReservation) return;

    const startConverted = convertTo24Hour(startHour, startMinute, startPeriod);
    const endConverted = convertTo24Hour(endHour, endMinute, endPeriod);
    
    // Create new Date objects with today's date and the selected times
    const today = new Date(reservation.startTime);
    const newStartTime = new Date(today);
    newStartTime.setHours(startConverted.hour24, parseInt(startConverted.minute), 0, 0);
    
    const newEndTime = new Date(today);
    newEndTime.setHours(endConverted.hour24, parseInt(endConverted.minute), 0, 0);
    
    onUpdateReservation(newStartTime, newEndTime);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

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

        {/* Edit Reservation */}
        {reservation.status === 'pending' && onUpdateReservation && (
          <Card className="p-4 rounded-[14px] border-0 shadow-sm">
            {!isEditing ? (
              <>
                <p className="text-[13px] text-gray-500 uppercase tracking-wide mb-3">
                  Edit Reservation
                </p>
                <Button
                  onClick={handleEdit}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px] flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Time
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[13px] text-gray-500 uppercase tracking-wide">
                    Edit Reservation
                  </p>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[13px] text-gray-600 uppercase tracking-wide">
                      Start Time
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={startHour} onValueChange={setStartHour}>
                        <SelectTrigger className="h-11 text-[17px] rounded-[10px] border-gray-300">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour} className="text-[17px]">
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={startMinute} onValueChange={setStartMinute}>
                        <SelectTrigger className="h-11 text-[17px] rounded-[10px] border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={minute} className="text-[17px]">
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={startPeriod} onValueChange={setStartPeriod}>
                        <SelectTrigger className="h-11 text-[17px] rounded-[10px] border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM" className="text-[17px]">AM</SelectItem>
                          <SelectItem value="PM" className="text-[17px]">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[13px] text-gray-600 uppercase tracking-wide">
                      End Time
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={endHour} onValueChange={setEndHour}>
                        <SelectTrigger className="h-11 text-[17px] rounded-[10px] border-gray-300">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour} className="text-[17px]">
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={endMinute} onValueChange={setEndMinute}>
                        <SelectTrigger className="h-11 text-[17px] rounded-[10px] border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={minute} className="text-[17px]">
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={endPeriod} onValueChange={setEndPeriod}>
                        <SelectTrigger className="h-11 text-[17px] rounded-[10px] border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM" className="text-[17px]">AM</SelectItem>
                          <SelectItem value="PM" className="text-[17px]">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveEdit}
                    className="w-full h-12 bg-green-500 hover:bg-green-600 text-[17px] rounded-[10px]"
                    disabled={!startHour || !endHour}
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Cancel Button - Only show when status is 'pending' */}
        {reservation.status === 'pending' && (
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
