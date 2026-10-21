package patterns.creational.builder;

/**
 * THE PROBLEM (kept only for comparison; do not design classes like this).
 *
 * <p>A "telescoping constructor": every new optional field adds another overloaded
 * constructor, and callers must remember the exact order of many parameters.
 */
public class TelescopingPizza {

    private final Size size;
    private final Crust crust;
    private final boolean extraCheese;
    private final String sauce;
    private final String topping;

    public TelescopingPizza(Size size, Crust crust) {
        this(size, crust, false);
    }

    public TelescopingPizza(Size size, Crust crust, boolean extraCheese) {
        this(size, crust, extraCheese, "tomato");
    }

    public TelescopingPizza(Size size, Crust crust, boolean extraCheese, String sauce) {
        this(size, crust, extraCheese, sauce, null);
    }

    public TelescopingPizza(Size size, Crust crust, boolean extraCheese, String sauce, String topping) {
        this.size = size;
        this.crust = crust;
        this.extraCheese = extraCheese;
        this.sauce = sauce;
        this.topping = topping;
    }

    @Override
    public String toString() {
        return size + " " + crust + " pizza | sauce: " + sauce
                + " | extra cheese: " + (extraCheese ? "yes" : "no")
                + " | topping: " + (topping == null ? "none" : topping);
    }
}
