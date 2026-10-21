package patterns.creational.factorymethod;

/** The product interface: every notification can be sent. */
public interface Notification {
    void send(String recipient, String message);
}
