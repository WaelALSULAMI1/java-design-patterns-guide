package patterns.creational.abstractfactory;

public class LightCheckbox implements Checkbox {
    @Override
    public String render(String label, boolean checked) {
        return (checked ? "[x] " : "[ ] ") + label + " (grey border)";
    }
}
