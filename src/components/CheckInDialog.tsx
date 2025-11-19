import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (licensePlate: string, vehicleType: 'car' | 'motorcycle' | 'truck') => void;
  spotNumber: number;
}

export function CheckInDialog({ isOpen, onClose, onCheckIn, spotNumber }: CheckInDialogProps) {
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleType, setVehicleType] = useState<'car' | 'motorcycle' | 'truck'>('car');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (licensePlate.trim()) {
      onCheckIn(licensePlate.toUpperCase(), vehicleType);
      setLicensePlate('');
      setVehicleType('car');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check In Vehicle - Spot #{spotNumber}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                placeholder="ABC-1234"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={(value: any) => setVehicleType(value)}>
                <SelectTrigger id="vehicleType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Check In</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
