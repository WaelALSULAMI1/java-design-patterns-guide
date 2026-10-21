package patterns.creational.abstractfactory;

public class Demo {

    public static void main(String[] args) {
        boolean darkModeEnabled = true;   // for example, read from the user's settings

        // The only place in the program that names a concrete factory.
        UiFactory factory = darkModeEnabled ? new DarkUiFactory() : new LightUiFactory();

        System.out.println("Theme: " + (darkModeEnabled ? "dark" : "light"));
        new SettingsScreen(factory).draw();

        System.out.println("Theme: light");
        new SettingsScreen(new LightUiFactory()).draw();
    }
}
