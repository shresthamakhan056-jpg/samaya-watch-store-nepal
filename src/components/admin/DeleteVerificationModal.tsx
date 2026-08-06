import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface DeleteVerificationModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  detailsText?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteVerificationModal: React.FC<DeleteVerificationModalProps> = ({
  isOpen,
  title,
  itemName,
  detailsText,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Reset to step 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0F0F12] border border-rose-500/50 rounded-2xl max-w-md w-full text-white p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Top gradient glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 text-rose-400">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-rose-100">{title}</h3>
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
              Double Verification Security • Step {step} of 2
            </span>
          </div>
        </div>

        {/* Progress Bar for Step */}
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden flex">
          <div className={`h-full bg-amber-500 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        {/* STEP 1 CONTENT */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
              <span className="text-[10px] text-zinc-400 font-mono uppercase">Target Record</span>
              <p className="text-sm font-bold text-white">{itemName}</p>
              {detailsText && <p className="text-xs text-zinc-400">{detailsText}</p>}
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">First Verification Step Required</strong>
                Click "Proceed to Step 2 Verification" below to continue. Deletion will NOT occur until final confirmation.
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
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-amber-500 text-zinc-950 font-bold rounded-xl uppercase text-xs hover:bg-amber-400 transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span>Proceed to Step 2 Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 CONTENT */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-2">
              <span className="text-[10px] text-rose-300 font-mono uppercase font-bold">Final Confirmation Warning</span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                You are about to <strong className="text-rose-300 underline underline-offset-2">permanently delete</strong>:
              </p>
              <p className="text-sm font-bold text-white font-mono bg-zinc-950 p-2 rounded border border-rose-500/30">
                {itemName}
              </p>
              <p className="text-[11px] text-rose-300">
                This is the 2nd and final verification step. This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors text-xs font-bold cursor-pointer"
              >
                ← Back to Step 1
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl uppercase text-xs hover:bg-rose-500 transition-all cursor-pointer shadow-xl flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm & Permanently Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
