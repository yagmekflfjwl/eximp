export interface MarketData {
  id: string;
  companyName: string;
  buyerCompany: string;
  sellerCompany: string;
  productCategory: string;
  price: number;
  currency: string;
  quantity: number;
  country: string;
  region: string;
  contactEmail: string;
  website: string;
  phone: string;
  address: string;
  description: string;
  date: string;
  language: 'tr' | 'en' | 'de' | 'fr';
}

export interface Customer {
  id: string;
  companyName: string;
  contactEmail: string;
  website: string;
  phone: string;
  address: string;
  country: string;
  region: string;
  language: 'tr' | 'en' | 'de' | 'fr';
  addedDate: string;
  notes: string;
  category: string;
}

export interface EmailTemplate {
  id: string;
  customerId: string;
  subject: string;
  content: string;
  language: 'tr' | 'en' | 'de' | 'fr';
  createdDate: string;
  status: 'draft' | 'sent';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  data?: MarketData[];
  action?: 'search' | 'add_portfolio' | 'create_email' | 'send_email' | 'view_portfolio' | 'remove_portfolio';
  metadata?: any;
}

export interface ChatCommand {
  type: 'search' | 'add_portfolio' | 'create_email' | 'send_email' | 'view_portfolio' | 'remove_portfolio' | 'help';
  params?: any;
}