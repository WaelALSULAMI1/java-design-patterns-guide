package patterns.creational.factorymethod;

public class Demo {

    public static void main(String[] args) {
        // Simple Factory: ask one static method for the right object.
        Notification n = SimpleNotificationFactory.create(Channel.SMS);
        n.send("+966500000000", "Your order is on its way and should arrive in about 20 minutes.");

        // Factory Method: choose a creator subclass; it decides which product to make.
        NotificationSender sender = chooseSender("email");
        sender.notifyUser("sara@example.com", "Your receipt is attached.");

        sender = chooseSender("push");
        sender.notifyUser("sara", "Your driver has arrived.");
    }

    // The only place that knows the concrete creator classes, for example from user settings.
    private static NotificationSender chooseSender(String preference) {
        switch (preference) {
            case "email": return new EmailSender();
            case "sms":   return new SmsSender();
            default:      return new PushSender();
        }
    }
}
