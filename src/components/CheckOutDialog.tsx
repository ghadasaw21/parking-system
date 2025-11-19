import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Vehicle } from '../types/parking';
import { Car, Bike, Truck, Clock, DollarSign } from 'lucide-react';

interface CheckOutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckOut: () => void;
  vehicle: Vehicle | null;
}

export function CheckOutDialog({ isOpen, onClose, onCheckOut, vehicle }: CheckOutDialogProps) {
  if (!vehicle) return null;

  const duration = Math.floor((new Date().getTime() - vehicle.checkInTime.getTime()) / 1000 / 60);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  // Calculate cost: $5/hour for cars, $3/hour for motorcycles, $8/hour for trucks
  const hourlyRate = vehicle.vehicleType === 'car' ? 5 : vehicle.vehicleType === 'motorcycle' ? 3 : 8;
  const cost = Math.max(hourlyRate, Math.ceil(duration / 60) * hourlyRate);

  const getVehicleIcon = () => {
    switch (vehicle.vehicleType) {
      case 'car':
        return <Car className="w-8 h-8" />;
      case 'motorcycle':
        return <Bike className="w-8 h-8" />;
      case 'truck':
        return <Truck className="w-8 h-8" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check Out Vehicle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-white rounded-lg">
              {getVehicleIcon()}
            </div>
            <div>
              <p className="text-sm text-gray-600">License Plate</p>
              <p className="text-xl">{vehicle.licensePlate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Clock className="w-4 h-4" />
                <p className="text-sm">Duration</p>
              </div>
              <p className="text-lg">
                {hours > 0 && `${hours}h `}
                {minutes}m
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <DollarSign className="w-4 h-4" />
                <p className="text-sm">Total Cost</p>
              </div>
              <p className="text-lg">${cost.toFixed(2)}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-100 rounded text-sm text-gray-600">
            <p>Check-in: {vehicle.checkInTime.toLocaleString()}</p>
            <p>Spot: #{vehicle.spotNumber}</p>
            <p className="mt-2">Rate: ${hourlyRate}/hour</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCheckOut}>
            Complete Check Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
