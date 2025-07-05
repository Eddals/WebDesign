import React from 'react';
import EstimateForm from '../components/EstimateForm';

export default function Estimate() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a23] text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Solicite um Orçamento</h1>
      <EstimateForm />
    </div>
  );
}
