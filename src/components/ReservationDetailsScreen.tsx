import { useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ParkingSpot } from '../types/parking';
import { MapPin, Calendar, Clock, Car, CreditCard, DollarSign } from 'lucide-react';
import { Badge } from './ui/badge';

interface ReservationDetailsScreenProps {
  onBack: () => void;
  onConfirm: (vehicleDetails: { licensePlate: string; color: string }) => void;
  bookingData: any;
  selectedSpot: ParkingSpot;
}

export function ReservationDetailsScreen({ 
  onBack, 
  onConfirm, 
  bookingData, 
  selectedSpot 
}: ReservationDetailsScreenProps) {
  const [licensePlate, setLicensePlate] = useState('');
  const [color, setColor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const totalCost = selectedSpot.pricePerHour * bookingData.duration;

  const handleConfirm = () => {
    if (licensePlate.trim()) {
      onConfirm({ licensePlate: licensePlate.toUpperCase(), color });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="Reservation Details" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <h3 className="mb-4">Booking Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600">Parking Spot</p>
                <p>Floor {selectedSpot.floor} - Section {selectedSpot.section} - Spot #{selectedSpot.id}</p>
                <Badge className="mt-1 capitalize">{selectedSpot.type}</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600">Date</p>
                <p>{new Date(bookingData.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600">Time</p>
                <p>{bookingData.startTime} - {bookingData.duration} hour(s)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600">Vehicle Type</p>
                <p className="capitalize">{bookingData.vehicleType}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3>Vehicle Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate Number</Label>
            <Input
              id="licensePlate"
              placeholder="ABC-1234"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Vehicle Color (Optional)</Label>
            <Input
              id="color"
              placeholder="e.g., White, Black, Silver"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method
          </h3>
          
          <div className="space-y-2">
            {[
              { value: 'credit_card', label: 'Credit Card', icon: '💳' },
              { value: 'debit_card', label: 'Debit Card', icon: '💳' },
              { value: 'wallet', label: 'Digital Wallet', icon: '📱' },
            ].map((method) => (
              <button
                key={method.value}
                onClick={() => setPaymentMethod(method.value)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  paymentMethod === method.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{method.icon}</span>
                {method.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between mb-2">
            <span>Total Amount</span>
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5" />
              <span className="text-2xl">{totalCost.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-blue-100">
            ${selectedSpot.pricePerHour}/hour × {bookingData.duration} hour(s)
          </p>
        </Card>

        <Button 
          onClick={handleConfirm} 
          className="w-full" 
          size="lg"
          disabled={!licensePlate.trim()}
        >
          Confirm & Pay ${totalCost.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
