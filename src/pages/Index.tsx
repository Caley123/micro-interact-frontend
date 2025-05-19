
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/components/dashboard/Dashboard';

const Index = () => {
  // Establecer el título de la página
  document.title = 'Escuela Pontificia - Panel de Control';
  
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
};

export default Index;
