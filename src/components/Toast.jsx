import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className="toast-message">
        <Sparkles size={18} color="#F4D9E8" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
