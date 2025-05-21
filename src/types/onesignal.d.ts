
interface Window {
  OneSignal?: {
    // Core methods
    init(config: any): Promise<void>;
    login(externalId: string, jwtToken?: string): Promise<void>;
    logout(): Promise<void>;
    setExternalUserId(externalId: string, authHash?: string): Promise<void>;
    removeExternalUserId(): Promise<void>;
    
    // Notification permission methods
    isPushNotificationsEnabled(): Promise<boolean>;
    getNotificationPermission(): Promise<NotificationPermission>;
    registerForPushNotifications(): Promise<void>;
    setSubscription(value: boolean): Promise<void>;
    
    // User namespace (v16 structure)
    User?: {
      addAlias(label: string, id: string): Promise<void>;
      addAliases(aliases: Record<string, string>): Promise<void>;
      removeAlias(label: string): Promise<void>;
      removeAliases(labels: string[]): Promise<void>;
      addEmail(email: string): Promise<void>;
      removeEmail(email: string): Promise<void>;
      addSms(smsNumber: string): Promise<void>;
      removeSms(smsNumber: string): Promise<void>;
      addTag(key: string, value: string): Promise<void>;
      addTags(tags: Record<string, string>): Promise<void>;
      removeTag(key: string): Promise<void>;
      removeTags(keys: string[]): Promise<void>;
      getTags(): Promise<Record<string, string>>;
      
      // Push subscription management
      PushSubscription?: {
        id?: string | null;
        token?: string | null;
        optedIn?: boolean;
        subscribed?: boolean;
        isPushNotificationsEnabled(): Promise<boolean>;
        optIn(): Promise<void>;
        optOut(): Promise<void>;
      };
    };
    
    // Notification namespace
    Notifications?: {
      permission: NotificationPermission;
      requestPermission(): Promise<NotificationPermission>;
    };
  };
  OneSignalDeferred?: any[];
}
