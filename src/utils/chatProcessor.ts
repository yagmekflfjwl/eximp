import { MarketData, Customer, EmailTemplate, ChatCommand } from '../types';
import { marketData } from '../data/marketData';

export class ChatProcessor {
  private customers: Customer[];
  private emailTemplates: EmailTemplate[];
  private currentLanguage: 'tr' | 'en' | 'de' | 'fr';

  constructor(
    customers: Customer[], 
    emailTemplates: EmailTemplate[], 
    currentLanguage: 'tr' | 'en' | 'de' | 'fr'
  ) {
    this.customers = customers;
    this.emailTemplates = emailTemplates;
    this.currentLanguage = currentLanguage;
  }

  processCommand(input: string): ChatCommand {
    const lowerInput = input.toLowerCase();

    // Search commands
    if (this.isSearchCommand(lowerInput)) {
      return { type: 'search', params: { query: input } };
    }

    // Portfolio commands
    if (this.isAddPortfolioCommand(lowerInput)) {
      const companyName = this.extractCompanyName(input, 'add');
      return { type: 'add_portfolio', params: { companyName } };
    }

    if (this.isRemovePortfolioCommand(lowerInput)) {
      const companyName = this.extractCompanyName(input, 'remove');
      return { type: 'remove_portfolio', params: { companyName } };
    }

    if (this.isViewPortfolioCommand(lowerInput)) {
      return { type: 'view_portfolio' };
    }

    // Email commands
    if (this.isCreateEmailCommand(lowerInput)) {
      const companyName = this.extractCompanyName(input, 'email');
      const language = this.extractLanguage(input);
      return { type: 'create_email', params: { companyName, language } };
    }

    if (this.isSendEmailCommand(lowerInput)) {
      const companyName = this.extractCompanyName(input, 'send');
      return { type: 'send_email', params: { companyName } };
    }

    return { type: 'help' };
  }

  private isSearchCommand(input: string): boolean {
    const searchKeywords = {
      tr: ['göster', 'bul', 'ara', 'listele', 'tedarikçi', 'firma', 'şirket'],
      en: ['show', 'find', 'search', 'list', 'supplier', 'company', 'companies'],
      de: ['zeige', 'finde', 'suche', 'liste', 'lieferant', 'unternehmen', 'firma'],
      fr: ['montrer', 'trouver', 'chercher', 'lister', 'fournisseur', 'entreprise', 'société']
    };

    return searchKeywords[this.currentLanguage].some(keyword => 
      input.includes(keyword)
    );
  }

  private isAddPortfolioCommand(input: string): boolean {
    const addKeywords = {
      tr: ['ekle', 'portföy', 'portföyme', 'kaydet'],
      en: ['add', 'portfolio', 'save'],
      de: ['hinzufügen', 'portfolio', 'speichern'],
      fr: ['ajouter', 'portfolio', 'sauvegarder']
    };

    return addKeywords[this.currentLanguage].some(keyword => 
      input.includes(keyword)
    );
  }

  private isRemovePortfolioCommand(input: string): boolean {
    const removeKeywords = {
      tr: ['çıkar', 'kaldır', 'sil', 'portföyden'],
      en: ['remove', 'delete', 'from portfolio'],
      de: ['entfernen', 'löschen', 'aus portfolio'],
      fr: ['retirer', 'supprimer', 'du portfolio']
    };

    return removeKeywords[this.currentLanguage].some(keyword => 
      input.includes(keyword)
    );
  }

  private isViewPortfolioCommand(input: string): boolean {
    const viewKeywords = {
      tr: ['portföy', 'portföyüm', 'müşteriler'],
      en: ['portfolio', 'my portfolio', 'customers'],
      de: ['portfolio', 'mein portfolio', 'kunden'],
      fr: ['portfolio', 'mon portfolio', 'clients']
    };

    return viewKeywords[this.currentLanguage].some(keyword => 
      input.includes(keyword)
    ) && !this.isAddPortfolioCommand(input) && !this.isRemovePortfolioCommand(input);
  }

  private isCreateEmailCommand(input: string): boolean {
    const emailKeywords = {
      tr: ['mail', 'e-mail', 'email', 'hazırla', 'oluştur', 'yaz'],
      en: ['email', 'mail', 'create', 'prepare', 'write'],
      de: ['email', 'e-mail', 'mail', 'erstellen', 'vorbereiten', 'schreiben'],
      fr: ['email', 'mail', 'créer', 'préparer', 'écrire']
    };

    return emailKeywords[this.currentLanguage].some(keyword => 
      input.includes(keyword)
    ) && !this.isSendEmailCommand(input);
  }

  private isSendEmailCommand(input: string): boolean {
    const sendKeywords = {
      tr: ['gönder', 'yolla'],
      en: ['send'],
      de: ['senden', 'schicken'],
      fr: ['envoyer']
    };

    return sendKeywords[this.currentLanguage].some(keyword => 
      input.includes(keyword)
    );
  }

  private extractCompanyName(input: string, commandType: string): string {
    // Simple extraction - in real app, use NLP
    const words = input.split(' ');
    
    // Look for company names in market data
    for (const company of marketData) {
      if (input.toLowerCase().includes(company.companyName.toLowerCase())) {
        return company.companyName;
      }
    }

    // Look for company names in portfolio
    for (const customer of this.customers) {
      if (input.toLowerCase().includes(customer.companyName.toLowerCase())) {
        return customer.companyName;
      }
    }

    return '';
  }

  private extractLanguage(input: string): 'tr' | 'en' | 'de' | 'fr' {
    const languageKeywords = {
      tr: ['türkçe', 'turkish'],
      en: ['english', 'ingilizce', 'englisch', 'anglais'],
      de: ['deutsch', 'german', 'almanca', 'allemand'],
      fr: ['français', 'french', 'fransızca', 'französisch']
    };

    for (const [lang, keywords] of Object.entries(languageKeywords)) {
      if (keywords.some(keyword => input.toLowerCase().includes(keyword))) {
        return lang as 'tr' | 'en' | 'de' | 'fr';
      }
    }

    return this.currentLanguage;
  }

  searchMarketData(query: string): MarketData[] {
    const lowerQuery = query.toLowerCase();
    return marketData.filter(item => 
      item.companyName.toLowerCase().includes(lowerQuery) ||
      item.productCategory.toLowerCase().includes(lowerQuery) ||
      item.country.toLowerCase().includes(lowerQuery) ||
      item.region.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.buyerCompany.toLowerCase().includes(lowerQuery) ||
      item.sellerCompany.toLowerCase().includes(lowerQuery)
    );
  }

  generateEmailContent(companyName: string, language: 'tr' | 'en' | 'de' | 'fr'): { subject: string; content: string } {
    const company = marketData.find(c => c.companyName === companyName) ||
                   this.customers.find(c => c.companyName === companyName);

    const templates = {
      tr: {
        subject: `İş Birliği Teklifi - ${companyName}`,
        content: `Sayın ${companyName} Yetkilileri,

Firmamız, ${company?.category || 'sektörünüzde'} alanında faaliyet gösteren güvenilir bir iş ortağı olarak, sizinle iş birliği fırsatlarını değerlendirmek istiyoruz.

${company?.country || 'Bölgenizdeki'} pazardaki deneyimimiz ve kaliteli hizmet anlayışımız ile birlikte, karşılıklı faydalı bir iş birliği kurabileceğimize inanıyoruz.

Detayları görüşmek üzere size uygun bir zaman ayarlamak isteriz.

Saygılarımızla,
Eximp.ai İş Geliştirme Ekibi

İletişim: info@eximp.ai
Web: www.eximp.ai`
      },
      en: {
        subject: `Business Partnership Proposal - ${companyName}`,
        content: `Dear ${companyName} Team,

As a reliable business partner operating in ${company?.category || 'your industry'}, we would like to explore collaboration opportunities with your company.

With our experience in the ${company?.country || 'regional'} market and commitment to quality service, we believe we can establish a mutually beneficial partnership.

We would like to schedule a convenient time to discuss the details.

Best regards,
Eximp.ai Business Development Team

Contact: info@eximp.ai
Web: www.eximp.ai`
      },
      de: {
        subject: `Geschäftspartnerschaftsvorschlag - ${companyName}`,
        content: `Sehr geehrtes ${companyName} Team,

Als zuverlässiger Geschäftspartner im Bereich ${company?.category || 'Ihrer Branche'} möchten wir Kooperationsmöglichkeiten mit Ihrem Unternehmen erkunden.

Mit unserer Erfahrung auf dem ${company?.country || 'regionalen'} Markt und unserem Engagement für Qualitätsservice glauben wir, dass wir eine für beide Seiten vorteilhafte Partnerschaft aufbauen können.

Wir möchten gerne einen passenden Termin vereinbaren, um die Details zu besprechen.

Mit freundlichen Grüßen,
Eximp.ai Business Development Team

Kontakt: info@eximp.ai
Web: www.eximp.ai`
      },
      fr: {
        subject: `Proposition de Partenariat Commercial - ${companyName}`,
        content: `Cher équipe ${companyName},

En tant que partenaire commercial fiable opérant dans ${company?.category || 'votre secteur'}, nous aimerions explorer les opportunités de collaboration avec votre entreprise.

Avec notre expérience sur le marché ${company?.country || 'régional'} et notre engagement envers un service de qualité, nous croyons pouvoir établir un partenariat mutuellement bénéfique.

Nous aimerions programmer un moment convenable pour discuter des détails.

Cordialement,
Équipe de Développement Commercial Eximp.ai

Contact: info@eximp.ai
Web: www.eximp.ai`
      }
    };

    return templates[language];
  }
}