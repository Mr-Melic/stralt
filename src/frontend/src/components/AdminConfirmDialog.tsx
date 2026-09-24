/**
 * Owner ConfirmDialog. Extracted so AdminDashboard can import it without
 * editing PREFIX-touched live-publish buttons. Escape/dimmer cancel only.
 */
import type React from "react";
import { useEffect } from "react";
import {
  shouldDismissShopDialogOnBackdrop,
  shouldDismissShopDialogOnKey,
} from "../utils/shopDialogDismiss";

const RED = "#c0392b";

function DialogBtn({
  variant,
  children,
  onClick,
  ocid,
}: {
  variant: "ghost" | "red";
  children: React.ReactNode;
  onClick: () => void;
  ocid: string;
}) {
  const cls =
    variant === "red"
      ? "inline-flex items-center justify-center gap-1.5 border-none cursor-pointer font-bold uppercase tracking-wider px-4 py-1.5 text-[11px] rounded-xl stone-btn-crimson"
      : "inline-flex items-center justify-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider px-4 py-1.5 text-[11px] rounded-xl bg-transparent text-[#5a6a7a] border border-[rgba(192,57,43,0.27)]";
  return (
    <button type="button" onClick={onClick} data-ocid={ocid} className={cls}>
      {children}
    </button>
  );
}

export function AdminConfirmDialog({
  title,
  body,
  confirmLabel = "Delete",
  ocidPrefix,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel?: string;
  ocidPrefix: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (shouldDismissShopDialogOnKey(event.key)) {
        event.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);
  return (
    <div
      data-ocid={`${ocidPrefix}.dialog`}
      role="presentation"
      onClick={(event) => {
        if (
          shouldDismissShopDialogOnBackdrop(event.target, event.currentTarget)
        ) {
          onCancel();
        }
      }}
      onKeyDown={(event) => {
        if (shouldDismissShopDialogOnKey(event.key)) {
          event.preventDefault();
          onCancel();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(5,6,14,0.85)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg,#13141c,#0e0f16)",
          border: `1px solid ${RED}`,
          borderRadius: 10,
          padding: "28px 32px",
          minWidth: 320,
          maxWidth: 420,
          boxShadow: "0 0 40px rgba(192,57,43,0.25)",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>
          ⚠️
        </div>
        <h3
          style={{
            color: "#f0c44a",
            textAlign: "center",
            margin: "0 0 10px",
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "#8a8090",
            fontSize: 12,
            textAlign: "center",
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {body}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <DialogBtn
            variant="ghost"
            onClick={onCancel}
            ocid={`${ocidPrefix}.cancel_button`}
          >
            Cancel
          </DialogBtn>
          <DialogBtn
            variant="red"
            onClick={onConfirm}
            ocid={`${ocidPrefix}.confirm_button`}
          >
            {confirmLabel}
          </DialogBtn>
        </div>
      </div>
    </div>
  );
}
