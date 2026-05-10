import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const StatsCard = ({ title, value, change, trend, icon: Icon = BarChart3, color = 'blue' }) => {
  const colorVariants = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-200',
    green: 'from-green-500 to-green-600 shadow-green-200',
    yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-200',
    purple: 'from-purple-500 to-purple-600 shadow-purple-200',
    red: 'from-red-500 to-red-600 shadow-red-200',
  };

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
            colorVariants[color] || colorVariants.blue
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className={cn(
            "flex items-center text-xs font-bold px-2 py-1 rounded-full",
            trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          )}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {change}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
