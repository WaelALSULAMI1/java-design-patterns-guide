package patterns.creational.prototype;

import java.util.HashMap;
import java.util.Map;

/**
 * A prototype registry: stores ready-made templates by name and hands out copies.
 * Callers never receive the stored original, so they cannot change it by accident.
 */
public class TemplateRegistry {

    private final Map<String, OrderTemplate> templates = new HashMap<>();

    public void register(String key, OrderTemplate template) {
        templates.put(key, template);
    }

    public OrderTemplate create(String key) {
        OrderTemplate prototype = templates.get(key);
        if (prototype == null) {
            throw new IllegalArgumentException("No template named " + key);
        }
        return prototype.copy();
    }
}
