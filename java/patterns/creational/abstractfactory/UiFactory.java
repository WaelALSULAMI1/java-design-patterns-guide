package patterns.creational.abstractfactory;

/** The abstract factory: one creation method per product in the family. */
public interface UiFactory {
    Button createButton();
    Checkbox createCheckbox();
}
