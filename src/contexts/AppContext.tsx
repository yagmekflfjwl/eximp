import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, ChatMessage, EmailTemplate } from '../types';

interface AppContextType {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  removeCustomer: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  emailTemplates: EmailTemplate[];
  addEmailTemplate: (template: EmailTemplate) => void;
  currentLanguage: 'tr' | 'en' | 'de' | 'fr';
  setCurrentLanguage: (lang: 'tr' | 'en' | 'de' | 'fr') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<'tr' | 'en' | 'de' | 'fr'>('tr');

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const removeCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const addEmailTemplate = (template: EmailTemplate) => {
    setEmailTemplates(prev => [...prev, template]);
  };

  return (
    <AppContext.Provider value={{
      customers,
      addCustomer,
      removeCustomer,
      chatMessages,
      addChatMessage,
      clearChat,
      emailTemplates,
      addEmailTemplate,
      currentLanguage,
      setCurrentLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};