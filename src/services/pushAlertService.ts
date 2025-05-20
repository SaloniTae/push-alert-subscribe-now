
// PushAlert service to handle subscription functionality

/**
 * Check if PushAlert is ready and available
 * @returns boolean indicating if PushAlert is available
 */
export const isPushAlertAvailable = (): boolean => {
  return window.PushAlert !== undefined;
};

/**
 * Check if the user is already subscribed to push notifications
 * @returns boolean indicating subscription status
 */
export const isSubscribed = (): boolean => {
  if (!isPushAlertAvailable()) return false;
  return window.PushAlert.isSubscribed();
};

/**
 * Request permission and subscribe the user to push notifications
 * @returns Promise that resolves when subscription is complete
 */
export const subscribeUser = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isPushAlertAvailable()) {
      reject(new Error("PushAlert is not available"));
      return;
    }

    window.PushAlert.subscribe({
      onSuccess: () => {
        console.log("Successfully subscribed to notifications");
        resolve();
      },
      onFailure: (error: string) => {
        console.error("Failed to subscribe to notifications:", error);
        reject(new Error(error));
      },
    });
  });
};

/**
 * Unsubscribe the user from push notifications
 * @returns Promise that resolves when unsubscription is complete
 */
export const unsubscribeUser = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!isPushAlertAvailable()) {
      reject(new Error("PushAlert is not available"));
      return;
    }

    window.PushAlert.unsubscribe({
      onSuccess: () => {
        console.log("Successfully unsubscribed from notifications");
        resolve();
      },
      onFailure: (error: string) => {
        console.error("Failed to unsubscribe from notifications:", error);
        reject(new Error(error));
      },
    });
  });
};

// Add TypeScript declarations for PushAlert global object
declare global {
  interface Window {
    PushAlert?: {
      subscribe: (options: { onSuccess: () => void; onFailure: (error: string) => void }) => void;
      unsubscribe: (options: { onSuccess: () => void; onFailure: (error: string) => void }) => void;
      isSubscribed: () => boolean;
    };
  }
}
