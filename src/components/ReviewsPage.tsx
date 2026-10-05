import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Package, Globe, ShieldCheck, Clock, Quote, Send, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { api } from '../api';

interface ReviewItem {
  id: string;
  userId?: string;
  userName: string;
  role?: string;
  targetId?: string;
  targetType?: 'shipment' | 'flight';
  rating: number;
  comment: string;
  createdAt?: string;
}

const defaultReviews: ReviewItem[] = [
  { id: 'd1', userName: "Robert Chen", role: "Logistics Director", comment: "SwiftTrack has revolutionized how we manage our high-value electronics shipments. The real-time visibility is unmatched.", rating: 5 },
  { id: 'd2', userName: "Sarah Jenkins", role: "E-commerce Founder", comment: "The most reliable logistics partner we've ever worked with. Their customer support is proactive and extremely helpful.", rating: 5 },
  { id: 'd3', userName: "Marcus Thorne", role: "Global Operations", comment: "Security was our main concern for luxury goods. SwiftTrack's secure storage and tracking gave us complete peace of mind.", rating: 5 },
  { id: 'd4', userName: "Elena Rodriguez", role: "Supply Chain Manager", comment: "The dashboard is incredibly intuitive. I can manage hundreds of shipments across continents with just a few clicks.", rating: 5 },
  { id: 'd5', userName: "David Kim", role: "Tech CEO", comment: "Fast, secure, and professional. SwiftTrack is our go-to for all international hardware deliveries.", rating: 5 },
  { id: 'd6', userName: "Aisha Al-Fayed", role: "Import/Export Specialist", comment: "Navigating customs used to be a nightmare. With SwiftTrack, it's handled automatically. Truly a game-changer.", rating: 5 },
  { id: 'd7', userName: "Thomas Müller", role: "Manufacturing Lead", comment: "Precision is key in our industry. SwiftTrack's time-sensitive delivery has never let us down.", rating: 5 },
  { id: 'd8', userName: "Linda Wu", role: "Retail Chain Owner", comment: "The cost-to-value ratio is excellent. We've seen a significant drop in lost consignments since switching.", rating: 5 },
  { id: 'd9', userName: "James Wilson", role: "Art Gallery Curator", comment: "Shipping priceless art requires extreme care. SwiftTrack's specialized handling is the best in the business.", rating: 5 },
  { id: 'd10', userName: "Sofia Conti", role: "Fashion Designer", comment: "Getting our collections to global runways on time is critical. SwiftTrack is our most trusted partner.", rating: 5 },
];

export default function ReviewsPage() {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<ReviewItem[]>(defaultReviews);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', userName: '' });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await api.reviews.list();
        if (data && data.length > 0) {
          const mapped = data.map((r: any) => ({
            id: r.id,
            userId: r.userId,
            userName: r.userName,
            targetId: r.targetId,
            targetType: r.targetType,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt
          }));
          setReviews([...mapped, ...defaultReviews]);
        }
      } catch (e) {
        // keep defaults
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName.trim() || !newReview.comment.trim()) return;
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      await api.reviews.create({
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        targetType: 'shipment',
        targetId: 'general',
        userId: 'public'
      });
      setReviews(prev => [{
        id: Date.now().toString(),
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      }, ...prev]);
      setNewReview({ rating: 5, comment: '', userName: '' });
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-24 sm:gap-40 py-12">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-micro text-accent tracking-[0.2em]">{t('reviews.title')}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl sm:text-9xl font-black tracking-tighter text-primary leading-[0.85] heading-display uppercase"
          >
            {t('reviews.heading').split(' ').slice(0, -2).join(' ')} <br />
            <span className="text-muted/30 italic font-serif lowercase">{t('reviews.heading').split(' ').slice(-1).join('').replace('.', '')}</span>.
          </motion.h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-8 pb-4"
        >
          <p className="text-xl sm:text-2xl text-muted leading-relaxed font-medium max-w-xl">
            Don't just take our word for it. Here's what our global partners and clients have to say about SwiftTrack's logistics solutions.
          </p>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-primary/10">
        {reviews.map((review, i) => (
          <motion.div 
            key={review.id || i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: (i % 3) * 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-12 flex flex-col gap-10 border-r border-b border-primary/10 last:border-r-0 group hover:bg-primary transition-all duration-500"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 text-accent fill-accent" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-primary/10 group-hover:text-white/10 transition-colors" />
            </div>
            <p className="text-2xl font-medium text-primary group-hover:text-white leading-relaxed italic font-serif transition-colors">
              "{review.comment}"
            </p>
            <div className="flex items-center gap-5 mt-auto pt-8 border-t border-primary/5 group-hover:border-white/10 transition-colors">
              <div className="w-12 h-12 bg-primary group-hover:bg-accent flex items-center justify-center text-white text-sm font-black transition-colors">
                {review.userName?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="font-black text-primary group-hover:text-white text-sm uppercase tracking-widest transition-colors">{review.userName}</span>
                {review.role && <span className="text-micro text-muted group-hover:text-white/60 uppercase transition-colors">{review.role}</span>}
                {review.createdAt && <span className="text-micro text-muted/50 font-mono group-hover:text-white/40 transition-colors">{new Date(review.createdAt).toLocaleDateString()}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Submit Review Section */}
      <section className="bg-white border border-primary/5 p-8 sm:p-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-micro text-accent tracking-[0.2em]">SUBMIT A REVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-primary heading-display uppercase">
            Share Your <span className="text-accent">Experience</span>.
          </h2>
          <form onSubmit={handleSubmitReview} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Your Name</label>
              <input 
                type="text" required
                value={newReview.userName} onChange={e => setNewReview({...newReview, userName: e.target.value})}
                placeholder="e.g. John Smith"
                className="input-modern py-3 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star className={`w-8 h-8 ${star <= newReview.rating ? 'text-accent fill-accent' : 'text-border'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Your Review</label>
              <textarea 
                required
                value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Tell us about your experience with SwiftTrack..."
                className="input-modern py-3 text-sm min-h-[150px] resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary py-3 px-8"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Review
              </button>
              {submitStatus === 'success' && (
                <span className="text-sm font-bold text-emerald-600">Review submitted successfully!</span>
              )}
              {submitStatus === 'error' && (
                <span className="text-sm font-bold text-rose-600">Failed to submit. Please try again.</span>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        <div className="bg-primary text-white p-12 sm:p-24 flex flex-col justify-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <span className="text-[20vw] font-black leading-none heading-display uppercase select-none">JOIN.</span>
          </div>
          <div className="relative z-10 flex flex-col gap-8">
            <span className="text-micro text-accent tracking-[0.2em]">GET STARTED</span>
            <h2 className="text-5xl sm:text-7xl font-black tracking-tighter heading-display uppercase leading-none">
              Join our network of <br />
              <span className="text-white/30 italic font-serif lowercase">satisfied</span> clients.
            </h2>
            <p className="text-xl text-white/60 max-w-xl font-medium leading-relaxed">
              Experience the SwiftTrack difference today. Secure, transparent, and global logistics for the modern world.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 relative z-10">
            <a href="/login" className="btn-primary">Get Started Now</a>
            <a href="/track" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-primary">Track Shipment</a>
          </div>
        </div>
        <div className="bg-accent p-12 sm:p-24 flex flex-col justify-center items-center text-center gap-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-48 h-48 border-2 border-white/30 rounded-full flex items-center justify-center relative"
          >
            <div className="absolute inset-0 border border-white/10 rounded-full scale-125"></div>
            <Package className="w-20 h-20 text-white" />
          </motion.div>
          <div className="flex flex-col gap-4">
            <span className="text-5xl sm:text-8xl font-black text-white heading-display tracking-tighter">99.9%</span>
            <span className="text-micro text-white/60 tracking-[0.3em] font-mono">DELIVERY SUCCESS RATE</span>
          </div>
        </div>
      </section>
    </div>
  );
}
