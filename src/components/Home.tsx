import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, ShieldCheck, Clock, Globe, Search, Loader2, Plane, Truck, Zap, MapPin, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../i18n';

const GlobeWithPlane = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 0.2, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
            className="absolute w-64 h-64 border border-primary/20 rounded-full"
          />
        ))}
      </div>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="relative w-64 h-64 sm:w-96 sm:h-96 rounded-full border border-primary/10 flex items-center justify-center bg-white/5 shadow-[0_0_50px_rgba(0,0,0,0.05)]"
      >
        <Globe className="w-32 h-32 sm:w-48 sm:h-48 text-primary/10" />
      </motion.div>

      <motion.div
        initial={{ x: -200, y: 100, opacity: 0, rotate: -45 }}
        animate={{ x: [ -200, 0, 200 ], y: [ 100, -100, -200 ], opacity: [ 0, 1, 0 ] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute z-20 text-accent"
      >
        <Plane className="w-12 h-12 fill-accent" />
      </motion.div>
    </div>
  );
};

export default function Home({ user }: { user?: any }) {
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleTrack = (e: FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setIsSubmitting(true);
    navigate(`/track?id=${trackingId.trim().toUpperCase()}`);
  };

  return (
    <div className="flex flex-col relative overflow-hidden bg-[#F8F9FA] bg-atmosphere">
      {/* Hero */}
      <section className="min-h-screen flex flex-col lg:flex-row border-b border-border">
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-16 lg:p-24 border-r border-border">
          <div className="section-label mb-12">{t('home.subtitle')}</div>
          <h1 className="text-7xl sm:text-8xl lg:text-[10vw] font-black text-primary heading-display mb-12">
            {t('home.title1')} <br />
            <span className="text-accent italic">{t('home.title2')}</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-lg leading-relaxed font-medium mb-12">
            {t('home.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/track" className="btn-primary">
              {t('home.trackBtn')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to={user ? "/dashboard" : "/login"} className="btn-secondary">
              {t('home.startBtn')}
            </Link>
          </div>
        </div>

        <div className="flex-1 relative bg-white flex items-center justify-center p-12 overflow-hidden">
          <div className="w-full h-full max-w-2xl aspect-square">
            <GlobeWithPlane />
          </div>
        </div>
      </section>

      {/* Quick Track */}
      <section className="bg-white border-b border-border py-12 px-8 sm:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex flex-col gap-2 min-w-[300px]">
            <span className="section-label">{t('home.quickTrackLabel')}</span>
            <h2 className="text-3xl font-bold heading-display italic">{t('home.quickTrack')}</h2>
          </div>
          <form onSubmit={handleTrack} className="flex-1 w-full flex flex-col sm:flex-row gap-1">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder={t('home.trackPlaceholder')}
                className="input-modern pl-12"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[200px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('home.trackNow')}
            </button>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border py-16 px-8 sm:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: t('home.stats.established'), value: "2010" },
            { label: t('home.stats.hubs'), value: "36" },
            { label: t('home.stats.countries'), value: "180+" },
            { label: t('home.stats.consignments'), value: "1M+" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-2"
            >
              <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{stat.label}</span>
              <span className="text-4xl sm:text-5xl font-black text-primary heading-display tracking-tighter">{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why SwiftTrack */}
      <section className="bg-white border-b border-border py-24 px-8 sm:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-accent"></div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">WHY SWIFTTRACK</span>
            </div>
            <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-primary heading-display uppercase leading-none">
              {t('home.whyTitle')} <br />
              <span className="text-muted/30 italic font-serif lowercase">Trusted worldwide</span>.
            </h2>
            <p className="text-xl text-muted leading-relaxed font-medium max-w-xl">
              {t('home.whyDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: MapPin, title: t('home.feature1Title'), desc: t('home.feature1Desc') },
              { icon: ShieldCheck, title: t('home.feature2Title'), desc: t('home.feature2Desc') },
              { icon: Globe, title: t('home.feature3Title'), desc: t('home.feature3Desc') },
              { icon: BarChart3, title: t('home.feature4Title'), desc: t('home.feature4Desc') },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 border border-primary/5 hover:border-accent/30 transition-all duration-500 bg-[#F8F9FA]"
              >
                <div className="flex flex-col gap-6">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-black text-primary heading-display uppercase tracking-tight group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-white py-24 px-8 sm:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <span className="text-[20vw] font-black leading-none heading-display uppercase select-none">GO.</span>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-6 max-w-xl">
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">READY TO SHIP?</span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter heading-display uppercase leading-none">
              Start Tracking <br />
              <span className="text-white/30 italic font-serif lowercase">Today</span>.
            </h2>
            <p className="text-lg text-white/60 leading-relaxed font-medium">
              Join thousands of businesses who trust SwiftTrack for secure, transparent, and reliable logistics.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link to={user ? "/dashboard" : "/login"} className="btn-primary text-lg px-10 py-4 text-center">
              {t('home.startBtn')} <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <Link to="/services" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-primary text-lg px-10 py-4 text-center">
              View Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}