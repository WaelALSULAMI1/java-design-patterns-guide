package patterns.creational.prototype;

public class Demo {

    public static void main(String[] args) {
        // Build the expensive template once.
        TemplateRegistry registry = new TemplateRegistry();
        registry.register("usual", new OrderTemplate("Burger House", "c-42"));
        System.out.println("API calls after building the template: " + RestaurantApi.callCount()); // 2

        // Every new order is a copy: no extra API calls.
        OrderTemplate monday = registry.create("usual");
        OrderTemplate friday = registry.create("usual");
        friday.addItem("Ice cream");
        friday.getAddress().setStreet("Tahlia St");
        friday.setNote("Ring the bell");

        System.out.println("Monday: " + monday);
        System.out.println("Friday: " + friday);
        System.out.println("API calls after two orders: " + RestaurantApi.callCount());           // still 2

        // Cloneable version.
        Document original = new Document("Report");
        original.addPage("Introduction");
        Document copy = original.clone();
        copy.setTitle("Report (draft 2)");
        copy.addPage("New chapter");
        System.out.println("Original: " + original);
        System.out.println("Copy:     " + copy);
    }
}
