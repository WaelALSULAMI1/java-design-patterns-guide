package patterns.creational.factorymethod;

/**
 * FACTORY METHOD (GoF). The creator defines the overall workflow,
 * and subclasses decide which Notification to create by overriding createNotification().
 */
public abstract class NotificationSender {

    /** The factory method. */
    protected abstract Notification createNotification();

    /** Business logic that works with any product through the interface. */
    public void notifyUser(String recipient, String message) {
        Notification notification = createNotification();
        notification.send(recipient, message);
        System.out.println("  logged: " + getClass().getSimpleName() + " sent a message");
    }
}
