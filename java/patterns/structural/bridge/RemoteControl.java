package patterns.structural.bridge;

/**
 * The abstraction side of the bridge. It holds a reference to a Device
 * (the bridge) and expresses high-level actions in terms of the device's operations.
 */
public class RemoteControl {

    protected final Device device;

    public RemoteControl(Device device) {
        this.device = device;
    }

    public void togglePower() {
        device.setOn(!device.isOn());
        System.out.println(device.getName() + " is now " + (device.isOn() ? "on" : "off"));
    }

    public void volumeUp() {
        device.setVolume(device.getVolume() + 1);
        System.out.println(device.getName() + " volume: " + device.getVolume());
    }

    public void volumeDown() {
        device.setVolume(device.getVolume() - 1);
        System.out.println(device.getName() + " volume: " + device.getVolume());
    }

    public void channelUp() {
        device.setChannel(device.getChannel() + 1);
        System.out.println(device.getName() + " channel: " + device.getChannel());
    }
}
