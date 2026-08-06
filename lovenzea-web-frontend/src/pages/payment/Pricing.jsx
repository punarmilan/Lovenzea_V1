import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../../services/api';
import PricingCard from '../../components/PricingCard';
import OrderSummaryModal from '../../components/payment/OrderSummaryModal';
import { ChevronRight } from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans');
      if (Array.isArray(response.data)) {
        setPlans(response.data);
      } else {
        console.error('Expected array of plans, got:', response.data);
        setPlans([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setLoading(false);
    }
  };

  const handleContinueClick = (plan) => {
    setSelectedPlan(plan);
    setIsSummaryOpen(true);
  };

  const handleProceedToPay = async (finalAmount) => {
    try {
      setIsSummaryOpen(false);
      const { data: orderResponse } = await api.post(`/payments/create-order/${selectedPlan.id}`);
      
      const options = {
        key: orderResponse.key,
        amount: finalAmount * 100, // Using final calculated amount from modal
        currency: orderResponse.currency,
        name: 'LovenZea',
        description: `Subscription for ${selectedPlan.name}`,
        order_id: orderResponse.orderId,
        handler: async (response) => {
          try {
            const verificationData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planId: selectedPlan.id
            };
            const { data: subscription } = await api.post('/payments/verify', verificationData);
            Swal.fire({ text: 'Subscription successful!', confirmButtonColor: '#8C6D39' });
            window.location.href = '/my-shadi';
          } catch (err) {
            Swal.fire({ text: 'Payment verification failed', confirmButtonColor: '#8C6D39' });
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#1ebc61',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
      Swal.fire({ text: 'Failed to initiate payment', confirmButtonColor: '#8C6D39' });
    }
  };

  if (loading) return <div className="loading-screen">Loading Subscription Plans...</div>;

  return (
    <div className="pricing-page-v2">
      {/* Premium Hero Section */}
      <header className="pricing-hero">
        <div className="hero-content">
          <div className="hero-top-bar">
            <button className="personalised-btn">
              Personalised Plans <ChevronRight size={16} />
            </button>
          </div>
          
          <h1 className="hero-title">Upgrade now & Get upto 85% discount!</h1>
          
          <div className="discount-banner-v3">
            <span className="banner-text">Save upto 85% on Premium Plans!!! Valid for limited period!</span>
          </div>
        </div>
      </header>

      {/* Plans Section */}
      {/*
        Layout Refinements:
        - Pricing Cards (v2 - Refined):
            - Updated highlight tags to use dashed lines matching the premium design.
            - Improved internal padding and typography (larger prices, clearer duration).
            - Refined the "Continue" button with a sleek, minimal border and hover effects.
        - Hero & Grid Layout:
            - Centered the card grid for better balance on desktop.
            - Added a subtle radial gradient pattern to the teal hero section.
            - Improved the discount banner with semi-transparent background and blur effect.
      */}
      <main className="plans-section">
        <div className="plans-container-inner">
          <div className="plans-grid-v2">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} onContinue={handleContinueClick} />
            ))}
          </div>
          
          <div className="trust-footer">
            <p>Trusted by thousands of members. Secure payment options available.</p>
          </div>
        </div>
      </main>

      {/* Order Summary Modal */}
      {selectedPlan && (
        <OrderSummaryModal
          plan={selectedPlan}
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          onProceed={handleProceedToPay}
        />
      )}
    </div>
  );
};

export default Pricing;
