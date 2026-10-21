package patterns.creational.prototype;

import java.util.ArrayList;
import java.util.List;

/**
 * A pre-filled order. Building one requires expensive API calls,
 * so new orders are created by copying (cloning) an existing template.
 */
public class OrderTemplate {

    private final String restaurant;
    private final List<String> items;
    private final Address address;
    private String note;

    /** The expensive way: talks to the remote API. */
    public OrderTemplate(String restaurant, String customerId) {
        this.restaurant = restaurant;
        this.items = new ArrayList<>(RestaurantApi.fetchDefaultMeal(restaurant));
        this.address = RestaurantApi.fetchDeliveryAddress(customerId);
        this.note = "";
    }

    /** The cheap way: a copy constructor that performs a deep copy. */
    private OrderTemplate(OrderTemplate source) {
        this.restaurant = source.restaurant;               // String is immutable: sharing is safe
        this.items = new ArrayList<>(source.items);        // new list: the copy can change its items
        this.address = new Address(source.address);        // new Address: changes stay in the copy
        this.note = source.note;
    }

    /** The prototype operation: one line, no API calls. */
    public OrderTemplate copy() {
        return new OrderTemplate(this);
    }

    public void addItem(String item) {
        items.add(item);
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Address getAddress() {
        return address;
    }

    @Override
    public String toString() {
        return restaurant + " " + items + " to " + address + (note.isEmpty() ? "" : " (" + note + ")");
    }
}
