
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isSubscribed, subscribeUser, unsubscribeUser, isPushAlertAvailable } from '@/services/pushAlertService';

export const NotificationSubscriber: React.FC = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceAvailable, setServiceAvailable] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if PushAlert is available and if user is already subscribed
    const checkStatus = () => {
      const available = isPushAlertAvailable();
      setServiceAvailable(available);
      
      if (available) {
        const subscribed = isSubscribed();
        setSubscriptionStatus(subscribed);
      }
    };

    // Initial check
    checkStatus();

    // Set up an interval to periodically check subscription status
    const statusInterval = setInterval(checkStatus, 2000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  const handleSubscribeClick = async () => {
    if (!serviceAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Push notification service is currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (subscriptionStatus) {
        // Unsubscribe if already subscribed
        await unsubscribeUser();
        setSubscriptionStatus(false);
        toast({
          title: "Unsubscribed",
          description: "You've successfully unsubscribed from notifications.",
        });
      } else {
        // Subscribe if not already subscribed
        await subscribeUser();
        setSubscriptionStatus(true);
        toast({
          title: "Subscribed",
          description: "You've successfully subscribed to notifications!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: subscriptionStatus 
          ? "Failed to unsubscribe. Please try again." 
          : "Failed to subscribe. Please check browser permissions.",
        variant: "destructive",
      });
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Web Push Notifications</CardTitle>
        <CardDescription className="text-center">
          Stay updated with the latest news and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10">
          {subscriptionStatus ? (
            <Bell className="h-12 w-12 text-primary" />
          ) : (
            <BellOff className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <p className="text-center">
          {!serviceAvailable ? (
            "Push notification service is loading..."
          ) : subscriptionStatus ? (
            "You're currently receiving push notifications."
          ) : (
            "Enable push notifications to stay updated."
          )}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubscribeClick} 
          disabled={loading || !serviceAvailable} 
          className="w-full"
          variant={subscriptionStatus ? "outline" : "default"}
        >
          {loading ? (
            "Processing..."
          ) : subscriptionStatus ? (
            "Unsubscribe"
          ) : (
            "Subscribe to Notifications"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSubscriber;
