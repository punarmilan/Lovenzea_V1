import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ icon: Icon = Inbox, title = 'No records found', message = 'There are no items to display at this moment.', action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl glass-card border-dashed border-slate-800 my-4">
      <div className="p-4 rounded-2xl bg-slate-800/80 text-rose-400 border border-slate-700/50 mb-4">
        <Icon size={32} />
      </div>
      <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
