import { create } from "zustand";

// ─── Alert Store (Zustand) ───────────────────────────────────────────────────
// Manages a queue of incoming donation alerts for the OBS overlay.
// Alerts are shown one at a time and auto-dismissed after `displayDuration` ms.
//
// Usage in overlay:
//   const { currentAlert, dismissAlert } = useAlertStore();
//
// Usage in useSocket:
//   const addAlert = useAlertStore((s) => s.addAlert);
//   addAlert({ name, amount, message });

const DISPLAY_DURATION = 6000; // ms each alert is shown

export const useAlertStore = create((set, get) => ({
  // Queue of pending alerts
  queue: [],

  // The alert currently being displayed (null = nothing showing)
  currentAlert: null,

  // Whether the overlay is actively displaying an alert
  isShowing: false,

  // ── addAlert ──────────────────────────────────────────────────────────────
  // Called by useSocket when a "new-donation" event arrives.
  addAlert: (donation) => {
    const alert = {
      id: crypto.randomUUID(),
      name: donation.name || "Anonymous",
      amount: donation.amount,
      message: donation.message || "",
      receivedAt: Date.now(),
    };

    set((state) => {
      const newQueue = [...state.queue, alert];

      // If nothing is currently showing, start displaying immediately
      if (!state.isShowing) {
        return { queue: newQueue };
      }
      return { queue: newQueue };
    });

    // Trigger the display loop if not already running
    if (!get().isShowing) {
      get()._showNext();
    }
  },

  // ── _showNext (internal) ──────────────────────────────────────────────────
  // Dequeues the next alert and schedules auto-dismiss.
  _showNext: () => {
    const { queue } = get();
    if (queue.length === 0) {
      set({ isShowing: false, currentAlert: null });
      return;
    }

    const [next, ...rest] = queue;
    set({ currentAlert: next, queue: rest, isShowing: true });

    // Auto-dismiss after duration
    setTimeout(() => {
      get().dismissAlert();
    }, DISPLAY_DURATION);
  },

  // ── dismissAlert ─────────────────────────────────────────────────────────
  // Manually dismiss current alert (or called automatically by timer).
  dismissAlert: () => {
    set({ currentAlert: null, isShowing: false });

    // Small gap between alerts for cleaner UX
    setTimeout(() => {
      get()._showNext();
    }, 800);
  },

  // ── clearAll ──────────────────────────────────────────────────────────────
  clearAll: () => set({ queue: [], currentAlert: null, isShowing: false }),
}));

export default useAlertStore;