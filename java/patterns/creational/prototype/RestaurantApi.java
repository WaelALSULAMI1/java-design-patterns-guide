package patterns.creational.prototype;

import java.util.List;

/** Simulates slow, expensive remote calls, and counts how many were made. */
public final class RestaurantApi {

    private static int calls = 0;

    private RestaurantApi() { }

    public static List<String> fetchDefaultMeal(String restaurant) {
        calls++;
        return List.of("Chicken meal", "Fries", "Cola");
    }

    public static Address fetchDeliveryAddress(String customerId) {
        calls++;
        return new Address("King Abdullah Rd", "Jeddah");
    }

    public static int callCount() {
        return calls;
    }
}
