package patterns.creational.builder;

/** Runs the Builder example. */
public class Demo {

    public static void main(String[] args) {
        System.out.println("=== Builder Pattern ===\n");

        // 1) The problem: what does "true" mean? Which String is the sauce and which is the topping?
        TelescopingPizza confusing = new TelescopingPizza(Size.LARGE, Crust.THIN, true, "bbq", "chicken");
        System.out.println("Telescoping constructor : " + confusing);

        // 2) The solution: every value is named, optional values can be skipped.
        Pizza custom = new Pizza.Builder(Size.LARGE, Crust.THIN)
                .withSauce("bbq")
                .withExtraCheese()
                .addTopping("chicken")
                .addTopping("onions")
                .build();
        System.out.println("Builder (custom)        : " + custom);

        // Only the required values: every optional field keeps its default.
        Pizza plain = new Pizza.Builder(Size.SMALL, Crust.CLASSIC).build();
        System.out.println("Builder (defaults only) : " + plain);

        // 3) A director-like class reuses common recipes.
        System.out.println("Menu (margherita)       : " + PizzaMenu.margherita(Size.MEDIUM));
        System.out.println("Menu (vegetarian)       : " + PizzaMenu.vegetarian(Size.LARGE));

        // 4) build() validates before the object exists.
        try {
            Pizza.Builder overloaded = new Pizza.Builder(Size.SMALL, Crust.THIN);
            for (int i = 1; i <= 6; i++) {
                overloaded.addTopping("topping " + i);
            }
            overloaded.build();
        } catch (IllegalStateException e) {
            System.out.println("Validation in build()   : " + e.getMessage());
        }
    }
}
