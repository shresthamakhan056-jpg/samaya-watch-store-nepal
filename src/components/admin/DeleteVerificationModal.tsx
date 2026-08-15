import React, { useState, useEffect, useRef } from 'react';
import { Trash2, AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2, X, Clock, Lock, Unlock, AlertOctagon } from 'lucide-react';

export interface DeleteVerificationModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: string;
  detailsText?: string;
  requiredTimes?: number; // Total verification steps (default: 3)
  lockDurationSeconds?: number; // Timed lock duration before final step enables (default: 3)
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteVerificationModal: React.FC<DeleteVerificationModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType = 'Record',
  detailsText,
  requiredTimes = 3,
  lockDurationSeconds = 3,
  onClose,
  onConfirm,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [countdown, setCountdown] = useState<number>(lockDurationSeconds);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Reset states whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCountdown(lockDurationSeconds);
      setIsUnlocked(false);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, lockDurationSeconds]);

  // When reaching the final step, start the security countdown timer
  useEffect(() => {
    if (isOpen && currentStep === requiredTimes) {
      setIsUnlocked(false);
      setCountdown(lockDurationSeconds);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsUnlocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, currentStep, requiredTimes, lockDurationSeconds]);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (currentStep < requiredTimes) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinalConfirm = () => {
    if (!isUnlocked) return;
    onConfirm();
    onClose();
  };

  const progressPercentage = Math.round((currentStep / requiredTimes) * 100);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0D0E12] border border-rose-500/50 rounded-2xl max-w-lg w-full text-white p-6 space-y-5 shadow-2xl relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top visual glowing stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Cancel deletion"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 text-rose-400">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 shrink-0">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-rose-100">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Verified Deletion Protocol • Step {currentStep} of {requiredTimes}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                ({requiredTimes} Times Confirmation)
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Indicators */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-zinc-400">
            <span>Security Progress</span>
            <span className="text-amber-400 font-bold">{progressPercentage}% Completed</span>
          </div>
          <div className="w-full bg-zinc-900 border border-zinc-800 h-2 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {/* Step Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className={`p-1.5 rounded text-center text-[10px] font-mono font-semibold border ${
              currentStep >= 1 ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-zinc-900/50 border-zinc-800 text-zinc-600'
            }`}>
              1. Target Details
            </div>
            <div className={`p-1.5 rounded text-center text-[10px] font-mono font-semibold border ${
              currentStep >= 2 ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-zinc-900/50 border-zinc-800 text-zinc-600'
            }`}>
              2. System Impact
            </div>
            <div className={`p-1.5 rounded text-center text-[10px] font-mono font-semibold border ${
              currentStep === 3 ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-zinc-900/50 border-zinc-800 text-zinc-600'
            }`}>
              3. Timed Unlock
            </div>
          </div>
        </div>

        {/* STEP 1: Identification */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono uppercase font-bold">Target {itemType}</span>
                <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">Verification 1/{requiredTimes}</span>
              </div>
              <p className="text-sm font-bold text-white font-mono">{itemName}</p>
              {detailsText && <p className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-zinc-900">{detailsText}</p>}
            </div>

            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Verification Stage 1 of {requiredTimes}</strong>
                Please inspect and verify the target record above. Click "Proceed to Step 2 Verification" to review system impacts.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-amber-500 text-zinc-950 font-bold rounded-xl uppercase text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span>Proceed to Step 2 Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: System Impact & Audit Warning */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 bg-zinc-950 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Impact & Audit Check</span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono">Verification 2/{requiredTimes}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Deleting this record will immediately purge it from the live database and synchronize with cloud storage.
                Any related transactions, balances, or references will be adjusted per ERP double-entry rules.
              </p>
              <div className="mt-2 p-2.5 bg-zinc-900/90 rounded border border-zinc-800 text-[11px] font-mono text-zinc-300">
                <span className="text-rose-400 font-bold">Item:</span> {itemName}
              </div>
            </div>

            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Verification Stage 2 of {requiredTimes}</strong>
                Confirm you want to advance to the final timed safety unlock step. This deletion is irreversible once executed.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors text-xs font-bold cursor-pointer"
              >
                ← Back to Step 1
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-zinc-950 font-bold rounded-xl uppercase text-xs hover:from-amber-400 hover:to-rose-400 transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span>Proceed to Final Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Timed Unlock & Final Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-rose-300 font-mono uppercase font-bold">Final Verification (3 of {requiredTimes})</span>
                {isUnlocked ? (
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono font-bold flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Timed Lock: {countdown}s
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                You are about to <strong className="text-rose-400 underline underline-offset-2">permanently delete</strong>:
              </p>
              <p className="text-sm font-bold text-white font-mono bg-zinc-950 p-2.5 rounded-lg border border-rose-500/30 break-all">
                {itemName}
              </p>
              <p className="text-[11px] text-rose-300/90 pt-1">
                Triple verified by administrator. This action cannot be undone.
              </p>
            </div>

            {/* Countdown / Timed Lock Status Notice */}
            {!isUnlocked ? (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Security timer countdown in progress...</span>
                </div>
                <div className="text-sm font-mono font-bold text-amber-400 bg-zinc-950 px-2.5 py-1 rounded border border-amber-500/30">
                  {countdown}s
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Security delay verified! The delete button is now unlocked.</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors text-xs font-bold cursor-pointer"
              >
                ← Back to Step 2
              </button>
              <button
                type="button"
                disabled={!isUnlocked}
                onClick={handleFinalConfirm}
                className={`px-5 py-2.5 font-bold rounded-xl uppercase text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xl ${
                  isUnlocked
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 cursor-pointer animate-pulse'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60 border border-zinc-700'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {isUnlocked
                    ? 'Confirm & Permanently Delete'
                    : `Unlocking in ${countdown}s...`}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
