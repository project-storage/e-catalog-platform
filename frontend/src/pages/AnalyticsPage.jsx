import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Reports Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-gray-500">
          Analytics dashboard is under development.
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
