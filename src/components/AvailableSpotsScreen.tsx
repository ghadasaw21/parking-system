import { useState, useEffect } from 'react';
import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ParkingSpot } from '../types/parking';
import { MapPin, Clock } from 'lucide-react';

interface AvailableSpotsScreenProps {
  onBack: () => void;
  onConfirm: (spot: ParkingSpot) => void;
  startTime: string;
  endTime: string;
}

export function AvailableSpotsScreen({ onBack, onConfirm, startTime, endTime }: AvailableSpotsScreenProps) {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [holdCountdown, setHoldCountdown] = useState<number | null>(null);

  // Generate mock spots
  useEffect(() => {
    const mockSpots: ParkingSpot[] = [
      { id: '1', spotNumber: 'A-101', location: 'Building A - Level 1', status: 'available' },
      { id: '2', spotNumber: 'A-102', location: 'Building A - Level 1', status: 'available' },
      { id: '3', spotNumber: 'A-103', location: 'Building A - Level 1', status: 'reserved' },
      { id: '4', spotNumber: 'B-201', location: 'Building B - Level 2', status: 'available' },
      { id: '5', spotNumber: 'B-202', location: 'Building B - Level 2', status: 'on_hold' },
      { id: '6', spotNumber: 'C-301', location: 'Building C - Level 3', status: 'available' },
      { id: '7', spotNumber: 'C-302', location: 'Building C - Level 3', status: 'available' },
      { id: '8', spotNumber: 'D-101', location: 'Building D - Level 1', status: 'available' },
    ];
    setSpots(mockSpots);
  }, []);

  const handleSelectSpot = (spot: ParkingSpot) => {
    if (spot.status !== 'available') return;
    
    setSelectedSpot(spot);
    setHoldCountdown(300); // 5 minutes in seconds
    
    // Update spot status to on_hold
    setSpots(prev =>
      prev.map(s =>
        s.id === spot.id
          ? { ...s, status: 'on_hold', holdUntil: new Date(Date.now() + 5 * 60 * 1000) }
          : s
      )
    );
  };

  // Countdown timer
  useEffect(() => {
    if (holdCountdown === null || holdCountdown <= 0) return;
    
    const timer = setInterval(() => {
      setHoldCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [holdCountdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'on_hold':
        return 'bg-yellow-500';
      case 'reserved':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'on_hold':
        return 'On Hold';
      case 'reserved':
        return 'Reserved';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader largeTitle="Available Spots" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        {/* Time Info */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <div className="flex items-center gap-2 text-[15px]">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Selected Time:</span>
            <span>{startTime} - {endTime}</span>
          </div>
        </Card>

        {/* Hold Message */}
        {selectedSpot && holdCountdown !== null && (
          <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-yellow-50">
            <p className="text-[15px] text-yellow-900 mb-2">
              This spot is now on hold for 5 minutes
            </p>
            <p className="text-[13px] text-yellow-700">
              Time remaining: {formatCountdown(holdCountdown)}
            </p>
          </Card>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 text-[13px]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>On Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Reserved</span>
          </div>
        </div>

        {/* Spots List */}
        <div className="space-y-3">
          {spots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => handleSelectSpot(spot)}
              disabled={spot.status !== 'available'}
              className={`w-full ${
                spot.status === 'available' ? 'active:bg-gray-100' : 'opacity-50'
              }`}
            >
              <Card className={`p-4 rounded-[14px] border-2 shadow-sm ${
                selectedSpot?.id === spot.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(spot.status)}`} />
                    <div className="text-left">
                      <p className="text-[17px]">Spot {spot.spotNumber}</p>
                      <div className="flex items-center gap-1 text-[13px] text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{spot.location}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[13px] text-gray-500">
                    {getStatusText(spot.status)}
                  </span>
                </div>
              </Card>
            </button>
          ))}
        </div>

        {selectedSpot && (
          <Button
            onClick={() => onConfirm(selectedSpot)}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px]"
          >
            Confirm Reservation
          </Button>
        )}
      </div>
    </div>
  );
}
