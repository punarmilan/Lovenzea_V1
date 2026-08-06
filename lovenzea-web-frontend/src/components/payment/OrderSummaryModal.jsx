import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Info } from 'lucide-react';
import './OrderSummaryModal.css';

const OrderSummaryModal = ({ plan, isOpen, onClose, onProceed }) => {
  const [addons, setAddons] = useState([
    { id: 'contacts', label: 'Add 20 extra Contact nos.', price: 255, checked: false },
    { id: 'promote', label: 'Promote my Profile', price: 339, checked: false, info: true },
    { id: 'contribute', label: 'Contribute to LovenZea.org', price: 17, checked: true, info: true },
  ]);

  if (!isOpen) return null;

  const originalPrice = plan.discountPercentage > 0 
    ? Math.round(plan.price / (1 - (plan.discountPercentage / 100)))
    : plan.price;
  
  const savings = originalPrice - plan.price;
  
  const toggleAddon = (id) => {
    setAddons(addons.map(addon => 
      addon.id === id ? { ...addon, checked: !addon.checked } : addon
    ));
  };

  const addonsTotal = addons
    .filter(a => a.checked)
    .reduce((sum, a) => sum + a.price, 0);

  const totalAmount = plan.price + addonsTotal;

  return createPortal(
    <div className="order-summary-overlay" onClick={onClose}>
      <div className="order-summary-content animate-modal dashboard-card-bg" onClick={e => e.stopPropagation()}>
        <div className="summary-header">
          <h2 className="summary-title">Order Summary</h2>
          <button className="close-summary" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="summary-body">
          <div className="summary-row main-plan">
            <span className="row-label">{plan.name} ({plan.durationLabel || `${plan.durationInDays / 30} months`})</span>
            <span className="row-value">₹{originalPrice.toLocaleString()}</span>
          </div>

          <div className="summary-row savings-row">
            <span className="row-label success-text">Savings ({plan.discountPercentage}% off)</span>
            <span className="row-value success-text">-₹{savings.toLocaleString()}</span>
          </div>

          <div className="addons-section">
            {addons.map(addon => (
              <div key={addon.id} className="addon-row">
                <div className="addon-left">
                  <input 
                    type="checkbox" 
                    id={addon.id} 
                    checked={addon.checked} 
                    onChange={() => toggleAddon(addon.id)}
                  />
                  <label htmlFor={addon.id}>{addon.label}</label>
                  {addon.info && <Info size={14} className="info-icon" />}
                </div>
                <span className="addon-price">₹{addon.price}</span>
              </div>
            ))}
          </div>

          <div className="total-section">
            <span className="total-label">Total Amount</span>
            <span className="total-value">₹{totalAmount.toLocaleString()}</span>
          </div>

          <div className="savings-highlight">
            <span className="emoji">🎉</span>
            You are saving ₹{savings.toLocaleString()} on this order
            <span className="emoji">🎉</span>
          </div>

          <button className="proceed-btn" onClick={() => onProceed(totalAmount)}>
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OrderSummaryModal;
