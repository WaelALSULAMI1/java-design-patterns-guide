package patterns.creational.builder;

/**
 * Plays the role of the GoF "Director": it knows the recipe (which steps, in which order)
 * for popular pizzas, so client code does not have to repeat them.
 */
public final class PizzaMenu {

    private PizzaMenu() {
        // utility class: no instances
    }

    public static Pizza margherita(Size size) {
        return new Pizza.Builder(size, Crust.THIN)
                .withExtraCheese()
                .addTopping("basil")
                .build();
    }

    public static Pizza vegetarian(Size size) {
        return new Pizza.Builder(size, Crust.CLASSIC)
                .addTopping("mushrooms")
                .addTopping("peppers")
                .addTopping("olives")
                .build();
    }
}
