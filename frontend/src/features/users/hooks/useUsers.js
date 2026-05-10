import { useState, useMemo } from 'react';
import { USERS_DATA } from '../constants';

export const useUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = useMemo(() => {
    return USERS_DATA.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    users: filteredUsers,
    totalCount: filteredUsers.length
  };
};
