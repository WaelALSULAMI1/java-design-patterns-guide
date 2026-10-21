package patterns.creational.abstractfactory;

/** Concrete factory: everything it creates belongs to the dark family. */
public class DarkUiFactory implements UiFactory {
    @Override
    public Button createButton() {
        return new DarkButton();
    }

    @Override
    public Checkbox createCheckbox() {
        return new DarkCheckbox();
    }
}
