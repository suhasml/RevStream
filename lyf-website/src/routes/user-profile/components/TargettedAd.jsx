import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';

const TargetedAd = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 shadow-sm border border-blue-100 mb-6">
      <div className="flex items-start space-x-4">
        <div className="rounded-full bg-blue-100 p-2">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-blue-900">
            Traveling for work? Try WeWork
          </h3>
          <p className="text-sm text-blue-600 mt-1">
            Get 25% off on your first month at any WeWork location worldwide
          </p>
          <button className="mt-3 inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800">
            Learn more
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetedAd;