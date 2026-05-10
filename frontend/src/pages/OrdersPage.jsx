import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Orders List</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-gray-500">
          Order management system is under development.
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
