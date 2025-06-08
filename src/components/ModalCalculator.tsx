import React, { useState } from "react";
import AiEstimatedCalculator from "./AiEstimatedCalculator";

const ModalCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Estime o Preço do Seu Serviço
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <p className="text-center text-gray-700 mb-6">
              Quer saber quanto vai custar? Use nosso <strong>AI Estimated Calculator</strong> para obter uma estimativa instantânea!
            </p>
            <AiEstimatedCalculator />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCalculator;