package patterns.creational.abstractfactory;

/**
 * The client. It only knows the interfaces UiFactory, Button and Checkbox,
 * so it cannot mix a light button with a dark checkbox by accident.
 */
public class SettingsScreen {

    private final Button saveButton;
    private final Checkbox notifications;

    public SettingsScreen(UiFactory factory) {
        this.saveButton = factory.createButton();
        this.notifications = factory.createCheckbox();
    }

    public void draw() {
        System.out.println(notifications.render("Email notifications", true));
        System.out.println(saveButton.render("Save"));
    }
}
