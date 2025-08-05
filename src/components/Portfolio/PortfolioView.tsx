import React from 'react';
import { Building2, Trash2, Mail, ExternalLink, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../utils/translations';

export const PortfolioView: React.FC = () => {
  const { customers, removeCustomer, currentLanguage } = useApp();
  const t = translations[currentLanguage];

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Building2 size={64} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Portföyünüz boş
        </h3>
        <p className="text-gray-500">
          Market sohbetinde bulduğunuz firmaları portföyünüze ekleyin.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.portfolio}
        </h2>
        <p className="text-gray-600">
          {customers.length} firma portföyünüzde
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {customer.companyName}
                </h3>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {customer.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {/* TODO: Implement email creation */}}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title={t.createEmail}
                >
                  <Mail size={18} />
                </button>
                <button
                  onClick={() => removeCustomer(customer.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title={t.removeFromPortfolio}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail size={14} />
                <span>{customer.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ExternalLink size={14} />
                <a
                  href={`https://${customer.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {customer.website}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin size={14} />
                <span className="line-clamp-1">{customer.address}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Eklenme:</span>
                <span className="text-gray-700">
                  {new Date(customer.addedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};