package patterns.creational.singleton;

/** One part of the program that reads the shared configuration. */
public class CheckoutService {

    public String formatPrice(double amount) {
        String currency = AppConfig.getInstance().get("currency");
        return String.format("%.2f %s", amount, currency);
    }
}
