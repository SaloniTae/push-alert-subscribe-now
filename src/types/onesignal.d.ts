
interface Window {
  OneSignal?: {
    User?: {
      PushSubscription?: {
        getSubscriptionState(): Promise<{
          subscribed: boolean;
          optedIn: boolean;
          token: string | null;
        }>;
        optIn(): Promise<void>;
        optOut(): Promise<void>;
      };
    };
    init(config: any): Promise<void>;
    registerForPushNotifications(): Promise<void>;
    setSubscription(value: boolean): Promise<void>;
  };
  OneSignalDeferred?: any[];
}
