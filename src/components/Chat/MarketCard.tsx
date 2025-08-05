import React from 'react';
import { Plus, ExternalLink, Phone, Mail, MapPin, Building2, DollarSign, Package } from 'lucide-react';
import { MarketData } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../utils/translations';

interface MarketCardProps {
  data: MarketData;
}

export const MarketCard: React.FC<MarketCardProps> = ({ data }) => {
  const { customers, currentLanguage } = useApp();
  const t = translations[currentLanguage];

  const isInPortfolio = customers.some(c => c.id === data.id);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {data.companyName}
            </h3>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50">
            {data.productCategory}
          </span>
        </div>
        <div className={`p-2 rounded-xl transition-all duration-200 ${
          isInPortfolio
            ? 'bg-green-100 text-green-600 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 hover:scale-110'
        }`}>
          <Plus size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-xs text-gray-500">{t.price}</p>
            <p className="font-semibold text-gray-900">
              {data.price.toLocaleString()} {data.currency}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-orange-600" />
          <div>
            <p className="text-xs text-gray-500">{t.quantity}</p>
            <p className="font-semibold text-gray-900">{data.quantity}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-4 h-4 text-red-500" />
        <span className="text-sm font-medium text-gray-700">
          {data.region}, {data.country}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
        {data.description}
      </p>

      <div className="space-y-2 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <Mail size={14} />
          <span className="truncate">{data.contactEmail}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
          <Phone size={14} />
          <span>{data.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <ExternalLink size={14} className="text-gray-400" />
          <a
            href={`https://${data.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate"
          >
            {data.website}
          </a>
        </div>
      </div>
    </div>
  );
};