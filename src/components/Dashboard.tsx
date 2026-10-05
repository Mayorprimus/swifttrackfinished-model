import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Shipment, UserProfile } from '../types';
import { Package, Search, User, Mail, Calendar, Shield, Hash, Plus, CheckCircle2, AlertCircle, MapPin, Activity, Plane, ArrowRight, BarChart3, Clock, TrendingUp, Box, Truck, Globe, MessageSquare, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';

interface DashboardProps {
  profile: UserProfile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [claimTracking, setClaimTracking] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'shipments' | 'flights' | 'support'>('shipments');
  const [tickets, setTickets] = useState<any[]>([]);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [sendingSupport, setSendingSupport] = useState(false);
  const [supportStatus, setSupportStatus] = useState<'success' | 'error' | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      try {
        const [sData, fData, tData] = await Promise.all([
          api.shipments.list(),
          api.flights.list(),
          api.supportTickets.list()
        ]);
        const filteredShipments = sData.filter(s => 
          s.senderId === profile.uid || 
          s.senderEmail === profile.email || 
          s.receiverEmail === profile.email
        );
        const filteredFlights = fData.filter(f => f.userIds && f.userIds.includes(profile.uid));
        const filteredTickets = (tData || []).filter((t: any) => 
          t.userEmail === profile.email || t.email === profile.email
        );
        setShipments(filteredShipments);
        setFlights(filteredFlights);
        setTickets(filteredTickets);
        setLastRefreshed(new Date());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [profile]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !claimTracking) return;
    
    setClaiming(true);
    setClaimStatus(null);
    
    try {
      try {
        const shipmentData = await api.shipments.list();
        const searchVal = claimTracking.trim().toUpperCase();
        const shipment = shipmentData.find(s => 
          (s.trackingNumber && s.trackingNumber.toUpperCase() === searchVal) || 
          (s.id && s.id.toUpperCase() === searchVal)
        );
        
        if (shipment) {
          await api.shipments.claim(shipment.id);
          setClaimStatus({ type: 'success', message: t('dash.claimSuccess') });
        } else {
          const flightData = await api.flights.list();
          const flight = flightData.find(f => 
            (f.flightNumber && f.flightNumber.toUpperCase() === searchVal) || 
            (f.id && f.id.toUpperCase() === searchVal)
          );
          
          if (flight) {
            await api.flights.claim(flight.id);
            setClaimStatus({ type: 'success', message: t('dash.claimSuccess') });
          } else {
            setClaimStatus({ type: 'error', message: t('dash.notFound') });
            setClaiming(false);
            return;
          }
        }
      } catch (err: any) {
        setClaimStatus({ type: 'error', message: err.message || t('dash.claimError') });
        setClaiming(false);
        return;
      }
      
      setClaimTracking('');
      const [sData, fData] = await Promise.all([
        api.shipments.list(),
        api.flights.list()
      ]);
      const filteredShipments = sData.filter(s => 
        s.senderId === profile.uid || 
        s.senderEmail === profile.email || 
        s.receiverEmail === profile.email
      );
      const filteredFlights = fData.filter(f => f.userIds && f.userIds.includes(profile.uid));
      setShipments(filteredShipments);
      setFlights(filteredFlights);
    } catch (error: any) {
      setClaimStatus({ type: 'error', message: error.message || t('dash.claimError') });
    } finally {
      setClaiming(false);
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'warehouse': return 25;
      case 'carrier-1': return 40;
      case 'carrier-2': return 55;
      case 'carrier-3': return 70;
      case 'customs': return 85;
      case 'shipped': return 95;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      case 'In Transit': return 55;
      case 'Out for Delivery': return 90;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('deliver')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (s.includes('cancel')) return 'text-rose-600 bg-rose-50 border-rose-200';
    if (s.includes('transit')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (s.includes('customs')) return 'text-purple-600 bg-purple-50 border-purple-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getBarColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('deliver')) return 'bg-emerald-500';
    if (s.includes('cancel')) return 'bg-rose-500';
    if (s.includes('transit')) return 'bg-blue-500';
    if (s.includes('customs')) return 'bg-purple-500';
    return 'bg-amber-500';
  };

  const filteredShipments = shipments.filter(s => 
    s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.receiverName && s.receiverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalShipments = shipments.length;
  const inTransit = shipments.filter(s => {
    const st = (s.status || '').toLowerCase();
    return st.includes('transit') || st.includes('carrier') || st.includes('customs') || st.includes('warehouse');
  }).length;
  const delivered = shipments.filter(s => (s.status || '').toLowerCase().includes('deliver')).length;

  const refreshData = async () => {
    setLoading(true);
    try {
      const [sData, fData, tData] = await Promise.all([
        api.shipments.list(),
        api.flights.list(),
        api.supportTickets.list()
      ]);
      const filteredShipments = sData.filter(s => 
        s.senderId === profile?.uid || 
        s.senderEmail === profile?.email || 
        s.receiverEmail === profile?.email
      );
      const filteredFlights = fData.filter(f => f.userIds && f.userIds.includes(profile?.uid));
      const filteredTickets = (tData || []).filter((t: any) => 
        t.userEmail === profile?.email || t.email === profile?.email
      );
      setShipments(filteredShipments);
      setFlights(filteredFlights);
      setTickets(filteredTickets);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !supportForm.subject.trim() || !supportForm.message.trim()) return;
    setSendingSupport(true);
    setSupportStatus(null);
    try {
      const newTicket = await api.supportTickets.create({
        name: profile.name,
        email: profile.email,
        userName: profile.name,
        userEmail: profile.email,
        subject: supportForm.subject,
        message: supportForm.message,
        status: 'open'
      });
      setTickets(prev => [newTicket, ...prev]);
      setSupportForm({ subject: '', message: '' });
      setSupportStatus('success');
      setTimeout(() => setSupportStatus(null), 3000);
    } catch (error) {
      setSupportStatus('error');
      setTimeout(() => setSupportStatus(null), 3000);
    } finally {
      setSendingSupport(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-12 animate-fade-in py-4 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-accent"></div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{t('dash.title')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-primary heading-display">
            {t('dash.welcome')}, <span className="text-accent">{profile?.name?.split(' ')[0] || 'User'}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">{t('dash.status')}</span>
            <span className="text-xs font-mono font-bold text-primary">{format(lastRefreshed, 'HH:mm:ss')}</span>
          </div>
          <button 
            onClick={refreshData}
            className="btn-secondary !py-2.5 !px-5 !text-[10px] flex items-center gap-2"
          >
            <Activity className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {t('dash.sync')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dash.totalShipments'), value: totalShipments, icon: Box, color: 'text-primary', bg: 'bg-primary/5' },
          { label: t('dash.activeShipments'), value: inTransit, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('dash.delivered'), value: delivered, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: t('dash.flights'), value: flights.length, icon: Plane, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-primary/5 p-5 sm:p-6 flex flex-col gap-3 hover:border-accent/20 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{stat.label}</span>
              <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-black text-primary heading-display tracking-tighter">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left Column: Account & Claim */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Account Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-primary text-white p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 opacity-5">
              <span className="text-[8vw] font-black leading-none heading-display uppercase select-none">ID.</span>
            </div>
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-xl heading-display">
                  {profile?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white/60 uppercase tracking-widest">{t('dash.account')}</span>
                  <span className="text-lg font-black heading-display">{profile?.name}</span>
                </div>
              </div>
              <div className="h-[1px] bg-white/10"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('dash.customerId')}</span>
                  <span className="text-sm font-mono font-bold text-accent">{profile?.customerID || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('dash.accountType')}</span>
                  <span className="text-sm font-bold uppercase">{profile?.role}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('dash.email')}</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-sm font-medium text-white/80 truncate">{profile?.email}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('dash.joined')}</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-sm font-medium text-white/80">
                    {profile?.createdAt ? format(new Date(profile.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Claim Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-primary/5 p-6 sm:p-8 flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-primary heading-display uppercase tracking-tight">{t('dash.claim')}</h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('dash.claimDesc')}</p>
              </div>
            </div>
            <form onSubmit={handleClaim} className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text" 
                  value={claimTracking}
                  onChange={(e) => setClaimTracking(e.target.value)}
                  placeholder={t('dash.claimPlaceholder')}
                  className="input-modern pl-10 py-3 text-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={claiming}
                className="btn-primary py-3 text-xs w-full"
              >
                {claiming ? (
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> {t('dash.claiming')}
                  </span>
                ) : t('dash.claimBtn')}
              </button>
              <AnimatePresence>
                {claimStatus && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-xl flex items-center gap-2 text-xs font-bold ${
                      claimStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {claimStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {claimStatus.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Shipments & Flights */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Tab Switcher */}
          <div className="flex border-b border-primary/10">
            {[
              { id: 'shipments' as const, label: t('dash.shipments'), icon: Package, count: filteredShipments.length },
              { id: 'flights' as const, label: t('dash.flights'), icon: Plane, count: flights.length },
              { id: 'support' as const, label: 'Support', icon: MessageSquare, count: tickets.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-accent text-primary'
                    : 'border-transparent text-muted hover:text-primary hover:border-primary/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${
                  activeTab === tab.id ? 'bg-accent/10 text-accent' : 'bg-primary/5 text-muted'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder={t('dash.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern pl-12 py-3 text-sm"
            />
          </div>

          {/* Shipments Tab */}
          {activeTab === 'shipments' && (
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="py-16 text-center flex flex-col items-center gap-4">
                  <Activity className="w-8 h-8 text-muted/30 animate-spin" />
                  <p className="text-sm font-bold text-muted uppercase tracking-widest">{t('dash.loading')}</p>
                </div>
              ) : filteredShipments.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-primary/10 flex flex-col items-center gap-4">
                  <Package className="w-12 h-12 text-primary/10" />
                  <p className="text-sm font-bold text-muted uppercase tracking-widest">{t('dash.noShipments')}</p>
                  <p className="text-xs text-muted/60">{t('dash.claimHint')}</p>
                </div>
              ) : (
                filteredShipments.map((shipment, i) => (
                  <motion.div
                    key={shipment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-primary/5 hover:border-accent/20 p-5 sm:p-6 flex flex-col gap-5 transition-all duration-300 group"
                  >
                    {/* Top row: Tracking + Status */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('dash.trackingNumber')}</span>
                        <span className="font-mono font-black text-lg text-primary">{shipment.trackingNumber}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-lg border ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase tracking-widest">
                        <span>{t('dash.progress')}</span>
                        <span className="font-mono">{getStatusProgress(shipment.status)}%</span>
                      </div>
                      <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${getStatusProgress(shipment.status)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${getBarColor(shipment.status)}`}
                        />
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-primary/5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('dash.receiver')}</span>
                        <span className="text-sm font-bold text-primary">{shipment.receiverName}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('dash.destination')}</span>
                        <span className="text-sm font-bold text-primary truncate">{shipment.destination || shipment.receiverAddress}</span>
                      </div>
                      {shipment.estimatedDelivery && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">ETA</span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span className="text-sm font-bold text-accent">{format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <a 
                      href={`/tracking?id=${shipment.trackingNumber}`}
                      className="flex items-center justify-center gap-2 py-3 border border-primary/10 text-[10px] font-black text-primary hover:text-accent hover:border-accent/30 transition-all uppercase tracking-widest"
                    >
                      {t('dash.viewDetails')} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Flights Tab */}
          {activeTab === 'flights' && (
            <div className="flex flex-col gap-4">
              {flights.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-primary/10 flex flex-col items-center gap-4">
                  <Plane className="w-12 h-12 text-primary/10" />
                  <p className="text-sm font-bold text-muted uppercase tracking-widest">{t('dash.noFlights')}</p>
                  <p className="text-xs text-muted/60">{t('dash.claimHint')}</p>
                </div>
              ) : (
                flights.map((flight, i) => (
                  <motion.div
                    key={flight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-primary/5 hover:border-accent/20 p-5 sm:p-6 flex flex-col gap-5 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Flight</span>
                        <span className="font-mono font-black text-lg text-primary">{flight.flightNumber}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-lg border ${
                        flight.status === 'arrived' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 
                        flight.status === 'delayed' ? 'text-amber-600 bg-amber-50 border-amber-200' : 
                        'text-blue-600 bg-blue-50 border-blue-200'
                      }`}>
                        {flight.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('dash.origin')}</span>
                        <span className="text-sm font-bold text-primary">{flight.origin}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4">
                        <div className="h-[1px] w-8 bg-primary/20"></div>
                        <Plane className="w-5 h-5 text-accent" />
                        <div className="h-[1px] w-8 bg-primary/20"></div>
                      </div>
                      <div className="flex flex-col flex-1 items-end">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('dash.dest')}</span>
                        <span className="text-sm font-bold text-primary">{flight.destination}</span>
                      </div>
                    </div>
                    <a 
                      href={`/tracking?id=${flight.flightNumber}&type=flight`}
                      className="flex items-center justify-center gap-2 py-3 border border-primary/10 text-[10px] font-black text-primary hover:text-accent hover:border-accent/30 transition-all uppercase tracking-widest"
                    >
                      {t('dash.trackLive')} <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-primary/5 p-6 sm:p-8 flex flex-col gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Send className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-black text-primary heading-display uppercase tracking-tight">Contact Support</h3>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Send us a message</p>
                  </div>
                </div>
                <form onSubmit={handleSendSupport} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Subject</label>
                    <input 
                      type="text" required
                      value={supportForm.subject} onChange={e => setSupportForm({...supportForm, subject: e.target.value})}
                      placeholder="Brief description of your issue"
                      className="input-modern py-3 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Message</label>
                    <textarea 
                      required
                      value={supportForm.message} onChange={e => setSupportForm({...supportForm, message: e.target.value})}
                      placeholder="Describe your issue in detail..."
                      className="input-modern py-3 text-sm min-h-[120px] resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="submit" disabled={sendingSupport} className="btn-primary py-3 px-8">
                      {sendingSupport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send Message
                    </button>
                    {supportStatus === 'success' && (
                      <span className="text-sm font-bold text-emerald-600">Message sent successfully!</span>
                    )}
                    {supportStatus === 'error' && (
                      <span className="text-sm font-bold text-rose-600">Failed to send. Please try again.</span>
                    )}
                  </div>
                </form>
              </motion.div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-accent"></div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Your Tickets ({tickets.length})</span>
                </div>
                {tickets.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-primary/10 flex flex-col items-center gap-4">
                    <MessageSquare className="w-12 h-12 text-primary/10" />
                    <p className="text-sm font-bold text-muted uppercase tracking-widest">No support tickets yet</p>
                    <p className="text-xs text-muted/60">Send us a message above and we'll get back to you.</p>
                  </div>
                ) : (
                  tickets.map((ticket, i) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-primary/5 p-5 sm:p-6 flex flex-col gap-4 hover:border-accent/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            ticket.status === 'open' ? 'bg-amber-500 animate-pulse' : 
                            ticket.status === 'pending' ? 'bg-blue-500' : 'bg-emerald-500'
                          }`} />
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-primary heading-display uppercase">{ticket.subject}</span>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                              {ticket.status} · {ticket.createdAt ? format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm') : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="font-mono text-sm text-muted leading-relaxed border-l-2 border-primary/10 pl-4 py-2">
                        {ticket.message}
                      </div>
                      {ticket.reply && (
                        <div className="bg-primary/5 border border-primary/10 p-4 flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Admin Reply</span>
                          <p className="text-sm text-primary font-medium">{ticket.reply}</p>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}