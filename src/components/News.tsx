import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ExternalLink, ArrowRight, ChevronDown, ChevronUp, Package, Plane, Truck, ShieldCheck, Clock, Globe } from 'lucide-react';
import { api } from '../api';
import { useI18n } from '../i18n';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'announcement' | 'industry' | 'update' | 'security';
  publishedAt: string;
  author: string;
  readTime: string;
  featured: boolean;
  image: string;
}

const categories = [
  { id: 'all', label: 'ALL', icon: Globe },
  { id: 'announcement', label: 'ANNOUNCEMENTS', icon: Package },
  { id: 'industry', label: 'INDUSTRY NEWS', icon: Plane },
  { id: 'update', label: 'SERVICE UPDATES', icon: Truck },
  { id: 'security', label: 'SECURITY ALERTS', icon: ShieldCheck },
];

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'SwiftTrack Expands Global Network with 12 New Certified Hubs',
    excerpt: 'We are proud to announce the addition of 12 new TAPA-certified hubs across Asia-Pacific and Europe, extending our secure logistics footprint to 180+ countries.',
    content: `SwiftTrack Consignment Systems today announced the expansion of its global secure logistics network with the certification of 12 new hubs across key trade corridors in Asia-Pacific and Europe.

The new facilities, located in Singapore, Hong Kong, Tokyo, Seoul, Mumbai, Dubai, Frankfurt, Amsterdam, Milan, Madrid, Warsaw, and Istanbul, bring SwiftTrack's total certified hub count to 36 worldwide.

"These strategic additions significantly enhance our ability to serve high-value sectors including aerospace, pharmaceuticals, luxury goods, and technology," said Sarah Chen, VP of Global Operations. "Each facility undergoes rigorous TAPA FSR certification, ensuring end-to-end chain of custody integrity for our clients' most critical shipments."

Key features of the new hubs include:
- 24/7 GPS-monitored secure storage zones
- Climate-controlled vaults for temperature-sensitive cargo
- Biometric access control with full audit trails
- Real-time environmental monitoring (temperature, humidity, shock, light exposure)
- Dedicated customs clearance lanes at major international airports

The expansion represents a $47M investment in infrastructure and technology, with all facilities integrated into SwiftTrack's proprietary tracking platform providing clients with millisecond-level visibility.

Operations at all 12 hubs commenced on March 1, 2026, with full SLA compliance expected by Q2 2026.`,
    category: 'announcement',
    publishedAt: '2026-03-15T08:00:00Z',
    author: 'Sarah Chen, VP Global Operations',
    readTime: '4 min read',
    featured: true,
    image: 'https://picsum.photos/seed/news1/800/500'
  },
  {
    id: '2',
    title: 'New AI-Powered Route Optimization Reduces Transit Times by 23%',
    excerpt: 'Our latest platform update introduces predictive analytics that dynamically optimize routing based on real-time weather, traffic, and customs data.',
    content: `SwiftTrack has deployed a major platform update featuring advanced AI-driven route optimization across its global network. The system leverages machine learning models trained on 15 years of historical shipment data, combined with real-time feeds from weather services, port authorities, customs agencies, and traffic management systems.

Early results from the pilot program across 500+ active shipments show an average 23% reduction in transit time variance, with peak improvements of 37% on trans-pacific lanes.

"Traditional routing relies on static schedules and historical averages," explained Dr. Marcus Webb, CTO. "Our new engine continuously recalculates optimal paths based on live conditions, automatically rerouting around disruptions before they impact delivery windows."

The system integrates with:
- NOAA and ECMWF weather models (updated hourly)
- Port community systems for real-time berth availability
- Customs pre-clearance APIs in 40+ countries
- Traffic management systems in major metro areas
- Carrier capacity forecasts from airline and ocean partners

Clients can access the new routing intelligence via the SwiftTrack dashboard under 'Route Analytics' or through the API for TMS integration.`,
    category: 'update',
    publishedAt: '2026-03-08T14:30:00Z',
    author: 'Dr. Marcus Webb, CTO',
    readTime: '5 min read',
    featured: true,
    image: 'https://picsum.photos/seed/news2/800/500'
  },
  {
    id: '3',
    title: 'Industry Alert: New EU Customs Regulations Effective April 2026',
    excerpt: 'Important updates to EU Import Control System 2 (ICS2) Release 3 requirements for all air cargo entering the European Union.',
    content: `The European Commission has confirmed that ICS2 Release 3 will become mandatory for all air cargo entering the EU customs territory effective April 1, 2026. This release extends pre-loading advance cargo information (PLACI) requirements to all economic operators in the air cargo supply chain.

Key changes affecting SwiftTrack clients:
- Complete pre-loading data submission required before aircraft departure from last port of call
- Enhanced data set including 6-digit HS codes, gross weight, and package details
- New risk assessment protocols for high-value and sensitive goods
- Mandatory ENS (Entry Summary Declaration) filing for all express and postal consignments

SwiftTrack has proactively updated its customs integration layer to ensure full compliance. Our automated filing engine now supports the complete ICS2 R3 dataset, with validation rules that prevent submission errors before transmission.

Action required: Clients shipping to EU destinations should ensure their commercial invoices and packing lists include 6-digit HS codes and accurate gross weights per package. SwiftTrack's document management portal has been updated with new templates.

For detailed guidance, visit our Compliance Center or contact your dedicated account manager.`,
    category: 'security',
    publishedAt: '2026-02-28T10:00:00Z',
    author: 'Compliance Team',
    readTime: '3 min read',
    featured: false,
    image: 'https://picsum.photos/seed/news3/800/500'
  },
  {
    id: '4',
    title: 'SwiftTrack Achieves ISO 28000:2022 Recertification',
    excerpt: 'Our supply chain security management system has been recertified under the latest ISO standard, reinforcing our commitment to global security excellence.',
    content: `SwiftTrack Consignment Systems has successfully achieved recertification to ISO 28000:2022, the international standard for supply chain security management systems. The audit, conducted by SGS, covered all 36 global hubs, corporate headquarters, and the digital platform.

The updated ISO 28000:2022 standard introduces enhanced requirements for:
- Cyber-physical security convergence
- Supply chain resilience and business continuity
- Threat intelligence integration
- Stakeholder engagement and communication

"Security isn't a checkbox—it's a culture," said James Morrison, Chief Security Officer. "This recertification validates our continuous investment in protecting client assets from origin to destination, across both physical and digital domains."

The certification scope includes:
- Physical security at all facilities and in-transit
- Information security and data protection (aligned with ISO 27001)
- Personnel security and vetting procedures
- Incident management and emergency response
- Supplier and partner security assessments

Certificates are available for client audit purposes via the SwiftTrack Compliance Portal.`,
    category: 'announcement',
    publishedAt: '2026-02-20T09:00:00Z',
    author: 'James Morrison, CSO',
    readTime: '3 min read',
    featured: false,
    image: 'https://picsum.photos/seed/news4/800/500'
  },
  {
    id: '5',
    title: 'Launch: SwiftTrack Pharma - GDP-Compliant Cold Chain Solution',
    excerpt: 'New specialized service for pharmaceutical and life sciences logistics with end-to-end temperature control and regulatory compliance.',
    content: `SwiftTrack is proud to announce the launch of SwiftTrack Pharma, a dedicated logistics solution for the pharmaceutical and life sciences industry. Built on our TAPA-certified network, this service provides GDP (Good Distribution Practice) compliant transportation and storage for temperature-sensitive medicinal products.

Service capabilities include:
- Validated temperature ranges: -80°C to +25°C (ultra-low, frozen, refrigerated, controlled room temperature)
- Real-time temperature monitoring with GPS correlation (data loggers calibrated to ISO 17025)
- Qualified thermal packaging solutions (passive and active)
- GMP-compliant warehousing with segregated quarantine, release, and rejection zones
- Automated temperature excursion alerts with escalation workflows
- Complete audit trail for regulatory submissions (FDA, EMA, MHRA, PMDA)
- Dedicated pharma-trained personnel at all touchpoints

"Pharmaceutical logistics demands zero tolerance for error," said Dr. Elena Vasquez, Head of Pharma Logistics. "We've invested in purpose-built infrastructure and validated processes to give our life sciences clients absolute confidence."

SwiftTrack Pharma is initially available on lanes between North America, Europe, and Asia-Pacific, with Latin America and Middle East corridors launching Q3 2026.`,
    category: 'announcement',
    publishedAt: '2026-02-12T12:00:00Z',
    author: 'Dr. Elena Vasquez, Head of Pharma Logistics',
    readTime: '4 min read',
    featured: true,
    image: 'https://picsum.photos/seed/news5/800/500'
  },
  {
    id: '6',
    title: 'Quarterly Threat Intelligence Report: Q1 2026',
    excerpt: 'Analysis of emerging risks in global supply chains including cyber-physical threats, geopolitical disruptions, and cargo crime trends.',
    content: `SwiftTrack's Global Security Operations Center (GSOC) has published its Q1 2026 Threat Intelligence Report, analyzing over 2,800 security events across the global logistics network.

Key findings:
- 34% increase in cyber-physical attacks targeting logistics IT/OT systems
- Cargo theft incidents up 18% YoY, with organized crime groups leveraging insider threats
- Red Sea route disruptions continuing to drive modal shifts and capacity constraints
- Increased regulatory scrutiny on dual-use goods and sanctions compliance

Emerging threats:
1. AI-generated documentation fraud (deepfake bills of lading, certificates of origin)
2. Drone-based surveillance of high-value cargo at rest
3. Ransomware targeting freight forwarder TMS platforms
4. Counterfeit security seals entering legitimate supply chains

Mitigation recommendations:
- Implement multi-factor authentication on all logistics platforms
- Deploy tamper-evident IoT seals with cryptographic verification
- Conduct quarterly penetration testing of TMS/WMS integrations
- Enhance supplier vetting with continuous monitoring

The full report with regional breakdowns and specific IOCs (Indicators of Compromise) is available to SwiftTrack clients via the Security Intelligence Portal.`,
    category: 'security',
    publishedAt: '2026-01-31T16:00:00Z',
    author: 'Global Security Operations Center',
    readTime: '6 min read',
    featured: false,
    image: 'https://picsum.photos/seed/news6/800/500'
  },
  {
    id: '7',
    title: 'Platform Update: Enhanced Shipment Dashboard v4.2',
    excerpt: 'New features include predictive ETA, carbon emissions tracking, and multi-modal journey visualization.',
    content: `We've released Dashboard v4.2 with significant enhancements based on client feedback and usage analytics.

New features:
- Predictive ETA Engine: ML-powered delivery estimates with confidence intervals, factoring in real-time carrier performance, weather, and congestion data
- Carbon Emissions Calculator: Per-shipment CO2e tracking across all transport modes, aligned with GLEC Framework and ISO 14083
- Multi-Modal Journey View: Unified timeline visualization for shipments combining air, ocean, rail, and road segments
- Custom Alert Builder: Drag-and-drop workflow for creating complex notification rules (geofence, temperature, delay thresholds, document status)
- Enhanced API: Webhook support for real-time event streaming to client systems

Performance improvements:
- 60% faster dashboard load times
- Reduced API latency by 40% through edge caching
- Mobile-responsive redesign with offline capability

All features are available immediately at no additional cost to Pro and Enterprise tier clients.`,
    category: 'update',
    publishedAt: '2026-01-22T11:00:00Z',
    author: 'Product Team',
    readTime: '3 min read',
    featured: false,
    image: 'https://picsum.photos/seed/news7/800/500'
  },
  {
    id: '8',
    title: 'Strategic Partnership: SwiftTrack x Maersk for Integrated Ocean-Air Solutions',
    excerpt: 'New partnership enables seamless sea-air multimodal shipments with single-point accountability and unified tracking.',
    content: `SwiftTrack and Maersk have announced a strategic partnership to offer integrated sea-air multimodal solutions on key Asia-Europe and Transpacific lanes.

The collaboration combines Maersk's ocean network reliability with SwiftTrack's air cargo speed and security infrastructure, providing clients with:
- Single contract and bill of lading for end-to-end journey
- Unified tracking across ocean and air legs
- Optimized transshipment at Dubai (DWC), Singapore, and Los Angeles hubs
- Flexible mode switching based on urgency and cost requirements
- Combined carbon reporting across modalities

"Global supply chains need flexibility," said Vincent Clerc, CEO of Maersk. "This partnership gives shippers a true multimodal option with the security and visibility they expect from SwiftTrack."

Initial lanes:
- Shanghai → Dubai (sea) → London/Frankfurt (air)
- Shenzhen → Singapore (sea) → Los Angeles (air)
- Ningbo → Los Angeles (sea) → Mexico City (air)

Service launches April 1, 2026, with dedicated capacity allocations for SwiftTrack clients.`,
    category: 'industry',
    publishedAt: '2026-01-15T09:00:00Z',
    author: 'Partnerships Team',
    readTime: '4 min read',
    featured: true,
    image: 'https://picsum.photos/seed/news8/800/500'
  }
];

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect fill="#1a1a2e" width="800" height="500"/><text x="400" y="250" text-anchor="middle" fill="#ffffff50" font-size="48" font-family="monospace">IMAGE</text></svg>');

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>(mockNews);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.news?.list?.() || mockNews;
        setNews(data);
        setFilteredNews(data);
      } catch (e) {
        setNews(mockNews);
        setFilteredNews(mockNews);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(n => n.category === activeCategory));
    }
  }, [activeCategory, news]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    const cat = categories.find(c => c.id === category);
    return cat ? <cat.icon className="w-4 h-4" /> : <Globe className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col gap-24 sm:gap-40 py-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-micro text-accent tracking-[0.2em]">{t('news.title')}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl sm:text-9xl font-black tracking-tighter text-primary leading-[0.85] heading-display uppercase"
          >
            {t('news.heading').split(' ').slice(0, -1).join(' ')} <br />
            <span className="text-muted/30 italic font-serif lowercase">{t('news.heading').split(' ').slice(-1).join('')}</span>.
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 pb-4"
        >
          <p className="text-xl sm:text-2xl text-muted leading-relaxed font-medium max-w-xl">
            Stay informed with the latest announcements, industry intelligence, service updates, and security advisories from SwiftTrack's global operations.
          </p>
        </motion.div>
      </section>

      {/* Category Filter - Technical Tab Bar */}
      <section className="border-y border-primary/10">
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-2 min-w-max px-8 sm:px-16 lg:px-24">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-primary hover:bg-primary/5'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredNews.filter(n => n.featured).slice(0, 2).map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white border border-primary/5 hover:border-accent/30 overflow-hidden cursor-pointer transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-primary/5">
                <img src={article.image} alt={article.title} loading="lazy" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>
                <span className={`absolute top-4 right-4 z-10 text-micro font-bold uppercase tracking-widest px-3 py-1 rounded ${article.category === 'security' ? 'bg-rose-500/90 text-white' : article.category === 'announcement' ? 'bg-primary text-white' : article.category === 'update' ? 'bg-accent text-white' : 'bg-blue-500/90 text-white'}`}>
                  {article.category.toUpperCase()}
                </span>
              </div>
              <div className="p-8 flex flex-col gap-6">
                <div className="flex items-center gap-4 text-micro font-mono text-muted">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-primary heading-display leading-tight group-hover:text-accent transition-colors">
                  {article.title}
                </h2>
                <p className="text-muted leading-relaxed font-medium line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                  <div className="flex items-center gap-2 text-micro font-medium text-muted">
                    <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs">
                      {article.author.charAt(0)}
                    </span>
                    <span>{article.author.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1 text-accent font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* All Articles - Technical List */}
      <section className="border-t border-primary/10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredNews.filter(n => !n.featured).map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white border border-primary/5 hover:border-accent/30 hover:bg-primary/5 flex flex-col cursor-pointer transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-primary/5">
                <img src={article.image} alt={article.title} loading="lazy" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${article.category === 'security' ? 'bg-rose-500/90 text-white' : article.category === 'announcement' ? 'bg-primary text-white' : article.category === 'update' ? 'bg-accent text-white' : 'bg-blue-500/90 text-white'}`}>
                  {article.category}
                </span>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-4 text-micro font-mono text-muted">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-black text-primary heading-display leading-tight group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-2 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                  <span className="text-micro font-medium text-muted uppercase tracking-widest">
                    {article.author.split(',')[0]}
                  </span>
                  <div className="flex items-center gap-1 text-accent font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                    <span>Read</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary text-white py-24 px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <span className="text-[20vw] font-black leading-none heading-display uppercase select-none">NEWS.</span>
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="text-micro text-accent tracking-[0.2em] block mb-6">STAY INFORMED</span>
          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter heading-display uppercase leading-none mb-8">
            Never Miss <br />
            <span className="text-white/30 italic font-serif lowercase">An Update</span>.
          </h2>
          <p className="text-xl text-white/60 max-w-xl mx-auto mb-12 font-medium leading-relaxed">
            Subscribe to our intelligence briefings for critical logistics insights, security advisories, and platform updates delivered directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 input-modern bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-accent"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
          <p className="text-micro text-white/40 font-mono uppercase tracking-widest mt-8">
            No spam. Unsubscribe anytime. <a href="#" className="underline hover:text-accent">Privacy Policy</a>
          </p>
        </div>
      </section>
    </div>
  );
}