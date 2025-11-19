import { Card } from './ui/card';
import { Car, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { ParkingStats } from '../types/parking';

interface DashboardProps {
  stats: ParkingStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const occupancyRate = (stats.occupiedSpots / stats.totalSpots) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spots</p>
            <p className="text-2xl">{stats.totalSpots}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl">{stats.availableSpots}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Occupied</p>
            <p className="text-2xl">{stats.occupiedSpots}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Revenue Today</p>
            <p className="text-2xl">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 lg:col-span-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Occupancy Rate</p>
            <p className="text-2xl">{occupancyRate.toFixed(1)}%</p>
          </div>
          <div className="flex-1 mx-8">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${occupancyRate}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
