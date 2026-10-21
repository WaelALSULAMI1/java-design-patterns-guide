package patterns.creational.abstractfactory;

/** Concrete factory: everything it creates belongs to the light family. */
public class LightUiFactory implements UiFactory {
    @Override
    public Button createButton() {
        return new LightButton();
    }

    @Override
    public Checkbox createCheckbox() {
        return new LightCheckbox();
    }
}
