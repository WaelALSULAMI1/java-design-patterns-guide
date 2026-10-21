package patterns.creational.singleton;

/** Another part of the program that changes the shared configuration. */
public class SettingsScreen {

    public void switchToDarkTheme() {
        AppConfig.getInstance().set("theme", "dark");
    }
}
