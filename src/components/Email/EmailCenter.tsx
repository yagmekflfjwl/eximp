import React, { useState } from 'react';
import { Mail, Send, User, Globe } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../utils/translations';
import { EmailTemplate } from '../../types';

export const EmailCenter: React.FC = () => {
  const { customers, emailTemplates, addEmailTemplate, currentLanguage } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [emailLanguage, setEmailLanguage] = useState<'tr' | 'en' | 'de' | 'fr'>('tr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const t = translations[currentLanguage];

  const generateEmailContent = async () => {
    if (!selectedCustomer) return;

    setIsGenerating(true);
    const customer = customers.find(c => c.id === selectedCustomer);
    
    // Simulate AI email generation
    setTimeout(() => {
      const templates = {
        tr: {
          subject: 'İş Birliği Teklifi - Kaliteli Çözümler',
          content: `Merhaba,

${customer?.companyName} ile iş birliği fırsatları hakkında görüşmek istiyoruz.

Firmamız ${customer?.category} alanında uzmanlaşmış olup, kaliteli çözümler sunmaktayız. ${customer?.country} pazarındaki deneyimimiz ile birlikte, karşılıklı faydalı bir iş birliği kurabileceğimize inanıyoruz.

Detayları görüşmek üzere size uygun bir zaman ayarlamak isteriz.

Saygılarımızla,
İş Geliştirme Ekibi`
        },
        en: {
          subject: 'Business Partnership Proposal - Quality Solutions',
          content: `Hello,

We would like to discuss business collaboration opportunities with ${customer?.companyName}.

Our company specializes in ${customer?.category} and offers quality solutions. With our experience in the ${customer?.country} market, we believe we can establish a mutually beneficial partnership.

We would like to schedule a convenient time to discuss the details.

Best regards,
Business Development Team`
        },
        de: {
          subject: 'Geschäftspartnerschaftsvorschlag - Qualitätslösungen',
          content: `Hallo,

Wir möchten Geschäftskooperationsmöglichkeiten mit ${customer?.companyName} besprechen.

Unser Unternehmen ist auf ${customer?.category} spezialisiert und bietet Qualitätslösungen. Mit unserer Erfahrung auf dem ${customer?.country}-Markt glauben wir, dass wir eine für beide Seiten vorteilhafte Partnerschaft aufbauen können.

Wir möchten gerne einen passenden Termin vereinbaren, um die Details zu besprechen.

Mit freundlichen Grüßen,
Business Development Team`
        },
        fr: {
          subject: 'Proposition de Partenariat Commercial - Solutions de Qualité',
          content: `Bonjour,

Nous aimerions discuter des opportunités de collaboration commerciale avec ${customer?.companyName}.

Notre entreprise est spécialisée dans ${customer?.category} et offre des solutions de qualité. Avec notre expérience sur le marché ${customer?.country}, nous croyons pouvoir établir un partenariat mutuellement bénéfique.

Nous aimerions programmer un moment convenable pour discuter des détails.

Cordialement,
Équipe de Développement Commercial`
        }
      };
      
      const template = templates[emailLanguage];
      setEmailSubject(template.subject);
      setEmailContent(template.content);
      setIsGenerating(false);
    }, 2000);
  };

  const sendEmail = async () => {
    if (!selectedCustomer || !emailSubject || !emailContent) return;

    setIsSending(true);
    
    // Simulate email sending
    setTimeout(() => {
      const template: EmailTemplate = {
        id: Date.now().toString(),
        customerId: selectedCustomer,
        subject: emailSubject,
        content: emailContent,
        language: emailLanguage,
        createdDate: new Date().toISOString(),
      };
      
      addEmailTemplate(template);
      
      // Reset form
      setSelectedCustomer('');
      setEmailSubject('');
      setEmailContent('');
      setIsSending(false);
      
      alert(t.emailSent);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t.emailCenter}
        </h2>
        <p className="text-gray-600">
          Portföyünüzdeki firmalar için otomatik mail hazırlayın ve gönderin.
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <Mail size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Henüz portföyünüzde firma yok
          </h3>
          <p className="text-gray-500">
            Mail göndermek için önce portföyünüze firma ekleyin.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Yeni Mail Oluştur</h3>
            
            <div className="grid gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firma Seçin
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Firma seçin...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.companyName} - {customer.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mail Dili
                </label>
                <select
                  value={emailLanguage}
                  onChange={(e) => setEmailLanguage(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <button
                onClick={generateEmailContent}
                disabled={!selectedCustomer || isGenerating}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Globe size={18} />
                <span>{isGenerating ? 'Mail hazırlanıyor...' : t.generateEmail}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konu
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mail konusu..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İçerik
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={12}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mail içeriği..."
                />
              </div>

              <button
                onClick={sendEmail}
                disabled={!selectedCustomer || !emailSubject || !emailContent || isSending}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send size={18} />
                <span>{isSending ? 'Gönderiliyor...' : t.sendEmail}</span>
              </button>
            </div>
          </div>

          {emailTemplates.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Gönderilen Mailler</h3>
              <div className="space-y-4">
                {emailTemplates.map((template) => {
                  const customer = customers.find(c => c.id === template.customerId);
                  return (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{template.subject}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(template.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <User size={14} className="inline mr-1" />
                        {customer?.companyName}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};