package patterns.creational.factorymethod;

/**
 * SIMPLE FACTORY (an idiom, not one of the 23 GoF patterns).
 * One static method holds the "which class?" decision, so client code never calls new.
 * Adding a channel still means editing this switch.
 */
public final class SimpleNotificationFactory {

    private SimpleNotificationFactory() { }

    public static Notification create(Channel channel) {
        if (channel == null) {
            throw new IllegalArgumentException("channel must not be null");
        }
        switch (channel) {
            case EMAIL: return new EmailNotification();
            case SMS:   return new SmsNotification();
            case PUSH:  return new PushNotification();
            default:    throw new IllegalArgumentException("Unknown channel: " + channel);
        }
    }
}
