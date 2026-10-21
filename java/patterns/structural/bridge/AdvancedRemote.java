package patterns.structural.bridge;

/** A refined abstraction: adds features without touching any Device class. */
public class AdvancedRemote extends RemoteControl {

    private int volumeBeforeMute = -1;

    public AdvancedRemote(Device device) {
        super(device);
    }

    public void mute() {
        if (volumeBeforeMute < 0) {
            volumeBeforeMute = device.getVolume();
            device.setVolume(0);
            System.out.println(device.getName() + " muted");
        } else {
            device.setVolume(volumeBeforeMute);
            volumeBeforeMute = -1;
            System.out.println(device.getName() + " unmuted, volume: " + device.getVolume());
        }
    }

    public void goToChannel(int channel) {
        device.setChannel(channel);
        System.out.println(device.getName() + " channel: " + device.getChannel());
    }
}
