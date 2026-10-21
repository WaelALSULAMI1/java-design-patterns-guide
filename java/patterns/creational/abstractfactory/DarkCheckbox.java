package patterns.creational.abstractfactory;

public class DarkCheckbox implements Checkbox {
    @Override
    public String render(String label, boolean checked) {
        return (checked ? "[x] " : "[ ] ") + label + " (light border)";
    }
}
