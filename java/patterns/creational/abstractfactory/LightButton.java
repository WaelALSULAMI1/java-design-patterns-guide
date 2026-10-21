package patterns.creational.abstractfactory;

public class LightButton implements Button {
    @Override
    public String render(String label) {
        return "[ " + label + " ] (white background, dark text)";
    }
}
