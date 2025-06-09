import { useState } from "react";
import { Calculator, DollarSign } from "lucide-react";

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
}

const AiEstimatedCalculator = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [complexity, setComplexity] = useState<string>("medium");
  const [timeline, setTimeline] = useState<string>("standard");

  const services: ServiceOption[] = [
    { id: "website", name: "Website Design", basePrice: 1500 },
    { id: "ecommerce", name: "E-commerce Store", basePrice: 3000 },
    { id: "landing", name: "Landing Page", basePrice: 800 },
    { id: "seo", name: "SEO Optimization", basePrice: 500 },
    { id: "marketing", name: "Digital Marketing", basePrice: 1000 },
    { id: "automation", name: "Marketing Automation", basePrice: 1200 },
  ];

  const complexityMultipliers = {
    simple: 0.8,
    medium: 1.0,
    complex: 1.5,
  };

  const timelineMultipliers = {
    rush: 1.5,
    standard: 1.0,
    flexible: 0.9,
  };

  const calculateEstimate = () => {
    const baseTotal = selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.basePrice || 0);
    }, 0);

    const complexityMult = complexityMultipliers[complexity as keyof typeof complexityMultipliers];
    const timelineMult = timelineMultipliers[timeline as keyof typeof timelineMultipliers];

    return Math.round(baseTotal * complexityMult * timelineMult);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">AI Price Estimator</h3>
      </div>

      <div className="space-y-6">
        {/* Services Selection */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Select Services:</h4>
          <div className="space-y-2">
            {services.map(service => (
              <label key={service.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => toggleService(service.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{service.name}</span>
                <span className="text-xs text-gray-500">(${service.basePrice})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Complexity */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Project Complexity:</h4>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="simple">Simple (-20%)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="complex">Complex (+50%)</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Timeline:</h4>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rush">Rush (1-2 weeks) (+50%)</option>
            <option value="standard">Standard (3-4 weeks)</option>
            <option value="flexible">Flexible (5+ weeks) (-10%)</option>
          </select>
        </div>

        {/* Estimate Result */}
        {selectedServices.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Estimated Price:</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              ${calculateEstimate().toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              *This is an estimate. Final price may vary based on specific requirements.
            </p>
          </div>
        )}

        {selectedServices.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            Select services to see estimate
          </div>
        )}
      </div>
    </div>
  );
};

export default AiEstimatedCalculator;