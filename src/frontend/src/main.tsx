import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { wireHiddenTabCssPause } from "./engine/hiddenTabCssActivity";
import "./index.css";

// PERF-2026-09-28-126: pause infinite HUD CSS (battle caret, Tailwind pulse)
// while the tab is in the background. Does not touch world RAF or one-shot banners.
wireHiddenTabCssPause(document);

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
