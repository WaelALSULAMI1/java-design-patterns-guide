package patterns.creational.singleton;

public class Demo {

    public static void main(String[] args) {
        AppConfig first = AppConfig.getInstance();
        AppConfig second = AppConfig.getInstance();
        System.out.println("Same object? " + (first == second));          // true

        new SettingsScreen().switchToDarkTheme();
        System.out.println("Theme seen elsewhere: " + first.get("theme")); // dark

        System.out.println(new CheckoutService().formatPrice(49.5));       // 49.50 SAR
        System.out.println("Holder idiom, same object? "
                + (HolderConfig.getInstance() == HolderConfig.getInstance()));
    }
}
