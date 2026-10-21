package patterns.creational.factorymethod;

public class SmsNotification implements Notification {
    @Override
    public void send(String recipient, String message) {
        String text = message.length() > 40 ? message.substring(0, 40) + "..." : message; // SMS is short
        System.out.println("[SMS] to " + recipient + ": " + text);
    }
}
