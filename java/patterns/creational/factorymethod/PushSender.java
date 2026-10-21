package patterns.creational.factorymethod;

public class PushSender extends NotificationSender {
    @Override
    protected Notification createNotification() {
        return new PushNotification();
    }
}
