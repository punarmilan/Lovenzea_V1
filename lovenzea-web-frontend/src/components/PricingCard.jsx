import React from 'react';
import { Check } from 'lucide-react';
import './PricingCard.css';

const PricingCard = ({ plan, onContinue }) => {
  const features = plan.features ? plan.features.split(',') : [];
  const monthlyPrice = Math.round(plan.price / (plan.durationInDays / 30));
  const originalPrice = plan.discountPercentage > 0 
    ? Math.round(plan.price / (1 - (plan.discountPercentage / 100)))
    : null;

  return (
    <div className={`pricing-card-v2 ${plan.highlightTag ? 'has-highlight' : ''}`}>
      {plan.highlightTag && (
        <div className="highlight-tag-wrapper">
          <div className="line-dec"></div>
          <span className="highlight-text">{plan.highlightTag}</span>
          <div className="line-dec"></div>
        </div>
      )}
      
      <div className="card-content">
        <div className="plan-header">
          <h3 className="plan-title">
            <span>{plan.name}</span>
            <span className="duration-text">{plan.durationLabel || `${plan.durationInDays / 30} Months`}</span>
          </h3>
        </div>

        <div className="price-box">
          {plan.discountPercentage > 0 && (
            <div className="discount-row">
              <span className="percent-off">{plan.discountPercentage}% off</span>
              <span className="old-price">₹{originalPrice}</span>
            </div>
          )}
          <div className="main-price">
            <span className="currency-symbol">₹</span>
            <span className="price-val">{plan.price}</span>
          </div>
          <p className="per-month">₹{monthlyPrice} per month</p>
        </div>

        <button className="plan-continue-btn" onClick={() => onContinue(plan)}>
          Continue
        </button>

        <p className="auto-renew-info">Auto-renews on expiry. Cancel anytime.</p>

        <div className="divider-line"></div>

        <ul className="plan-features">
          {features.map((feature, index) => (
            <li key={index} className="feature-row">
              <Check size={14} className="feature-check" />
              <span className="feature-text">{feature.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PricingCard;
