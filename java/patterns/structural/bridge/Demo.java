package patterns.structural.bridge;

public class Demo {

    public static void main(String[] args) {
        // Any remote works with any device: 2 remotes + 2 devices = 4 classes, not 4 combinations.
        RemoteControl basic = new RemoteControl(new Tv());
        basic.togglePower();
        basic.volumeUp();
        basic.channelUp();

        AdvancedRemote advanced = new AdvancedRemote(new Radio());
        advanced.togglePower();
        advanced.goToChannel(102);
        advanced.mute();
        advanced.mute();
    }
}
