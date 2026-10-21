package patterns.creational.factorymethod;

public class PushNotification implements Notification {
    @Override
    public void send(String recipient, String message) {
        System.out.println("[Push] to device of " + recipient + ": " + message);
    }
}
