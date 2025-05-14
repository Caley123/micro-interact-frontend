
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ResumeUploader from '@/components/resume/ResumeUploader';

const ResumeAnalysis = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <ResumeUploader />
      </div>
    </AppLayout>
  );
};

export default ResumeAnalysis;
