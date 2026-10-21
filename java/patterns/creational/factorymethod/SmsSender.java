package patterns.creational.factorymethod;

public class SmsSender extends NotificationSender {
    @Override
    protected Notification createNotification() {
        return new SmsNotification();
    }
}
