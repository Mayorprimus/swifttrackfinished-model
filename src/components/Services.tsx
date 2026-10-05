import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, Plane, Truck, ShieldCheck, Thermometer, Globe, 
  Lock, Clock, ArrowRight, Check, Star, Zap, Shield, 
  Layers, Target, RotateCcw, BarChart3, FileText, 
  AlertTriangle, ShieldAlert, BadgeCheck 
} from 'lucide-react';
import { useI18n } from '../i18n';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect fill="#1a1a2e" width="800" height="500"/><text x="400" y="250" text-anchor="middle" fill="#ffffff50" font-size="48" font-family="monospace">IMAGE</text></svg>');

const services = [
  {
    id: 'air-freight',
    icon: Plane,
    title: 'Air Freight',
    tagline: 'Speed Meets Security',
    description: 'Time-critical air cargo solutions with priority handling on 200+ global routes. Dedicated freighter capacity and belly-space on commercial flights.',
    image: 'https://picsum.photos/seed/service1/800/500',
    features: [
      'Next-flight-out capability from 40+ major hubs',
      'Charter solutions for oversized and project cargo',
      'Temperature-controlled ULDs (-80°C to +25°C)',
      'Dangerous goods (IATA DGR) certified handling',
      'Customs pre-clearance on key lanes',
      'Real-time tracking with 15-min updates'
    ],
    specs: ['24/7 Ops Center', 'TAPA FSR Certified', 'IATA Accredited', 'GDP Compliant'],
    cta: 'Request Quote'
  },
  {
    id: 'ocean-freight',
    icon: Globe,
    title: 'Ocean Freight',
    tagline: 'Global Reach, Local Expertise',
    description: 'FCL and LCL services across all major trade lanes with NVOCC capabilities. Strategic carrier alliances ensure space protection and competitive rates.',
    image: 'https://picsum.photos/seed/service2/800/500',
    features: [
      'Weekly sailings on 50+ core trade lanes',
      'Direct contracts with top 10 global carriers',
      'Project cargo and breakbulk management',
      'Reefer cargo with remote monitoring',
      'Cargo insurance up to $100M per shipment',
      'Carbon-neutral shipping options (GLEC aligned)'
    ],
    specs: ['FMC Licensed NVOCC', 'FIATA Member', 'WCA Certified', 'AEO Status'],
    cta: 'Check Schedules'
  },
  {
    id: 'road-rail',
    icon: Truck,
    title: 'Road & Rail',
    tagline: 'Last-Mile Precision',
    description: 'European and North American surface transport network with owned fleet and vetted partners. First/last mile, cross-dock, and distribution.',
    image: 'https://picsum.photos/seed/service3/800/500',
    features: [
      'Owned fleet: 200+ GPS-tracked vehicles',
      'ADR certified dangerous goods transport',
      'Temperature-controlled trailers (ATP certified)',
      'Cross-dock facilities at 15 strategic hubs',
      'Rail freight: China-Europe, Trans-Siberian',
      'Urban delivery with emission-free vehicles'
    ],
    specs: ['CMR Insurance', 'TIR Carnets', 'GDP Fleet', 'ISO 14001'],
    cta: 'Book Transport'
  },
  {
    id: 'pharma-logistics',
    icon: Thermometer,
    title: 'Pharma & Life Sciences',
    tagline: 'Zero-Tolerance Cold Chain',
    description: 'GDP-compliant logistics for pharmaceuticals, biologics, clinical trials, and medical devices. Validated lanes with full regulatory audit trails.',
    image: 'https://picsum.photos/seed/service4/800/500',
    features: [
      'Validated thermal packaging (-80°C to +25°C)',
      'Real-time temp/location/humidity monitoring',
      'GMP/GDP qualified warehousing (EU/US/JP)',
      'Clinical trial logistics (CTM/IMP management)',
      'Regulatory documentation (DoC, CoA, TSE/BSE)',
      '24/7 qualified person (QP) release support'
    ],
    specs: ['EU GDP Certified', 'FDA Registered', 'ISO 13485', 'PIC/S Aligned'],
    cta: 'Learn More'
  },
  {
    id: 'high-value',
    icon: ShieldCheck,
    title: 'High-Value & Secure',
    tagline: 'Asset-Level Protection',
    description: 'Specialized handling for luxury goods, electronics, artwork, jewelry, and sensitive technology. TAPA TSR Level 1 facilities and armed escort options.',
    image: 'https://picsum.photos/seed/service5/800/500',
    features: [
      'TAPA TSR Level 1 certified facilities (36 hubs)',
      'Armed escort and convoy services (where legal)',
      'Biometric access control with audit trails',
      'Vibration, shock, and tilt monitoring',
      'Discrete unmarked vehicles and packaging',
      'Dedicated security operations center (GSOC)'
    ],
    specs: ['TAPA TSR L1', 'ISO 28000', 'BSI Certified', 'Lloyd\'s Syndicate'],
    cta: 'Security Assessment'
  },
  {
    id: 'customs-compliance',
    icon: FileText,
    title: 'Customs & Compliance',
    tagline: 'Borderless Clearance',
    description: 'Global customs brokerage with AEO-certified teams in 30+ countries. Automated filing, classification, duty optimization, and regulatory advisory.',
    image: 'https://picsum.photos/seed/service6/800/500',
    features: [
      'Automated entry filing (ABI/CHIEF/ATLAS/NCTS)',
      'HS classification and binding rulings',
      'FTZ and bonded warehouse management',
      'Trade agreement utilization (USMCA, CPTPP, RCEP, EU FTAs)',
      'Sanctions screening and export controls',
      'Post-entry audit defense and voluntary disclosures'
    ],
    specs: ['AEO Certified', 'CHB Licensed', 'C-TPAT', 'ISO 9001'],
    cta: 'Compliance Check'
  },
  {
    id: 'warehousing',
    icon: Package,
    title: 'Warehousing & Distribution',
    tagline: 'Smart Storage Solutions',
    description: '2M+ sq ft of strategically located warehousing with WMS integration, value-added services, and e-commerce fulfillment capabilities.',
    image: 'https://picsum.photos/seed/service7/800/500',
    features: [
      'WMS with real-time inventory visibility',
      'Pick/pack/kitting and light assembly',
      'Returns management and refurbishment',
      'E-commerce integration (Shopify, Amazon, custom)',
      'Cross-dock and transload operations',
      'Hazmat storage (Class 1-9, excluding 7)'
    ],
    specs: ['WMS Integration', 'EDI Capable', 'PCI DSS', 'SOC 2 Type II'],
    cta: 'View Locations'
  },
  {
    id: 'digital-platform',
    icon: BarChart3,
    title: 'Digital Platform',
    tagline: 'Visibility & Intelligence',
    description: 'SwiftTrack ONE: Unified TMS/WMS/OMS platform with predictive analytics, API ecosystem, and white-label client portals.',
    image: 'https://picsum.photos/seed/service8/800/500',
    features: [
      'End-to-end shipment visibility (multi-modal)',
      'Predictive ETA with ML confidence scoring',
      'Carbon emissions tracking (GLEC/ISO 14083)',
      'Automated document management (OCR + AI)',
      'REST/GraphQL APIs + webhook events',
      'White-label client portals and mobile app'
    ],
    specs: ['99.9% Uptime SLA', 'SOC 2 Type II', 'ISO 27001', 'GDPR Compliant'],
    cta: 'Request Demo'
  }
];

const valueProps = [
  { icon: Shield, title: 'TAPA Certified', desc: 'All facilities meet TAPA FSR/TSR standards' },
  { icon: Globe, title: '180+ Countries', desc: 'Global network with local expertise' },
  { icon: Clock, title: '24/7/365 Ops', desc: 'Round-the-clock monitoring & support' },
  { icon: BadgeCheck, title: 'ISO 9001/14001/27001/28000', desc: 'Full management system certification' },
  { icon: Zap, title: 'Real-Time Tech', desc: 'Proprietary platform with 15-min updates' },
  { icon: Target, title: '99.9% On-Time', desc: 'Industry-leading delivery performance' }
];

const industries = [
  { name: 'Aerospace & Defense', icon: Plane, desc: 'ITAR-registered, DDTC compliant, NATO clearance' },
  { name: 'Pharmaceuticals', icon: Thermometer, desc: 'GDP validated, clinical trials, cold chain' },
  { name: 'High-Tech & Electronics', icon: Shield, desc: 'ESD-safe, anti-static, shock-monitored' },
  { name: 'Automotive', icon: RotateCcw, desc: 'JIT/JIS, sequencing, VDA 6.3, IATF 16949' },
  { name: 'Luxury & Fashion', icon: Star, desc: 'White-glove, climate control, brand protection' },
  { name: 'Energy & Industrial', icon: AlertTriangle, desc: 'Project cargo, oversized, hazardous, ATEX' },
  { name: 'E-Commerce & Retail', icon: Package, desc: 'Omnichannel fulfillment, last-mile, returns' },
  { name: 'Government & Aid', icon: ShieldAlert, desc: 'Humanitarian logistics, diplomatic pouch, UN certified' }
];

export default function Services() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-24 sm:gap-40 py-12">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-micro text-accent tracking-[0.2em]">{t('services.title')}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl sm:text-9xl font-black tracking-tighter text-primary leading-[0.85] heading-display uppercase"
          >
            {t('services.heading').split(' ').slice(0, -2).join(' ')} <br />
            <span className="text-muted/30 italic font-serif lowercase">{t('services.heading').split(' ').slice(-2, -1).join('')}</span> <br />
            {t('services.heading').split(' ').slice(-1).join('')}
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 pb-4"
        >
          <p className="text-xl sm:text-2xl text-muted leading-relaxed font-medium max-w-xl">
            From air charter to last-mile delivery, cold chain to customs clearance. 
            One integrated platform. One point of accountability. Global reach with local precision.
          </p>
          <div className="flex flex-wrap gap-4">
            {valueProps.slice(0, 3).map((vp, i) => (
              <motion.div key={i} className="flex items-center gap-3 px-4 py-3 border border-primary/10 hover:border-accent/30 transition-colors" whileHover={{ scale: 1.02 }}>
                <vp.icon className="w-5 h-5 text-accent" />
                <span className="text-micro font-bold text-muted uppercase tracking-widest">{vp.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Services Grid - Technical Cards */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white border border-primary/5 hover:border-accent/30 overflow-hidden flex flex-col transition-all duration-500"
            >
              <div className="relative aspect-[4/3] bg-primary/5 overflow-hidden">
                <img src={service.image} alt={service.title} loading="lazy" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <service.icon className="w-8 h-8 text-white mb-2" />
                  <span className="text-micro font-bold text-white/80 uppercase tracking-widest">{service.tagline}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-micro font-bold text-accent uppercase tracking-widest">{service.tagline}</span>
                </div>
                <h3 className="text-xl font-black text-primary heading-display uppercase tracking-tight group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-medium flex-1">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.specs.map((spec, si) => (
                    <span key={si} className="px-2 py-1 text-[10px] font-mono font-bold text-muted uppercase tracking-widest border border-primary/10 hover:border-accent/30 hover:text-primary transition-colors">
                      {spec}
                    </span>
                  ))}
                </div>
                <button className="mt-2 flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all px-4 py-3 border border-accent/30 hover:bg-accent/5">
                  {service.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Detailed Service Expansion */}
      <section className="border-y border-primary/10 py-16">
        <h2 className="text-4xl sm:text-6xl font-black text-primary heading-display uppercase tracking-tighter mb-16 max-w-3xl">
          Deep Dive: <span className="text-accent">Service</span> Capabilities.
        </h2>
        <div className="space-y-16">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row gap-16 items-start ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={`flex-1 ${i % 2 === 1 ? 'lg:pl-16' : 'lg:pr-16'} relative`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10" />
                <div className="pl-8 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <span className="text-micro text-accent font-bold uppercase tracking-widest block mb-1">{service.tagline}</span>
                      <h3 className="text-3xl sm:text-4xl font-black text-primary heading-display uppercase tracking-tight">{service.title}</h3>
                    </div>
                  </div>
                  <p className="text-lg text-muted leading-relaxed font-medium max-w-xl pr-8">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {service.features.map((feature, fi) => (
                      <div key={fi} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted leading-relaxed font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-white border border-primary/5 relative overflow-hidden group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={service.image} alt={service.title} loading="lazy" onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                </div>
                <div className="p-8 relative">
                  <div className="relative flex flex-col gap-4">
                    {service.specs.map((spec, si) => (
                      <div key={si} className="flex items-center gap-4 p-4 border border-primary/5 hover:border-accent/30 transition-colors">
                        <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                          <BadgeCheck className="w-5 h-5 text-accent" />
                        </div>
                        <span className="font-bold text-sm text-primary uppercase tracking-widest">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Industry Expertise */}
      <section>
        <div className="flex flex-col gap-10 mb-16">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-micro text-accent tracking-[0.2em]">INDUSTRY EXPERTISE</span>
          </div>
          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-primary heading-display uppercase leading-none max-w-3xl">
            Specialized Solutions <br />
            <span className="text-muted/30 italic font-serif lowercase">By Sector</span>.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white border border-primary/5 hover:border-accent/30 p-8 flex flex-col gap-6 transition-all duration-500"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                  <industry.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-black text-lg text-primary heading-display uppercase tracking-tight">{industry.name}</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed font-medium">{industry.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value Props Bar */}
      <section className="bg-primary text-white py-16 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <span className="text-[20vw] font-black leading-none heading-display uppercase select-none">VALUES.</span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueProps.map((vp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4 p-6 border border-white/10 hover:border-accent/50 transition-colors"
              >
                <vp.icon className="w-10 h-10 text-accent" />
                <h4 className="text-2xl font-black heading-display uppercase tracking-tight">{vp.title}</h4>
                <p className="text-white/60 leading-relaxed font-medium">{vp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12">
        <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-primary heading-display uppercase leading-none mb-8 max-w-3xl mx-auto">
          Ready to Optimize <br />
          <span className="text-accent">Your Supply Chain?</span>
        </h2>
        <p className="text-xl text-muted max-w-xl mx-auto mb-12 font-medium leading-relaxed">
          Speak with our solutions engineers for a customized logistics assessment. No obligation. Just expertise.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary text-lg px-10 py-4">GET ASSESSMENT</button>
          <button className="btn-secondary text-lg px-10 py-4 !border-primary !text-primary hover:!bg-primary hover:!text-white">VIEW CASE STUDIES</button>
        </div>
      </section>
    </div>
  );
}