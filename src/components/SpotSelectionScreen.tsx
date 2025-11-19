import { useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ParkingSpot } from '../types/parking';
import { Badge } from './ui/badge';
import { MapPin, DollarSign } from 'lucide-react';

interface SpotSelectionScreenProps {
  onBack: () => void;
  onSelectSpot: (spot: ParkingSpot) => void;
  bookingData: any;
}

export function SpotSelectionScreen({ onBack, onSelectSpot, bookingData }: SpotSelectionScreenProps) {
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  // Mock parking spots
  const floors = ['1', '2', '3'];
  const sections = ['A', 'B', 'C'];
  
  const generateSpots = (floor: string): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    sections.forEach((section, sectionIdx) => {
      for (let i = 1; i <= 10; i++) {
        const spotNumber = parseInt(`${floor}${sectionIdx}${i.toString().padStart(2, '0')}`);
        spots.push({
          id: spotNumber,
          floor,
          section,
          isOccupied: Math.random() > 0.6,
          isReserved: Math.random() > 0.8,
          type: i <= 3 ? 'compact' : i === 10 ? 'accessible' : 'regular',
          pricePerHour: i === 10 ? 3 : i <= 3 ? 4 : 5,
        });
      }
    });
    return spots;
  };

  const [spots] = useState(() => {
    const allSpots: { [key: string]: ParkingSpot[] } = {};
    floors.forEach(floor => {
      allSpots[floor] = generateSpots(floor);
    });
    return allSpots;
  });

  const handleConfirm = () => {
    if (selectedSpot) {
      onSelectSpot(selectedSpot);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="Select Parking Spot" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <Tabs value={selectedFloor} onValueChange={setSelectedFloor}>
            <TabsList className="grid w-full grid-cols-3">
              {floors.map(floor => (
                <TabsTrigger key={floor} value={floor}>
                  Floor {floor}
                </TabsTrigger>
              ))}
            </TabsList>

            {floors.map(floor => (
              <TabsContent key={floor} value={floor} className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span>Occupied</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span>Selected</span>
                    </div>
                  </div>
                </div>

                {sections.map(section => (
                  <div key={section} className="mb-6">
                    <h3 className="text-sm mb-2">Section {section}</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {spots[floor]
                        .filter(spot => spot.section === section)
                        .map(spot => (
                          <button
                            key={spot.id}
                            onClick={() => !spot.isOccupied && !spot.isReserved && setSelectedSpot(spot)}
                            disabled={spot.isOccupied || spot.isReserved}
                            className={`
                              aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs transition-all
                              ${spot.id === selectedSpot?.id
                                ? 'bg-blue-500 text-white border-blue-600'
                                : spot.isOccupied || spot.isReserved
                                ? 'bg-red-100 border-red-300 text-red-400 cursor-not-allowed'
                                : 'bg-green-100 border-green-300 hover:bg-green-200'
                              }
                            `}
                          >
                            <span>{spot.id}</span>
                            {spot.type === 'accessible' && (
                              <Badge className="text-xs px-1 py-0 mt-1">♿</Badge>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {selectedSpot && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-blue-900 mb-1">Selected Spot</h3>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Floor {selectedSpot.floor} - Section {selectedSpot.section} - #{selectedSpot.id}</span>
                </div>
              </div>
              <Badge className="capitalize">{selectedSpot.type}</Badge>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="w-4 h-4" />
                <span>${selectedSpot.pricePerHour}/hour</span>
              </div>
              <span className="text-blue-900">
                Total: ${(selectedSpot.pricePerHour * bookingData.duration).toFixed(2)}
              </span>
            </div>
          </Card>
        )}

        <Button 
          onClick={handleConfirm} 
          className="w-full" 
          size="lg"
          disabled={!selectedSpot}
        >
          Confirm Spot Selection
        </Button>
      </div>
    </div>
  );
}
