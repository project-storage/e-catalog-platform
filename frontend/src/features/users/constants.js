export const USERS_DATA = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2024-02-10', avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager', status: 'Inactive', joinDate: '2024-01-20', avatar: 'MJ' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2024-03-05', avatar: 'SW' },
  { id: 5, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Pending', joinDate: '2024-03-15', avatar: 'DB' },
];

export const ROLE_VARIANTS = {
  Admin: 'purple',
  Manager: 'primary',
  User: 'default',
};

export const STATUS_VARIANTS = {
  Active: 'success',
  Inactive: 'destructive',
  Pending: 'warning',
};
