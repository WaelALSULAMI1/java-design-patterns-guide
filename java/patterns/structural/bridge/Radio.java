package patterns.structural.bridge;

public class Radio implements Device {
    private boolean on;
    private int volume = 8;
    private int station = 88;   // "channels" are FM stations for a radio

    @Override public String getName() { return "Radio"; }
    @Override public boolean isOn() { return on; }
    @Override public void setOn(boolean on) { this.on = on; }
    @Override public int getVolume() { return volume; }
    @Override public void setVolume(int volume) { this.volume = Math.max(0, Math.min(30, volume)); }
    @Override public int getChannel() { return station; }
    @Override public void setChannel(int channel) { this.station = Math.max(88, Math.min(108, channel)); }
}
