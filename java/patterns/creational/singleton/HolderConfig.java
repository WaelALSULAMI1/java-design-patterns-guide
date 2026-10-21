package patterns.creational.singleton;

/**
 * An alternative implementation: the "initialization-on-demand holder" idiom.
 * The JVM loads the nested Holder class only on the first call to getInstance(),
 * and class loading is thread-safe, so no synchronized keyword is needed.
 */
public final class HolderConfig {

    private HolderConfig() { }

    private static class Holder {
        private static final HolderConfig INSTANCE = new HolderConfig();
    }

    public static HolderConfig getInstance() {
        return Holder.INSTANCE;
    }
}
