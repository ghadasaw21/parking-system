import { Car, Bike, Truck } from 'lucide-react';
import { ParkingSpot as ParkingSpotType } from '../types/parking';

interface ParkingSpotProps {
  spot: ParkingSpotType;
  onClick: () => void;
}

export function ParkingSpot({ spot, onClick }: ParkingSpotProps) {
  const getVehicleIcon = () => {
    if (!spot.vehicle) return null;
    
    switch (spot.vehicle.vehicleType) {
      case 'car':
        return <Car className="w-6 h-6" />;
      case 'motorcycle':
        return <Bike className="w-6 h-6" />;
      case 'truck':
        return <Truck className="w-6 h-6" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border-2 transition-all hover:scale-105
        ${spot.isOccupied 
          ? 'bg-red-50 border-red-300 text-red-700' 
          : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
        }
      `}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
          {spot.isOccupied ? getVehicleIcon() : <Car className="w-6 h-6 opacity-30" />}
        </div>
        <span className="text-sm">#{spot.number}</span>
        {spot.isOccupied && spot.vehicle && (
          <span className="text-xs truncate max-w-full px-2 py-1 bg-white rounded">
            {spot.vehicle.licensePlate}
          </span>
        )}
      </div>
      {spot.type === 'compact' && (
        <span className="absolute top-1 right-1 text-xs bg-blue-100 text-blue-700 px-1 rounded">
          C
        </span>
      )}
      {spot.type === 'large' && (
        <span className="absolute top-1 right-1 text-xs bg-purple-100 text-purple-700 px-1 rounded">
          L
        </span>
      )}
    </button>
  );
}
