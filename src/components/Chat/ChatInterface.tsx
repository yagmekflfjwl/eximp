import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../utils/translations';
import { ChatProcessor } from '../../utils/chatProcessor';
import { MarketCard } from './MarketCard';
import { PortfolioCard } from './PortfolioCard';
import { EmailPreview } from './EmailPreview';

export const ChatInterface: React.FC = () => {
  const { 
    chatMessages, 
    addChatMessage, 
    customers, 
    addCustomer, 
    removeCustomer,
    emailTemplates,
    addEmailTemplate,
    currentLanguage 
  } = useApp();
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<{ subject: string; content: string; companyName: string; language: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[currentLanguage];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    // Welcome message
    if (chatMessages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'bot' as const,
        content: t.welcomeMessage,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(welcomeMessage);
    }
  }, [currentLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Process command
    const processor = new ChatProcessor(customers, emailTemplates, currentLanguage);
    const command = processor.processCommand(inputValue);

    setTimeout(() => {
      let botMessage;

      switch (command.type) {
        case 'search':
          const results = processor.searchMarketData(command.params.query);
          botMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot' as const,
            content: results.length > 0 
              ? `${results.length} sonuç bulundu. İstediğiniz firmayı portföyünüze eklemek için "X firmasını portföyme ekle" diyebilirsiniz.`
              : t.noResults,
            timestamp: new Date().toISOString(),
            data: results,
            action: 'search'
          };
          break;

        case 'add_portfolio':
          const companyToAdd = processor.searchMarketData(command.params.companyName)[0];
          if (companyToAdd && !customers.find(c => c.id === companyToAdd.id)) {
            const customer = {
              id: companyToAdd.id,
              companyName: companyToAdd.companyName,
              contactEmail: companyToAdd.contactEmail,
              website: companyToAdd.website,
              phone: companyToAdd.phone,
              address: companyToAdd.address,
              country: companyToAdd.country,
              region: companyToAdd.region,
              language: companyToAdd.language,
              addedDate: new Date().toISOString(),
              notes: companyToAdd.description,
              category: companyToAdd.productCategory,
            };
            addCustomer(customer);
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: `✅ ${companyToAdd.companyName} başarıyla portföyünüze eklendi! Şimdi bu firmaya mail hazırlamak için "${companyToAdd.companyName}'ye tanıtım maili hazırla" diyebilirsiniz.`,
              timestamp: new Date().toISOString(),
              action: 'add_portfolio'
            };
          } else {
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: command.params.companyName 
                ? `❌ ${command.params.companyName} bulunamadı veya zaten portföyünüzde.`
                : '❌ Hangi firmayı eklemek istediğinizi belirtmediniz.',
              timestamp: new Date().toISOString(),
            };
          }
          break;

        case 'remove_portfolio':
          const customerToRemove = customers.find(c => 
            c.companyName.toLowerCase().includes(command.params.companyName.toLowerCase())
          );
          if (customerToRemove) {
            removeCustomer(customerToRemove.id);
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: `✅ ${customerToRemove.companyName} portföyünüzden kaldırıldı.`,
              timestamp: new Date().toISOString(),
              action: 'remove_portfolio'
            };
          } else {
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: '❌ Belirtilen firma portföyünüzde bulunamadı.',
              timestamp: new Date().toISOString(),
            };
          }
          break;

        case 'view_portfolio':
          botMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot' as const,
            content: customers.length > 0 
              ? `📁 Portföyünüzde ${customers.length} firma bulunuyor:`
              : '📁 Portföyünüz henüz boş. Pazar araması yaparak firma ekleyebilirsiniz.',
            timestamp: new Date().toISOString(),
            action: 'view_portfolio'
          };
          break;

        case 'create_email':
          const targetCompany = customers.find(c => 
            c.companyName.toLowerCase().includes(command.params.companyName.toLowerCase())
          );
          if (targetCompany) {
            const emailContent = processor.generateEmailContent(
              targetCompany.companyName, 
              command.params.language || currentLanguage
            );
            setCurrentEmail({
              ...emailContent,
              companyName: targetCompany.companyName,
              language: command.params.language || currentLanguage
            });
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: `✉️ ${targetCompany.companyName} için ${command.params.language || currentLanguage} dilinde mail hazırlandı. Göndermek için "Hazırladığın maili ${targetCompany.companyName}'ye gönder" diyebilirsiniz.`,
              timestamp: new Date().toISOString(),
              action: 'create_email'
            };
          } else {
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: '❌ Belirtilen firma portföyünüzde bulunamadı. Önce firmayı portföyünüze ekleyin.',
              timestamp: new Date().toISOString(),
            };
          }
          break;

        case 'send_email':
          if (currentEmail) {
            const template = {
              id: Date.now().toString(),
              customerId: customers.find(c => c.companyName === currentEmail.companyName)?.id || '',
              subject: currentEmail.subject,
              content: currentEmail.content,
              language: currentEmail.language as 'tr' | 'en' | 'de' | 'fr',
              createdDate: new Date().toISOString(),
              status: 'sent' as const
            };
            addEmailTemplate(template);
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: `🚀 Mail başarıyla ${currentEmail.companyName}'ye gönderildi!`,
              timestamp: new Date().toISOString(),
              action: 'send_email'
            };
            setCurrentEmail(null);
          } else {
            botMessage = {
              id: (Date.now() + 1).toString(),
              type: 'bot' as const,
              content: '❌ Gönderilecek hazır mail bulunamadı. Önce bir mail hazırlayın.',
              timestamp: new Date().toISOString(),
            };
          }
          break;

        default:
          botMessage = {
            id: (Date.now() + 1).toString(),
            type: 'bot' as const,
            content: `❓ Komutunuzu anlayamadım. İşte yapabilecekleriniz:\n\n${t.helpCommands}`,
            timestamp: new Date().toISOString(),
            action: 'help'
          };
      }

      addChatMessage(botMessage);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.appTitle}
              </h1>
              <p className="text-sm text-gray-600">{t.appSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {chatMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}>
                {message.type === 'user' ? (
                  <User size={18} className="text-white" />
                ) : (
                  <Bot size={18} className="text-white" />
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className={`rounded-2xl px-6 py-4 max-w-3xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto'
                    : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm border border-gray-200/50'
                }`}>
                  <div className="whitespace-pre-line">{message.content}</div>
                </div>

                {/* Market Data Results */}
                {message.data && message.data.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    {message.data.map((item) => (
                      <MarketCard key={item.id} data={item} />
                    ))}
                  </div>
                )}

                {/* Portfolio View */}
                {message.action === 'view_portfolio' && customers.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                    {customers.map((customer) => (
                      <PortfolioCard key={customer.id} customer={customer} />
                    ))}
                  </div>
                )}

                {/* Email Preview */}
                {message.action === 'create_email' && currentEmail && (
                  <EmailPreview email={currentEmail} />
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-sm border border-gray-200/50">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent shadow-sm"
              />
              <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl px-6 py-4 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};