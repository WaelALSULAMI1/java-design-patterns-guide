package patterns.creational.abstractfactory;

public class DarkButton implements Button {
    @Override
    public String render(String label) {
        return "[ " + label + " ] (navy background, light text)";
    }
}
