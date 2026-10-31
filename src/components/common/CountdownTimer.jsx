import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ targetDate, label = 'Temps restant' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate || timeLeft.isExpired) {
    return null;
  }

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="inline-flex flex-col items-center p-4 bg-surface-pure/90 border border-surface-border rounded-2xl shadow-soft backdrop-blur-sm">
      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-red uppercase tracking-wider mb-2">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        <span>{label}</span>
      </div>

      <div className="flex items-center gap-2 text-content-title font-mono font-extrabold text-xl sm:text-2xl">
        <div className="flex flex-col items-center">
          <span className="bg-surface-subtle px-2 py-1 rounded-lg border border-surface-border">
            {formatNumber(timeLeft.days)}
          </span>
          <span className="text-[10px] font-sans font-medium text-content-muted mt-0.5">Jours</span>
        </div>

        <span className="text-slate-300 pb-3">:</span>

        <div className="flex flex-col items-center">
          <span className="bg-surface-subtle px-2 py-1 rounded-lg border border-surface-border">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-[10px] font-sans font-medium text-content-muted mt-0.5">Heures</span>
        </div>

        <span className="text-slate-300 pb-3">:</span>

        <div className="flex flex-col items-center">
          <span className="bg-surface-subtle px-2 py-1 rounded-lg border border-surface-border">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-[10px] font-sans font-medium text-content-muted mt-0.5">Minutes</span>
        </div>

        <span className="text-slate-300 pb-3">:</span>

        <div className="flex flex-col items-center">
          <span className="bg-surface-subtle px-2 py-1 rounded-lg border border-surface-border text-brand-red">
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className="text-[10px] font-sans font-medium text-content-muted mt-0.5">Secondes</span>
        </div>
      </div>
    </div>
  );
};
