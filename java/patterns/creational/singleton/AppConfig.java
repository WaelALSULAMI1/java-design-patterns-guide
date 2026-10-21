package patterns.creational.singleton;

import java.util.HashMap;
import java.util.Map;

/**
 * Application-wide settings. Every part of the program must see the same values,
 * so there must be exactly one AppConfig object.
 */
public final class AppConfig {

    // 1. The single instance lives in a private static field.
    private static AppConfig instance;

    private final Map<String, String> settings = new HashMap<>();

    // 2. A private constructor: no other class can call "new AppConfig()".
    private AppConfig() {
        System.out.println("Loading configuration (this should happen once)...");
        settings.put("app.name", "Pattern Shop");
        settings.put("currency", "SAR");
        settings.put("theme", "light");
    }

    // 3. The global access point. "synchronized" makes the lazy check safe
    //    when several threads call getInstance() at the same time.
    public static synchronized AppConfig getInstance() {
        if (instance == null) {
            instance = new AppConfig();
        }
        return instance;
    }

    public synchronized String get(String key) {
        return settings.get(key);
    }

    public synchronized void set(String key, String value) {
        settings.put(key, value);
    }
}
