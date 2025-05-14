
import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import CandidateDetail from '@/components/candidates/CandidateDetail';

const CandidateDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AppLayout>
      <CandidateDetail candidateId={id} />
    </AppLayout>
  );
};

export default CandidateDetailsPage;
