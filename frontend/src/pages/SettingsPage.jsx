import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center text-gray-500">
          Configuration panel is under development.
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
