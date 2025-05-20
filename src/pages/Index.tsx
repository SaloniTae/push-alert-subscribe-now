
import NotificationSubscriber from "@/components/NotificationSubscriber";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Push Notifications</h1>
        <NotificationSubscriber />
        <p className="text-center text-sm text-muted-foreground mt-8">
          Powered by PushAlert.co
        </p>
      </div>
    </div>
  );
};

export default Index;
