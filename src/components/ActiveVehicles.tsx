import { Card } from './ui/card';
import { Input } from './ui/input';
import { Vehicle } from '../types/parking';
import { Search, Car, Bike, Truck, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface ActiveVehiclesProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
}

export function ActiveVehicles({ vehicles, onVehicleClick }: ActiveVehiclesProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(v => 
    v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <Car className="w-5 h-5" />;
      case 'motorcycle':
        return <Bike className="w-5 h-5" />;
      case 'truck':
        return <Truck className="w-5 h-5" />;
    }
  };

  const getDuration = (checkInTime: Date) => {
    const duration = Math.floor((new Date().getTime() - checkInTime.getTime()) / 1000 / 60);
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Active Vehicles</h2>
        <span className="text-sm text-gray-600">{vehicles.length} parked</span>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by license plate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredVehicles.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {searchTerm ? 'No vehicles found' : 'No active vehicles'}
          </p>
        ) : (
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded">
                  {getVehicleIcon(vehicle.vehicleType)}
                </div>
                <div>
                  <p>{vehicle.licensePlate}</p>
                  <p className="text-sm text-gray-600">Spot #{vehicle.spotNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{getDuration(vehicle.checkInTime)}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onVehicleClick(vehicle)}
                >
                  Check Out
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
