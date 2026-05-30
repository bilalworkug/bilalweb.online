import { Injectable, signal } from '@angular/core';

export interface Project {
  id: string;
  name: string;
  type: string;
  businessType?: string; // fallback
  icon: string;
  emoji?: string; // fallback
  demoUrl: string;
  description: string;
  visible: boolean;
  dateAdded?: string;
  features?: string[];
  image?: string;
}

export interface Package {
  id: string;
  name: string;
  icon: string;
  emoji?: string; // fallback
  price: string;
  delivery: string;
  deliveryTime?: string; // fallback
  description: string;
  features: string[];
  freeDomainHosting: boolean;
  includingDomainHosting?: boolean; // fallback
  mostPopular: boolean;
  isMostPopular?: boolean; // fallback
  active: boolean;
  dateAdded?: string;
}

export interface Settings {
  businessName: string;
  displayName: string;
  whatsapp: string;
  domain: string;
}

export interface Activity {
  action: string;
  details: string;
  timestamp: string;
}

export interface Subscriber {
  email: string;
  dateSubscribed: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataState {
  // Configured Signals
  businessName = signal<string>('Bilal Web');
  displayName = signal<string>('Bilal');
  whatsappNumber = signal<string>('+256749445501');
  domainName = signal<string>('bilalweb.online');

  adminEmail = signal<string>('bilal@bilalweb.online');
  adminPassword = signal<string>('Bilal2025!');

  projects = signal<Project[]>([]);
  packages = signal<Package[]>([]);
  activityFeed = signal<Activity[]>([]);
  whatsappClicks = signal<number>(0);
  newsletterSubscribers = signal<Subscriber[]>([]);

  // Mappings between emojis and modern SVG icons
  private emojiToIconMap: Record<string, string> = {
    '☕': 'icon-coffee',
    '💈': 'icon-barber',
    '👗': 'icon-fashion',
    '🏠': 'icon-page',
    '🏢': 'icon-building',
    '🛒': 'icon-cart',
    '💻': 'icon-folder',
    '💼': 'icon-package'
  };

  private iconToEmojiMap: Record<string, string> = {
    'icon-coffee': '☕',
    'icon-barber': '💈',
    'icon-fashion': '👗',
    'icon-page': '🏠',
    'icon-building': '🏢',
    'icon-cart': '🛒',
    'icon-folder': '💻',
    'icon-package': '💼',
    'icon-bag': '🛍️',
    'icon-refresh': '🔄',
    'icon-wrench': '🔧',
    'icon-star': '⭐',
    'icon-location': '📍',
    'icon-lightning': '⚡',
    'icon-link': '🔗',
    'icon-whatsapp': '💬',
    'icon-info': 'ℹ️'
  };

  // Modern defaults aligned with the specs
  private defaultProjects: Project[] = [
    {
      id: 'coffee',
      name: 'Kampala Fresh Coffee',
      type: 'Coffee Shop Website',
      businessType: 'Coffee Shop Website',
      icon: 'icon-coffee',
      emoji: '☕',
      demoUrl: '/portfolio/coffee',
      description: 'Warm and inviting website for a local Kampala coffee shop.',
      visible: true,
      image: '',
      dateAdded: '2026-05-29T12:00:00.000Z'
    },
    {
      id: 'barber',
      name: 'StyleHub Barber',
      type: 'Barber Shop Website',
      businessType: 'Barber Shop Website',
      icon: 'icon-barber',
      emoji: '💈',
      demoUrl: '/portfolio/barber',
      description: 'Modern, bold design for a Kampala barber shop.',
      visible: true,
      image: '',
      dateAdded: '2026-05-29T12:00:00.000Z'
    },
    {
      id: 'fashion',
      name: 'Kampala Fashion Hub',
      type: 'Fashion Boutique Website',
      businessType: 'Fashion Boutique Website',
      icon: 'icon-fashion',
      emoji: '👗',
      demoUrl: '/portfolio/fashion',
      description: 'Clean, elegant website for a fashion boutique.',
      visible: true,
      image: '',
      dateAdded: '2026-05-29T12:00:00.000Z'
    },
    {
      id: 'furniture-3d',
      name: 'Lugogo 3D Furniture Studio',
      type: '3D Web Configurator',
      businessType: '3D Web Configurator',
      icon: 'icon-wrench',
      emoji: '🛋️',
      demoUrl: '/portfolio/furniture-3d',
      description: 'An interactive 3D showroom website for a bespoke furniture studio in Lugogo, Kampala. Allows live color, material, and structural customization directly in the browser with fast mobile loading times and offline optimization.',
      visible: true,
      image: '',
      dateAdded: '2026-05-30T09:00:00.000Z',
      features: [
        'Live 3D viewport canvas with pure CSS projection styling',
        '3D rotating perspective frame (drag, rotate, or automatic spin)',
        'Live material swapper (Kampala Mahogany, Mabira Oak, Ebony, Forest Green Velvet, Terracotta Linen, Savannah Leather)',
        'Adaptive pricing calculator in VGX/UGX (Optional metallic studded accents)',
        'Direct WhatsApp quotation compiler with custom order tags'
      ]
    }
  ];

  private defaultPackages: Package[] = [
    {
      id: 'starter',
      name: 'Starter Package',
      icon: 'icon-page',
      emoji: '🏠',
      description: 'Perfect for startups and small shops just getting online',
      price: '500000',
      delivery: '3-5 Days',
      deliveryTime: '3-5 Days',
      features: [
        '1 Page (Home + Contact)',
        'Mobile-Friendly Design',
        'WhatsApp Button',
        'Free Domain (1 Year)',
        'Free Hosting (1 Year)',
        '3-5 Days Delivery',
        '❌ No admin panel: Bilal handles updates for you'
      ],
      freeDomainHosting: true,
      includingDomainHosting: true,
      mostPopular: false,
      isMostPopular: false,
      active: true,
      dateAdded: '2026-05-29T12:00:00.000Z'
    },
    {
      id: 'business',
      name: 'Business Package',
      icon: 'icon-building',
      emoji: '🏢',
      description: 'Perfect for established businesses wanting full control',
      price: '1200000',
      delivery: '7-10 Days',
      deliveryTime: '7-10 Days',
      features: [
        '5 Pages (Home, About, Services, Gallery, Contact)',
        'Contact Form',
        'Google Map Integration',
        'Social Media Links',
        'Basic SEO Setup',
        'Admin Dashboard: edit text, images, gallery, and services yourself',
        '7-10 Days Delivery'
      ],
      freeDomainHosting: true,
      includingDomainHosting: true,
      mostPopular: true,
      isMostPopular: true,
      active: true,
      dateAdded: '2026-05-29T12:00:00.000Z'
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Package',
      icon: 'icon-cart',
      emoji: '🛒',
      description: 'Perfect for selling products online',
      price: '2500000',
      delivery: '14-21 Days',
      deliveryTime: '14-21 Days',
      features: [
        'Product Pages (Up to 20 Products)',
        'Shopping Cart',
        'Mobile Money Ready (MoMo, Airtel)',
        'Powerful Admin Dashboard: manage products, orders, customers, inventory, and sales',
        'Order Management',
        'Product Categories',
        'Sales Reports',
        '14-21 Days Delivery'
      ],
      freeDomainHosting: true,
      includingDomainHosting: true,
      mostPopular: false,
      isMostPopular: false,
      active: true,
      dateAdded: '2026-05-29T12:00:00.000Z'
    },
    {
      id: 'premium-3d',
      name: 'Premium 3D Configurator Plan',
      icon: 'icon-wrench',
      emoji: '🛋️',
      description: 'The ultimate immersive customizer. I will design a bespoke, high-fidelity, mobile-optimized interactive 3D visualizer that doubles client session lengths and skyrockets conversion rates.',
      price: '4500000',
      delivery: '14-21 Days',
      deliveryTime: '14-21 Days',
      features: [
        'Interactive 3D viewport canvas (bypasses heavy WebGL libraries)',
        '3D interactive rotation framework (supports touch pan, mouse drag, or auto-spin)',
        'Pure CSS lightning-fast rendering of layers with high performance on MTN/Airtel 3G',
        'Live material swapper (unlimited colors, wood finishes, or metadata options)',
        'Dynamic quotation compiler (recalculates pricing in UGX live)',
        'Direct WhatsApp config checkout hook for instant bookings',
        'Full administrative database controls to modify options'
      ],
      freeDomainHosting: true,
      includingDomainHosting: true,
      mostPopular: false,
      isMostPopular: false,
      active: true,
      dateAdded: '2026-05-30T10:00:00.000Z'
    }
  ];

  constructor() {
    this.initialiseState();
    this.setupGlobalClickTracker();
  }

  // Initialise database and load/migrate settings/credentials
  private initialiseState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      // 1. Admin Email
      let email = localStorage.getItem('bilalweb_admin_email');
      if (!email) {
        email = 'bilal@bilalweb.online';
        localStorage.setItem('bilalweb_admin_email', email);
      }
      this.adminEmail.set(email);

      // 2. Admin Password (migrate if legacy existed)
      let password = localStorage.getItem('bilalweb_admin_password');
      if (!password) {
        const legacyPassword = localStorage.getItem('bilal_admin_password');
        password = legacyPassword || 'Bilal2025!';
        localStorage.setItem('bilalweb_admin_password', password);
        if (legacyPassword) localStorage.removeItem('bilal_admin_password');
      }
      this.adminPassword.set(password);

      // 3. Global Settings Map
      const settingsStr = localStorage.getItem('bilalweb_settings');
      let settings: Settings;
      if (settingsStr) {
        try {
          settings = JSON.parse(settingsStr);
        } catch {
          settings = this.createDefaultSettings();
        }
      } else {
        // Fallback or migrate from legacy
        settings = this.createDefaultSettings();
        const legacyBiz = localStorage.getItem('bilal_business_name');
        const legacyWa = localStorage.getItem('bilal_whatsapp');
        if (legacyBiz) settings.businessName = legacyBiz;
        if (legacyWa) settings.whatsapp = legacyWa;

        localStorage.setItem('bilalweb_settings', JSON.stringify(settings));
        if (legacyBiz) localStorage.removeItem('bilal_business_name');
        if (legacyWa) localStorage.removeItem('bilal_whatsapp');
      }
      this.businessName.set(settings.businessName);
      this.displayName.set(settings.displayName || 'Bilal');
      this.whatsappNumber.set(settings.whatsapp);
      this.domainName.set(settings.domain || 'bilalweb.online');

      // 4. Projects Storage & Migration
      const projectsStr = localStorage.getItem('bilalweb_projects');
      if (!projectsStr) {
        const legacyProjects = localStorage.getItem('bilal_projects');
        if (legacyProjects) {
          try {
            const parsedOld = JSON.parse(legacyProjects) as Partial<Project>[];
            const migrated: Project[] = parsedOld.map((p) => ({
              id: p.id || '',
              name: p.name || '',
              type: p.type || p.businessType || 'Website design',
              businessType: p.businessType || p.type || 'Website design',
              icon: p.icon || this.emojiToIconMap[p.emoji || ''] || 'icon-folder',
              emoji: p.emoji || this.iconToEmojiMap[p.icon || ''] || '💻',
              demoUrl: p.demoUrl || '',
              image: p.image || '',
              description: p.description || '',
              visible: p.visible !== false,
              dateAdded: p.dateAdded || new Date().toISOString()
            }));
            this.projects.set(migrated);
            localStorage.setItem('bilalweb_projects', JSON.stringify(migrated));
            localStorage.removeItem('bilal_projects');
          } catch {
            this.projects.set(this.defaultProjects);
            this.saveProjects();
          }
        } else {
          this.projects.set(this.defaultProjects);
          this.saveProjects();
        }
      } else {
        try {
          const parsed = JSON.parse(projectsStr) as Partial<Project>[];
          // Standardise fields just in case
          const standardised: Project[] = parsed.map((p) => ({
            id: p.id || '',
            name: p.name || '',
            type: p.type || p.businessType || 'Website design',
            businessType: p.businessType || p.type || 'Website design',
            icon: p.icon || 'icon-folder',
            emoji: p.emoji || this.iconToEmojiMap[p.icon || ''] || '💻',
            demoUrl: p.demoUrl || '',
            image: p.image || '',
            description: p.description || '',
            visible: p.visible !== false,
            dateAdded: p.dateAdded || new Date().toISOString(),
            features: p.features || []
          }));
          
          // Inject 3D project configuration dynamically if missing
          if (!standardised.some((p: Project) => p.id === 'furniture-3d')) {
            const f3d = this.defaultProjects.find((p: Project) => p.id === 'furniture-3d');
            if (f3d) {
              standardised.push(f3d);
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('bilalweb_projects', JSON.stringify(standardised));
              }
            }
          }
          
          this.projects.set(standardised);
        } catch {
          this.projects.set(this.defaultProjects);
          this.saveProjects();
        }
      }

      // 5. Packages Storage & Migration
      let packagesStr = localStorage.getItem('bilalweb_packages');
      if (packagesStr) {
        try {
          const parsed = JSON.parse(packagesStr) as Partial<Package>[];
          const starter = parsed.find(p => p.id === 'starter');
          if (starter && (!starter.features || !starter.features.some((f: string) => typeof f === 'string' && f.includes('No admin panel')))) {
            localStorage.removeItem('bilalweb_packages');
            packagesStr = null;
          }
        } catch {
          localStorage.removeItem('bilalweb_packages');
          packagesStr = null;
        }
      }

      if (!packagesStr) {
        const legacyPackages = localStorage.getItem('bilal_packages');
        if (legacyPackages) {
          try {
            const parsedOld = JSON.parse(legacyPackages) as Partial<Package>[];
            const migrated: Package[] = parsedOld.map((p) => ({
              id: p.id || '',
              name: p.name || '',
              icon: p.icon || this.emojiToIconMap[p.emoji || ''] || 'icon-page',
              emoji: p.emoji || this.iconToEmojiMap[p.icon || ''] || '📦',
              description: p.description || '',
              price: String(p.price || ''),
              delivery: p.delivery || p.deliveryTime || '3-5 Days',
              deliveryTime: p.deliveryTime || p.delivery || '3-5 Days',
              features: Array.isArray(p.features) ? p.features : [],
              freeDomainHosting: p.freeDomainHosting !== false,
              includingDomainHosting: p.includingDomainHosting !== false,
              mostPopular: !!(p.mostPopular || p.isMostPopular),
              isMostPopular: !!(p.isMostPopular || p.mostPopular),
              active: p.active !== false,
              dateAdded: p.dateAdded || new Date().toISOString()
            }));
            this.packages.set(migrated);
            localStorage.setItem('bilalweb_packages', JSON.stringify(migrated));
            localStorage.removeItem('bilal_packages');
          } catch {
            this.packages.set(this.defaultPackages);
            this.savePackages();
          }
        } else {
          this.packages.set(this.defaultPackages);
          this.savePackages();
        }
      } else {
        try {
          const parsed = JSON.parse(packagesStr) as Partial<Package>[];
          const standardised: Package[] = parsed.map((p) => ({
            id: p.id || '',
            name: p.name || '',
            icon: p.icon || 'icon-package',
            emoji: p.emoji || this.iconToEmojiMap[p.icon || ''] || '📦',
            description: p.description || '',
            price: String(p.price || ''),
            delivery: p.delivery || p.deliveryTime || '3-5 Days',
            deliveryTime: p.deliveryTime || p.delivery || '3-5 Days',
            features: Array.isArray(p.features) ? p.features : [],
            freeDomainHosting: p.freeDomainHosting !== false,
            includingDomainHosting: p.includingDomainHosting !== false,
            mostPopular: !!(p.mostPopular || p.isMostPopular),
            isMostPopular: !!(p.isMostPopular || p.mostPopular),
            active: p.active !== false,
            dateAdded: p.dateAdded || new Date().toISOString()
          }));
          
          // Auto-migrate if premium-3d package is missing
          if (!standardised.some((p: Package) => p.id === 'premium-3d')) {
            const premVal = this.defaultPackages.find((p: Package) => p.id === 'premium-3d');
            if (premVal) {
              standardised.push(premVal);
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('bilalweb_packages', JSON.stringify(standardised));
              }
            }
          }
          
          this.packages.set(standardised);
        } catch {
          this.packages.set(this.defaultPackages);
          this.savePackages();
        }
      }

      // 6. WhatsApp click counter
      const clicks = localStorage.getItem('bilalweb_whatsapp_clicks');
      this.whatsappClicks.set(clicks ? parseInt(clicks, 10) || 0 : 0);

      // 7. Recent activity Feed
      const activities = localStorage.getItem('bilalweb_activity');
      if (activities) {
        try {
          this.activityFeed.set(JSON.parse(activities));
        } catch {
          this.activityFeed.set([]);
        }
      } else {
        this.activityFeed.set([]);
      }

      // 8. Newsletter Subscribers
      const subs = localStorage.getItem('bilalweb_subscribers');
      if (subs) {
        try {
          this.newsletterSubscribers.set(JSON.parse(subs));
        } catch {
          this.newsletterSubscribers.set([]);
        }
      } else {
        this.newsletterSubscribers.set([]);
      }
      this.fetchSubscribersFromServer();

    } else {
      // Server Side Fallbacks
      this.businessName.set('Bilal Web');
      this.displayName.set('Bilal');
      this.whatsappNumber.set('+256749445501');
      this.domainName.set('bilalweb.online');
      this.projects.set(this.defaultProjects);
      this.packages.set(this.defaultPackages);
      this.newsletterSubscribers.set([]);
    }
  }

  private createDefaultSettings(): Settings {
    return {
      businessName: 'Bilal Web',
      displayName: 'Bilal',
      whatsapp: '+256749445501',
      domain: 'bilalweb.online'
    };
  }

  // Set up global click events to intercept and track WhatsApp chat triggers
  private setupGlobalClickTracker() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const anchor = target.closest('a');
        if (anchor && anchor.href && anchor.href.includes('wa.me')) {
          this.trackWhatsAppClick();
          this.logActivity('WhatsApp Contact click', `User triggered WhatsApp chat link: ${anchor.href}`);
        }
      });
    }
  }

  // Save actions safely
  private saveProjects() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bilalweb_projects', JSON.stringify(this.projects()));
    }
  }

  private savePackages() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bilalweb_packages', JSON.stringify(this.packages()));
    }
  }

  // Newsletter Subscriber management
  private saveSubscribers() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bilalweb_subscribers', JSON.stringify(this.newsletterSubscribers()));
    }
  }

  async fetchSubscribersFromServer() {
    if (typeof fetch === 'undefined') return;
    try {
      const res = await fetch('/api/subscribers');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.subscribers)) {
          this.newsletterSubscribers.set(data.subscribers || []);
          this.saveSubscribers();
        }
      }
    } catch (e) {
      console.warn('Could not fetch subscribers from server:', e);
    }
  }

  async addSubscriber(email: string): Promise<boolean> {
    const normalised = email.trim().toLowerCase();
    if (!normalised) return false;

    // Check pre-existence
    if (this.newsletterSubscribers().some(s => s.email === normalised)) {
      return false;
    }

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalised })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const newSub: Subscriber = {
            email: normalised,
            dateSubscribed: new Date().toISOString()
          };
          this.newsletterSubscribers.update(list => {
            if (list.some(s => s.email === normalised)) return list;
            return [...list, newSub];
          });
          this.saveSubscribers();
          this.logActivity('Newsletter Subscribed', `Client mailing list joined: ${normalised}`);
          return true;
        }
      }
    } catch (e) {
      console.error('addSubscriber server error:', e);
    }
    
    return false;
  }

  async deleteSubscriber(email: string): Promise<boolean> {
    const normalised = email.trim().toLowerCase();
    try {
      const res = await fetch(`/api/subscribers/${encodeURIComponent(normalised)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          this.newsletterSubscribers.update(list => list.filter(item => item.email !== normalised));
          this.saveSubscribers();
          this.logActivity('Subscriber Erased', `Removed mailing list recipient: ${normalised}`);
          return true;
        }
      }
    } catch (e) {
      console.error('deleteSubscriber server error:', e);
    }
    return false;
  }

  // Settings modification
  updateSettings(businessName: string, displayName: string, whatsapp: string, domain: string) {
    this.businessName.set(businessName);
    this.displayName.set(displayName);
    this.whatsappNumber.set(whatsapp);
    this.domainName.set(domain);

    const settings: Settings = { businessName, displayName, whatsapp, domain };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bilalweb_settings', JSON.stringify(settings));
    }
    this.logActivity('Settings Updated', `Business name: "${businessName}", Display name: "${displayName}"`);
  }

  updateCredentials(email: string, pass: string) {
    this.adminEmail.set(email);
    this.adminPassword.set(pass);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bilalweb_admin_email', email);
      localStorage.setItem('bilalweb_admin_password', pass);
    }
    this.logActivity('Credentials Modified', `Security credentials updated for: ${email}`);
  }

  // Track WhatsApp click
  trackWhatsAppClick() {
    this.whatsappClicks.update(val => {
      const newVal = val + 1;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bilalweb_whatsapp_clicks', String(newVal));
      }
      return newVal;
    });
  }

  // System Logs
  logActivity(action: string, details: string) {
    const timestamp = new Date().toISOString();
    this.activityFeed.update(feed => {
      const updated = [{ action, details, timestamp }, ...feed].slice(0, 10);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bilalweb_activity', JSON.stringify(updated));
      }
      return updated;
    });
  }

  // Portfolio actions
  addProject(proj: Omit<Project, 'id' | 'visible' | 'dateAdded'>) {
    const id = proj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Math.random().toString(36).substring(2, 7);
    const newProj: Project = {
      ...proj,
      id,
      emoji: proj.emoji || this.iconToEmojiMap[proj.icon] || '💻',
      visible: true,
      dateAdded: new Date().toISOString()
    };
    this.projects.update(list => [...list, newProj]);
    this.saveProjects();
    this.logActivity('Project Appended', `Added showcase project: "${proj.name}"`);
  }

  updateProject(id: string, updated: Partial<Project>) {
    this.projects.update(list => list.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updated };
        if (updated.icon) {
          merged.emoji = this.iconToEmojiMap[updated.icon] || '💻';
        }
        return merged;
      }
      return item;
    }));
    this.saveProjects();
    this.logActivity('Project Updated', `Modified layout fields for project ID: "${id}"`);
  }

  deleteProject(id: string) {
    const proj = this.projects().find(p => p.id === id);
    const nameStr = proj ? proj.name : id;
    this.projects.update(list => list.filter(item => item.id !== id));
    this.saveProjects();
    this.logActivity('Project Erased', `Removed portfolio project: "${nameStr}"`);
  }

  // Packages actions
  addPackage(pkg: Omit<Package, 'id' | 'active' | 'dateAdded'>) {
    const id = pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Math.random().toString(36).substring(2, 7);
    const newPkg: Package = {
      ...pkg,
      id,
      emoji: pkg.emoji || this.iconToEmojiMap[pkg.icon] || '📦',
      deliveryTime: pkg.deliveryTime || pkg.delivery || '3-5 Days',
      includingDomainHosting: pkg.includingDomainHosting !== false,
      isMostPopular: pkg.isMostPopular || pkg.mostPopular || false,
      active: true,
      dateAdded: new Date().toISOString()
    };
    this.packages.update(list => [...list, newPkg]);
    this.savePackages();
    this.logActivity('Package Appended', `Created customer pricing tier: "${pkg.name}"`);
  }

  updatePackage(id: string, updated: Partial<Package>) {
    this.packages.update(list => list.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updated };
        if (updated.icon) {
          merged.emoji = this.iconToEmojiMap[updated.icon] || '📦';
        }
        if (updated.delivery) {
          merged.deliveryTime = updated.delivery;
        }
        if (updated.freeDomainHosting !== undefined) {
          merged.includingDomainHosting = updated.freeDomainHosting;
        }
        if (updated.mostPopular !== undefined) {
          merged.isMostPopular = updated.mostPopular;
        }
        return merged;
      }
      return item;
    }));
    this.savePackages();
    this.logActivity('Package Modified', `Adjusted service fields on package ID: "${id}"`);
  }

  deletePackage(id: string) {
    const pkg = this.packages().find(p => p.id === id);
    const nameStr = pkg ? pkg.name : id;
    this.packages.update(list => list.filter(item => item.id !== id));
    this.savePackages();
    this.logActivity('Package Deleted', `Deleted pricing tier package: "${nameStr}"`);
  }

  // Erase and reboot with default layouts
  resetAllData() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.businessName.set('Bilal Web');
    this.displayName.set('Bilal');
    this.whatsappNumber.set('+256749445501');
    this.domainName.set('bilalweb.online');
    this.projects.set(this.defaultProjects);
    this.packages.set(this.defaultPackages);
    this.whatsappClicks.set(0);
    this.activityFeed.set([]);
    this.newsletterSubscribers.set([]);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bilalweb_admin_email', 'bilal@bilalweb.online');
      localStorage.setItem('bilalweb_admin_password', 'Bilal2025!');
      localStorage.setItem('bilalweb_settings', JSON.stringify(this.createDefaultSettings()));
      localStorage.setItem('bilalweb_projects', JSON.stringify(this.defaultProjects));
      localStorage.setItem('bilalweb_packages', JSON.stringify(this.defaultPackages));
      localStorage.setItem('bilalweb_whatsapp_clicks', '0');
      localStorage.setItem('bilalweb_activity', '[]');
      localStorage.setItem('bilalweb_subscribers', '[]');
    }

    this.logActivity('Database Reset', 'Complete factory reset triggered: all local data restored.');
  }
}
