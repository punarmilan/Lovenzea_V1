import React, { useState, useEffect } from 'react';
import adminSubscriptionService from '../services/adminSubscriptionService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const SubscriptionManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationDays: 30,
    connects: 50,
    description: '',
    features: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await adminSubscriptionService.getAllPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      durationDays: 30,
      connects: 50,
      description: '',
      features: 'Direct Chat Access\nView Contact Numbers\nProfile Boost in Search\nDedicated Relationship Manager',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      price: plan.price || '',
      durationDays: plan.durationDays || 30,
      connects: plan.connects || 50,
      description: plan.description || '',
      features: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || ''),
      isActive: plan.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Please specify a plan title and price');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      durationDays: Number(formData.durationDays),
      connects: Number(formData.connects),
      features: typeof formData.features === 'string' 
        ? formData.features.split('\n').filter((f) => f.trim()) 
        : formData.features,
    };

    try {
      if (editingPlan) {
        await adminSubscriptionService.updatePlan(editingPlan.id, payload);
        toast.success('Subscription plan updated successfully');
      } else {
        await adminSubscriptionService.createPlan(payload);
        toast.success('New membership package created');
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error('Failed to save subscription plan');
    }
  };

  const handleDeletePlan = async (id, name) => {
    const result = await Swal.fire({
      title: 'Remove Plan?',
      text: `Are you sure you want to deactivate package "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Delete Plan',
      background: '#0f172a',
      color: '#f8fafc',
    });

    if (result.isConfirmed) {
      try {
        await adminSubscriptionService.deletePlan(id);
        toast.success('Plan deactivated');
        fetchPlans();
      } catch (err) {
        toast.error('Failed to delete plan');
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Membership Packages & Monetization</h2>
            <p className="text-xs text-slate-400">Configure premium matrimony tiers, connects allotment, and pricing</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Membership Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <LoadingSpinner text="Loading monetization tiers..." />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Membership Plans Configured"
          message="Create your first subscription tier to begin monetizing matchmaking features."
          action={
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Create First Plan
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const featuresList = Array.isArray(plan.features)
              ? plan.features
              : typeof plan.features === 'string'
              ? plan.features.split('\n')
              : [];

            return (
              <div
                key={plan.id}
                className="glass-card p-6 rounded-3xl space-y-5 border border-slate-800 flex flex-col justify-between relative group hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-4">
                  {/* Top info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white">{plan.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{plan.description || 'Premium Matrimony Access'}</p>
                    </div>
                    <Badge variant={plan.isActive !== false ? 'success' : 'default'} size="xs">
                      {plan.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">₹{plan.price}</span>
                    <span className="text-xs text-slate-400">/ {plan.durationDays} Days</span>
                  </div>

                  {/* Connects Allowance */}
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <Zap size={16} />
                    <span>{plan.connects || 0} Direct Connection Credits</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    {featuresList.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-300">
                        <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          <Check size={12} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(plan)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Plan"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id, plan.name)}
                    className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition-colors cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
        subtitle="Configure duration, price, and member benefits"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Package Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Gold Matrimony 3 Months"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Price (INR ₹)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1999"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Duration (Days)</label>
              <input
                type="number"
                required
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                placeholder="90"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Connects Allotted</label>
              <input
                type="number"
                required
                value={formData.connects}
                onChange={(e) => setFormData({ ...formData, connects: e.target.value })}
                placeholder="50"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Most popular plan with verified match recommendations"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Features Checklist (1 per line)</label>
            <textarea
              rows={4}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Direct Chat Access&#10;View Contact Numbers&#10;Profile Boost in Search"
              className="w-full p-3 rounded-xl glass-input text-xs font-medium"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-rose-950/40"
            >
              Save Package
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionManagement;
