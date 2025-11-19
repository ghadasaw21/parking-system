import { useState } from 'react';
import { MobileHeader } from './MobileHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Calendar, MapPin, DollarSign, CheckCircle, Star } from 'lucide-react';

interface MonthlyReservationScreenProps {
  onBack: () => void;
  onConfirm: (data: any) => void;
}

export function MonthlyReservationScreen({ onBack, onConfirm }: MonthlyReservationScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium' | 'executive'>('standard');
  const [licensePlate, setLicensePlate] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: 120,
      features: ['Any regular spot', 'Mon-Fri access', 'Email support'],
      color: 'blue',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 200,
      features: ['Reserved spot', '24/7 access', 'Priority support', 'Covered parking'],
      color: 'purple',
      popular: true,
    },
    {
      id: 'executive',
      name: 'Executive',
      price: 350,
      features: ['Premium reserved spot', '24/7 access', 'Concierge support', 'Covered parking', 'EV charging'],
      color: 'yellow',
    },
  ];

  const selectedPlanData = plans.find(p => p.id === selectedPlan)!;

  const handleConfirm = () => {
    if (licensePlate.trim()) {
      onConfirm({
        plan: selectedPlan,
        licensePlate: licensePlate.toUpperCase(),
        startDate,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader title="Monthly Reservation" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-start gap-3">
            <Star className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-yellow-900 mb-1">Faculty Exclusive</h3>
              <p className="text-sm text-yellow-800">
                Save up to 60% with monthly parking plans designed for faculty members.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h3>Select Your Plan</h3>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-4 cursor-pointer transition-all relative ${
                selectedPlan === plan.id
                  ? 'border-2 border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlan(plan.id as any)}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 right-4 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl">${plan.price}</span>
                    <span className="text-sm text-gray-600">/month</span>
                  </div>
                </div>
                {selectedPlan === plan.id && (
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <ul className="space-y-1 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <Card className="p-4 space-y-4">
          <h3>Reservation Details</h3>
          
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
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="mb-3 text-blue-900">Monthly Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="capitalize">{selectedPlanData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span>{new Date(startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span>
                {new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 1)).toLocaleDateString()}
              </span>
            </div>
            <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
              <span>Monthly Fee:</span>
              <div className="flex items-center gap-1 text-blue-600">
                <DollarSign className="w-5 h-5" />
                <span className="text-xl">{selectedPlanData.price}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm text-green-800">
            💰 You save ${((5 * 8 * 22) - selectedPlanData.price).toFixed(0)} compared to daily parking!
          </p>
        </Card>

        <Button 
          onClick={handleConfirm} 
          className="w-full" 
          size="lg"
          disabled={!licensePlate.trim()}
        >
          Subscribe - ${selectedPlanData.price}/month
        </Button>
      </div>
    </div>
  );
}
