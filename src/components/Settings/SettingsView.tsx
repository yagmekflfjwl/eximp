import React from 'react';
import { Settings, Globe, Database, Shield, Bell } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../utils/translations';

export const SettingsView: React.FC = () => {
  const { currentLanguage, setCurrentLanguage } = useApp();
  const t = translations[currentLanguage];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.settings}
        </h2>
        <p className="text-gray-600">
          Uygulama ayarlarınızı yönetin.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="text-blue-500" size={24} />
            <h3 className="text-lg font-semibold">Dil Ayarları</h3>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arayüz Dili
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="text-green-500" size={24} />
            <h3 className="text-lg font-semibold">Veri Yönetimi</h3>
          </div>
          <div className="space-y-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Verileri Dışa Aktar
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Tüm Verileri Sil
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="text-yellow-500" size={24} />
            <h3 className="text-lg font-semibold">Bildirimler</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Yeni müşteri bildirimleri</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Mail gönderim bildirimleri</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-purple-500" size={24} />
            <h3 className="text-lg font-semibold">Güvenlik</h3>
          </div>
          <div className="space-y-4">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              Şifre Değiştir
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              İki Faktörlü Doğrulama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};