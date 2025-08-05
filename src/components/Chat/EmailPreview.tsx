import React from 'react';
import { Mail, Globe, FileText } from 'lucide-react';

interface EmailPreviewProps {
  email: {
    subject: string;
    content: string;
    companyName: string;
    language: string;
  };
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ email }) => {
  const languageNames = {
    tr: 'Türkçe',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français'
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Mail Önizleme</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>{languageNames[email.language as keyof typeof languageNames]}</span>
            <span>•</span>
            <span>{email.companyName}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konu:
          </label>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="font-medium text-gray-900">{email.subject}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>İçerik:</span>
          </label>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {email.content}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 Bu maili göndermek için "Hazırladığın maili {email.companyName}'ye gönder" yazın.
        </p>
      </div>
    </div>
  );
};