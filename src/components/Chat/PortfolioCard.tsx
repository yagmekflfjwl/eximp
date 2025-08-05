import React from 'react';
import { Building2, Mail, Phone, ExternalLink, MapPin, Calendar, Tag } from 'lucide-react';
import { Customer } from '../../types';

interface PortfolioCardProps {
  customer: Customer;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ customer }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
              {customer.companyName}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Tag className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                {customer.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <Mail size={14} />
          <span className="truncate">{customer.contactEmail}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <Phone size={14} />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <ExternalLink size={14} className="text-gray-400" />
          <a
            href={`https://${customer.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate"
          >
            {customer.website}
          </a>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin size={14} />
          <span className="truncate">{customer.region}, {customer.country}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>Eklendi: {new Date(customer.addedDate).toLocaleDateString()}</span>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            Portföyde
          </span>
        </div>
      </div>
    </div>
  );
};