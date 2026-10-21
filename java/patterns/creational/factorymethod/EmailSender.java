package patterns.creational.factorymethod;

public class EmailSender extends NotificationSender {
    @Override
    protected Notification createNotification() {
        return new EmailNotification();
    }
}
