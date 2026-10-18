"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone. Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .modal-cancel-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
          color: #0f172a !important;
        }
        .modal-danger-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px -2px rgba(239, 68, 68, 0.45) !important;
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          position: "relative",
          animation: "modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#f8fafc",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.15s ease",
          }}
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Header Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "18px",
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDanger
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)"
              : "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)",
            color: isDanger ? "#ef4444" : "#f59e0b",
            border: isDanger ? "1px solid rgba(239, 68, 68, 0.25)" : "1px solid rgba(245, 158, 11, 0.25)",
            boxShadow: isDanger
              ? "0 8px 16px -4px rgba(239, 68, 68, 0.15)"
              : "0 8px 16px -4px rgba(245, 158, 11, 0.15)",
          }}
        >
          {isDanger ? <Trash2 size={26} /> : <AlertTriangle size={26} />}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "#0f172a",
            margin: "0 0 10px 0",
            letterSpacing: "-0.4px",
          }}
        >
          {title}
        </h3>

        {/* Message */}
        <div
          style={{
            fontSize: "14px",
            color: "#64748b",
            lineHeight: "1.55",
            margin: "0 0 26px 0",
            padding: "0 8px",
          }}
        >
          {message}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onClose}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              color: "#475569",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.18s ease",
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="modal-danger-btn"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "12px",
              border: "none",
              background: isDanger
                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "700",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: isDanger
                ? "0 4px 14px rgba(239, 68, 68, 0.35)"
                : "0 4px 14px rgba(99, 102, 241, 0.35)",
              transition: "all 0.18s ease",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                <span>Deleting...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
