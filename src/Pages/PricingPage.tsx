
import React from 'react';

const PricingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

        {/* Free Plan */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-4">Free</h2>
          <p className="text-5xl font-extrabold mb-6">$0<span className="text-lg font-medium">/month</span></p>
          <ul className="text-lg space-y-4 mb-8">
            <li>✅ Access to core features</li>
            <li>✅ Community support</li>
            <li>❌ AI Proofreader</li>
            <li>❌ Advanced Analytics</li>
            <li>❌ Priority Support</li>
          </ul>
          <button className="w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-md font-bold text-lg cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-black relative">
          <div className="absolute top-0 -translate-y-1/2 bg-black text-white px-4 py-1 rounded-full text-sm font-bold">POPULAR</div>
          <h2 className="text-3xl font-bold mb-4">Pro</h2>
          <p className="text-5xl font-extrabold mb-6">$15<span className="text-lg font-medium">/month</span></p>
          <ul className="text-lg space-y-4 mb-8">
            <li>✅ Access to core features</li>
            <li>✅ Community support</li>
            <li>✅ AI Proofreader</li>
            <li>✅ Advanced Analytics</li>
            <li>✅ Priority Support</li>
          </ul>
          <button className="w-full bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-bold text-lg">
            Upgrade to Pro
          </button>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;
