package patterns.structural.bridge;

/** The implementation side of the bridge: what every device can do. */
public interface Device {
    String getName();
    boolean isOn();
    void setOn(boolean on);
    int getVolume();
    void setVolume(int volume);
    int getChannel();
    void setChannel(int channel);
}
