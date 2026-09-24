import { type Root, createRoot } from "react-dom/client";
import { AdminConfirmDialog } from "../components/AdminConfirmDialog";
import {
  type AdminLivePublishSpec,
  adminLivePublishSpec,
} from "./adminLivePublish";

let host: HTMLDivElement | null = null;
let root: Root | null = null;

function ensureRoot(): Root {
  if (!host) {
    host = document.createElement("div");
    host.id = "admin-live-publish-root";
    document.body.appendChild(host);
    root = createRoot(host);
  }
  if (!root) {
    root = createRoot(host);
  }
  return root;
}

function closePortal(): void {
  root?.render(null);
}

function renderSpec(spec: AdminLivePublishSpec, onConfirm: () => void): void {
  ensureRoot().render(
    <AdminConfirmDialog
      title={spec.title}
      body={spec.body}
      confirmLabel={spec.confirmLabel}
      ocidPrefix={spec.ocidPrefix}
      onCancel={closePortal}
      onConfirm={() => {
        closePortal();
        onConfirm();
      }}
    />,
  );
}

/** True when the click was intercepted (dialog shown, original handler deferred). */
export function interceptAdminLivePublishClick(
  ocid: string | undefined,
  onClick: (() => void) | undefined,
): boolean {
  const spec = adminLivePublishSpec(ocid);
  if (!spec || !onClick) return false;
  renderSpec(spec, onClick);
  return true;
}
