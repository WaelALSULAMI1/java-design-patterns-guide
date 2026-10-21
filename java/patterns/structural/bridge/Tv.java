package patterns.structural.bridge;

public class Tv implements Device {
    private boolean on;
    private int volume = 20;
    private int channel = 1;

    @Override public String getName() { return "TV"; }
    @Override public boolean isOn() { return on; }
    @Override public void setOn(boolean on) { this.on = on; }
    @Override public int getVolume() { return volume; }
    @Override public void setVolume(int volume) { this.volume = Math.max(0, Math.min(100, volume)); }
    @Override public int getChannel() { return channel; }
    @Override public void setChannel(int channel) { this.channel = Math.max(1, channel); }
}
