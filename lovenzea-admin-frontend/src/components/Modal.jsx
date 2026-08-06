import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Box */}
      <div className={`relative w-full ${maxWidth} glass-panel bg-slate-900/95 rounded-3xl border border-slate-700/80 shadow-2xl shadow-black/80 my-8 overflow-hidden z-10 animate-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
