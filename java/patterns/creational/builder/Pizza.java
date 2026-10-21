package patterns.creational.builder;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * The product: an immutable pizza.
 *
 * <p>Size and crust are required. Everything else is optional and has a sensible default.
 * The only way to create a {@code Pizza} is through {@link Pizza.Builder}.
 */
public final class Pizza {

    private final Size size;              // required
    private final Crust crust;            // required
    private final boolean extraCheese;    // optional (default: false)
    private final String sauce;           // optional (default: "tomato")
    private final List<String> toppings;  // optional (default: none)

    /** Private: client code cannot call {@code new Pizza(...)}; it must use the builder. */
    private Pizza(Builder builder) {
        this.size = builder.size;
        this.crust = builder.crust;
        this.extraCheese = builder.extraCheese;
        this.sauce = builder.sauce;
        this.toppings = List.copyOf(builder.toppings); // defensive, unmodifiable copy
    }

    public Size getSize() {
        return size;
    }

    public Crust getCrust() {
        return crust;
    }

    public boolean hasExtraCheese() {
        return extraCheese;
    }

    public String getSauce() {
        return sauce;
    }

    public List<String> getToppings() {
        return toppings;
    }

    @Override
    public String toString() {
        return size + " " + crust + " pizza"
                + " | sauce: " + sauce
                + " | extra cheese: " + (extraCheese ? "yes" : "no")
                + " | toppings: " + (toppings.isEmpty() ? "none" : String.join(", ", toppings));
    }

    /**
     * The builder. It is {@code static} so it can be created without an existing Pizza:
     * {@code new Pizza.Builder(Size.LARGE, Crust.THIN)}.
     */
    public static class Builder {

        // Required fields: final, set once in the constructor.
        private final Size size;
        private final Crust crust;

        // Optional fields: start with default values.
        private boolean extraCheese = false;
        private String sauce = "tomato";
        private final List<String> toppings = new ArrayList<>();

        /** Required values go in the builder's constructor, so they can never be forgotten. */
        public Builder(Size size, Crust crust) {
            this.size = Objects.requireNonNull(size, "size is required");
            this.crust = Objects.requireNonNull(crust, "crust is required");
        }

        /** Each optional step returns {@code this} so calls can be chained. */
        public Builder withExtraCheese() {
            this.extraCheese = true;
            return this;
        }

        public Builder withSauce(String sauce) {
            this.sauce = Objects.requireNonNull(sauce, "sauce must not be null");
            return this;
        }

        public Builder addTopping(String topping) {
            this.toppings.add(Objects.requireNonNull(topping, "topping must not be null"));
            return this;
        }

        /** Final step: validates the collected values and creates the product. */
        public Pizza build() {
            if (toppings.size() > 5) {
                throw new IllegalStateException("A pizza can have at most 5 toppings");
            }
            return new Pizza(this);
        }
    }
}
