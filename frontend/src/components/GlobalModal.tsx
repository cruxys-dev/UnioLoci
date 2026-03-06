import React from "react";
import { useUIStore } from "../store/ui.store";

export const GlobalModal: React.FC = () => {
  const { modal, hideModal } = useUIStore();

  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {modal.title}
          </h3>
          <p className="text-zinc-400 leading-relaxed">{modal.message}</p>
        </div>

        <div className="p-4 bg-zinc-800/50 flex justify-end gap-3">
          <button
            onClick={() => {
              hideModal();
              modal.onConfirm?.();
            }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all active:scale-95 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
