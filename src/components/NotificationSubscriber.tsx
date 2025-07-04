import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export const NotificationSubscriber: React.FC = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(false)
  const [loading, setLoading]           = useState<boolean>(false)
  const [serviceAvailable, setServiceAvailable] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkStatus = async () => {
      if (window.OneSignal) {
        try {
          setServiceAvailable(true)

          // 1) Check current subscription status
          const isEnabled = await window.OneSignal.isPushNotificationsEnabled()
          console.log("OneSignal subscription status:", isEnabled)
          setSubscriptionStatus(isEnabled)

          // 2) **Immediately grab the player ID** and log it
          const playerId = await window.OneSignal.getUserId()
          console.log("OneSignal player_id:", playerId)
          // (Optionally: send playerId to your server here)

        } catch (error) {
          console.error("Error checking OneSignal status or fetching playerId:", error)
          setServiceAvailable(false)
        }
      } else {
        console.log("OneSignal is not available yet")
      }
    }

    // Initial check + fetch of playerId
    checkStatus()

    // Poll every 2s in case SDK finishes loading later
    const statusInterval = setInterval(checkStatus, 2000)
    return () => clearInterval(statusInterval)
  }, [])

  const handleSubscribeClick = async () => {
    if (!serviceAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Push notification service is currently unavailable.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (subscriptionStatus) {
        await window.OneSignal.setSubscription(false)
        setSubscriptionStatus(false)
        toast({ title: "Unsubscribed", description: "You’ve unsubscribed." })
      } else {
        await window.OneSignal.registerForPushNotifications()
        await window.OneSignal.setSubscription(true)
        setSubscriptionStatus(true)
        toast({ title: "Subscribed", description: "You’re now subscribed!" })
      }
    } catch (error) {
      console.error("Subscription error:", error)
      toast({
        title: "Error",
        description: subscriptionStatus
          ? "Failed to unsubscribe. Please try again."
          : "Failed to subscribe. Please check browser permissions.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Web Push Notifications</CardTitle>
        <CardDescription className="text-center">
          Stay updated with the latest news and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10">
          {subscriptionStatus ? (
            <Bell className="h-12 w-12 text-primary" />
          ) : (
            <BellOff className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <p className="text-center">
          {!serviceAvailable
            ? "Push notification service is loading..."
            : subscriptionStatus
            ? "You’re receiving push notifications."
            : "Enable push notifications to stay updated."}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubscribeClick}
          disabled={loading || !serviceAvailable}
          className="w-full"
          variant={subscriptionStatus ? "outline" : "default"}
        >
          {loading
            ? "Processing..."
            : subscriptionStatus
            ? "Unsubscribe"
            : "Subscribe to Notifications"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default NotificationSubscriber
