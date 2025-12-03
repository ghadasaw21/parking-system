import { useState } from 'react';
import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { User } from '../types/parking';
import { AlertCircle, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface BookParkingScreenProps {
  user: User;
  onBack: () => void;
  onShowAvailableSpots: (startTime: string, endTime: string) => void;
}

export function BookParkingScreen({ user, onBack, onShowAvailableSpots }: BookParkingScreenProps) {
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState('AM');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('00');
  const [endPeriod, setEndPeriod] = useState('PM');
  const [showOvertimeAlert, setShowOvertimeAlert] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{ start: string; end: string } | null>(null);

  const isStudent = user.userType === 'student' || user.userType === 'gp_student';

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
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  const calculateDurationHours = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    const durationMinutes = endMinutes - startMinutes;
    return durationMinutes / 60;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = convertTo24Hour(startHour, startMinute, startPeriod);
    const endTime = convertTo24Hour(endHour, endMinute, endPeriod);
    
    // Check if staff is booking more than 8 hours
    if (user.userType === 'staff') {
      const durationHours = calculateDurationHours(startTime, endTime);
      
      if (durationHours > 8) {
        setPendingBooking({ start: startTime, end: endTime });
        setShowOvertimeAlert(true);
        return;
      }
    }
    
    onShowAvailableSpots(startTime, endTime);
  };

  const handleConfirmOvertime = () => {
    if (pendingBooking) {
      setShowOvertimeAlert(false);
      onShowAvailableSpots(pendingBooking.start, pendingBooking.end);
      setPendingBooking(null);
    }
  };

  const handleCancelOvertime = () => {
    setShowOvertimeAlert(false);
    setPendingBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader largeTitle="Book Parking" onBack={onBack} showBack />

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isStudent && (
            <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-blue-50">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[15px] text-blue-900">
                    Booking times must align with your class schedule
                  </p>
                  {user.userType === 'gp_student' && (
                    <p className="text-[13px] text-blue-700 mt-1">
                      Select your attendance days manually
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4 rounded-[14px] border-0 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] text-gray-600 uppercase tracking-wide">
                  Start Time
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select value={startHour} onValueChange={setStartHour} required>
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
                  <Select value={endHour} onValueChange={setEndHour} required>
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
            </div>
          </Card>

          <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-gray-50">
            <div className="space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Free Hours</span>
                <span>{user.freeHours} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Extra Fee Rate</span>
                <span>10 SAR/hour</span>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px]"
            disabled={!startHour || !endHour}
          >
            Show Available Spots
          </Button>
        </form>
      </div>

      <AlertDialog open={showOvertimeAlert} onOpenChange={setShowOvertimeAlert}>
        <AlertDialogContent className="max-w-[270px] w-[270px] rounded-[14px] p-0">
          <AlertDialogHeader className="p-5 pb-3">
            <AlertDialogTitle className="text-[17px] text-center">Overtime Fee</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-center pt-1">
              You are booking more than 8 hours. You will be charged 10 SAR per hour for extra time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-0 sm:flex-col p-0 m-0">
            <AlertDialogAction 
              onClick={handleConfirmOvertime}
              className="w-full rounded-none border-t border-gray-200 h-11 bg-transparent text-blue-500 hover:bg-gray-50 hover:text-blue-600 m-0"
            >
              Confirm
            </AlertDialogAction>
            <AlertDialogCancel 
              onClick={handleCancelOvertime}
              className="w-full rounded-none rounded-b-[14px] border-t border-gray-200 h-11 m-0 hover:bg-gray-50"
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
