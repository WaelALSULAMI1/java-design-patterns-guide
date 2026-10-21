// Bridge: full guide.
const BASE = "java/patterns/structural/bridge/";

export default {
  id: "bridge",
  lead: "Split a design that varies in two independent ways into two separate hierarchies, connected by composition, so each side can grow on its own.",

  files: [
    { name: "RemoteControl.java", path: BASE + "RemoteControl.java", role: "Abstraction: holds a Device and defines high-level actions" },
    { name: "AdvancedRemote.java", path: BASE + "AdvancedRemote.java", role: "Refined abstraction: adds mute and direct channel" },
    { name: "Device.java", path: BASE + "Device.java", role: "Implementor: the operations every device supports" },
    { name: "Tv.java", path: BASE + "Tv.java", role: "Concrete implementor" },
    { name: "Radio.java", path: BASE + "Radio.java", role: "Concrete implementor" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Any remote with any device" },
  ],

  snippets: {
    problem:
`class TvBasicRemote { ... }
class TvAdvancedRemote { ... }
class RadioBasicRemote { ... }
class RadioAdvancedRemote { ... }
// Add a Projector?  +2 classes.  Add a VoiceRemote?  +3 more.`,
    count:
`Inheritance:  remotes × devices  = 2 × 2 = 4 classes   (3 × 4 = 12 classes)
Bridge:       remotes + devices  = 2 + 2 = 4 classes   (3 + 4 =  7 classes)`,
    usage:
`RemoteControl basic = new RemoteControl(new Tv());
AdvancedRemote advanced = new AdvancedRemote(new Radio());
advanced.mute();   // works for any Device, no RadioAdvancedRemote class needed`,
  },

  body: {
    intent: `<p>When a class varies along <strong>two independent dimensions</strong>, inheritance forces you to create a subclass for every combination. Bridge splits the two dimensions into two hierarchies: the <strong>abstraction</strong> (what the user works with) and the <strong>implementation</strong> (what does the low-level work). The abstraction holds a reference to an implementation; that reference is the “bridge”.</p>
<div class="callout"><p>In one sentence: <strong>replace “A × B” subclasses with “A + B” classes connected by composition.</strong></p></div>`,

    problem: `<p>A smart-home app has remote controls (basic and advanced) and devices (TV and radio). Modelling every pairing with inheritance gives one class per combination:</p>
{{snippet:problem}}
<p>Every new remote must be written once per device, and every new device once per remote. The number of classes multiplies, the same code is copied between them, and a change to how volume works must be made in many places. This is often called a <strong>class explosion</strong>.</p>`,

    solution: `<p>Treat the two dimensions separately, and connect them with an object reference instead of inheritance:</p>
<ol>
  <li>Move the device side into its own interface, <code>Device</code> (the <strong>implementor</strong>), with concrete classes <code>Tv</code> and <code>Radio</code>.</li>
  <li>Let <code>RemoteControl</code> (the <strong>abstraction</strong>) hold a <code>Device</code> field and express its actions through it: <code>volumeUp()</code> calls <code>device.setVolume(...)</code>.</li>
  <li>Extend the abstraction for new remote features (<code>AdvancedRemote</code>, a <strong>refined abstraction</strong>) without touching any device class.</li>
</ol>
<div class="flow" aria-label="RemoteControl and AdvancedRemote hold a Device; Tv and Radio implement Device">
  <span class="node">RemoteControl / AdvancedRemote</span><span class="arrow">— has a →</span>
  <span class="node key">Device</span><span class="arrow">←</span>
  <span class="node">Tv / Radio</span>
</div>
{{snippet:count}}
{{snippet:usage}}
<p>This is the principle <em>“favor composition over inheritance”</em> applied to a real design problem. Because the device is just a field, it can even be switched at run time.</p>`,

    when: `<ul>
  <li>A class varies in two independent dimensions, and the combinations keep multiplying.</li>
  <li>You want to add new abstractions and new implementations independently of each other.</li>
  <li>You want to choose or switch the implementation at run time.</li>
  <li>You want to hide platform-specific details from high-level code.</li>
</ul>
<div class="callout"><p><strong>Bridge or Adapter?</strong> Both put one object in front of another. Adapter is applied <em>after</em> the fact, to make existing incompatible classes work together. Bridge is chosen <em>up front</em>, so two parts of a design can evolve independently.</p></div>`,

    "real-world": `<ul>
  <li><strong>JDBC:</strong> your code uses the <code>java.sql</code> interfaces (the abstraction), and each database vendor supplies a driver (the implementation).</li>
  <li><strong>Graphics:</strong> shapes (circle, square) drawn by different renderers (vector, raster, OpenGL).</li>
  <li><strong>Messaging:</strong> message types (alert, reminder, newsletter) sent through different channels (email, SMS, push).</li>
  <li><strong>Logging:</strong> a logging API on top of interchangeable back-ends that write to files, consoles or remote servers.</li>
</ul>`,
  },

  walkthrough: [
    { file: "Device.java", find: "public interface Device {", span: 9,
      title: "The implementor interface",
      body: "These are primitive operations that every device supports. They say nothing about remote controls." },
    { file: "Tv.java", find: "public class Tv implements Device {", span: 5,
      title: "Concrete implementors",
      body: "Tv and Radio implement the same operations in their own way: a TV clamps volume to 0–100, a radio to 0–30 and uses FM stations as channels." },
    { file: "RemoteControl.java", find: "protected final Device device;", span: 5,
      title: "The bridge: a reference to a Device",
      body: "The abstraction holds an implementor. protected lets refined abstractions reach it; final means it is set once, through the constructor." },
    { file: "RemoteControl.java", find: "public void volumeUp() {", span: 4,
      title: "High-level actions delegate to the device",
      body: "volumeUp() is written once, in terms of getVolume() and setVolume(), and works for every device that exists now or later." },
    { file: "AdvancedRemote.java", find: "public void mute() {", span: 12,
      title: "A refined abstraction adds features",
      body: "Mute is built only from Device operations, so it works for a TV and a radio alike. No device class changed." },
    { file: "Demo.java", find: "RemoteControl basic = new RemoteControl(new Tv());", span: 10,
      title: "Any remote with any device",
      body: "The pairing is decided by passing a device into a remote’s constructor, not by choosing among combination subclasses." },
  ],

  mistakes: [
    { title: "Extending a device to add remote features",
      effect: "Inheritance across the bridge brings the class explosion back: a mute feature would need TvMuteRemote, RadioMuteRemote, and so on.",
      wrong: "public class TvMuteRemote extends Tv { ... }", right: "public class AdvancedRemote extends RemoteControl { ... }" },
    { title: "Depending on a concrete device",
      effect: "The remote then works with only one kind of device, so the two sides are no longer independent.",
      wrong: "protected final Tv device;", right: "protected final Device device;" },
    { title: "Assigning the field to itself",
      effect: "device = device assigns the parameter to itself, so the field stays null and the first call throws NullPointerException.",
      wrong: "public RemoteControl(Device device) {\n    device = device;\n}", right: "public RemoteControl(Device device) {\n    this.device = device;\n}" },
    { title: "Putting high-level logic into the implementor",
      effect: "If Device gains a mute() method, every device must implement remote behaviour, and the two hierarchies blur together.",
      wrong: "public interface Device {\n    void mute();   // a remote feature\n}",
      right: "// Keep Device primitive; build mute() in the abstraction\ndevice.setVolume(0);" },
  ],

  tradeoffs: {
    pros: ["Avoids a class for every combination: A + B instead of A × B.", "Abstractions and implementations can be extended independently (Open/Closed).", "The implementation can be chosen or swapped at run time.", "High-level code is shielded from platform details."],
    cons: ["Adds indirection that can be over-engineering for a class with only one dimension.", "The two hierarchies must be identified correctly up front, which takes design experience.", "Behaviour is spread over two places, which can make the code harder to follow at first."],
  },

  quiz: {
    id: "bridge-mcq",
    questions: [
      { id: "q1", q: "In this example, which class is the abstraction?",
        options: [
          { correct: true, text: "RemoteControl", why: "Right. It holds a Device reference and defines high-level actions. AdvancedRemote is a refined abstraction." },
          { text: "Device", why: "Device is the implementor interface." },
          { text: "Tv", why: "Tv is a concrete implementor." },
          { text: "Demo", why: "Demo is the client." },
        ] },
      { id: "q2", q: "With Bridge, how many classes do 3 kinds of remote and 4 kinds of device need?",
        options: [
          { text: "12", why: "That is the inheritance count (3 × 4), one class per combination." },
          { correct: true, text: "7", why: "Right. 3 remote classes + 4 device classes, connected by composition." },
          { text: "1", why: "Each kind of remote and each kind of device still needs its own class." },
          { text: "3", why: "The device side also needs its own classes." },
        ] },
      { id: "q3", q: "Which principle is Bridge built on?",
        options: [
          { text: "Every class should be a Singleton.", why: "Bridge has nothing to do with the number of instances." },
          { correct: true, text: "Favor composition over inheritance.", why: "Right. The abstraction has a device instead of being a device, which is what stops the combinations from multiplying." },
          { text: "Always use static methods.", why: "Static methods cannot be swapped at run time, which is one of Bridge’s benefits." },
          { text: "Prefer deep inheritance hierarchies.", why: "Deep combined hierarchies are exactly what Bridge avoids." },
        ] },
      { id: "q4", q: "Scenario: a chat app has message types (Text, Image, Video) and platforms (WhatsApp, Telegram). The developer wrote TextWhatsApp, ImageTelegram and so on. Adding one platform now means three new classes. What fits best?",
        options: [
          { correct: true, text: "Bridge", why: "Right. Two independent dimensions multiplied through inheritance. Bridge keeps messages and platforms in separate hierarchies connected by a reference." },
          { text: "Adapter", why: "Adapter fixes a single interface mismatch. Here the problem is the growing number of combinations." },
          { text: "Abstract Factory", why: "Nothing has to match as a family. The pain is the class explosion itself." },
          { text: "Composite", why: "Messages and platforms do not form a part-whole tree." },
        ] },
      { id: "q5", q: "Scenario: a drawing app has shapes (Circle, Square) that must be drawn by different renderers (SVG, OpenGL), and the renderer can be switched while the app runs. What fits best?",
        options: [
          { text: "Prototype", why: "Copying shapes does not separate shapes from renderers." },
          { text: "Singleton", why: "There are several renderers to choose from, not one shared object." },
          { correct: true, text: "Bridge", why: "Right. Shape is the abstraction and Renderer the implementor. Holding the renderer as a field also makes run-time switching easy." },
          { text: "Builder", why: "Building a shape is not the problem; combining two dimensions is." },
        ] },
    ],
  },

  fixBug: {
    id: "bridge-fix",
    title: "Find the mistakes",
    intro: "This code should let any remote control any device. It has three mistakes.",
    lines: [
      "public interface Device {",
      "    void setVolume(int volume);",
      "    int getVolume();",
      "}",
      "",
      "public class RemoteControl {",
      "    protected Device device;",
      "",
      "    public RemoteControl(Device device) {",
      "        device = device;",
      "    }",
      "",
      "    public void volumeUp() {",
      "        device.setVolume(device.getVolume() + 1);",
      "    }",
      "}",
      "",
      "public class TvMuteRemote extends Tv {",
      "    public void mute() { setVolume(0); }",
      "}",
      "",
      "// Client: turn up the volume of this TV",
      "Tv livingRoomTv = new Tv();",
      "RemoteControl remote = new RemoteControl(new Tv());",
      "remote.volumeUp();",
    ],
    bugs: {
      9: { fix: "        this.device = device;", why: "Without this, the parameter is assigned to itself and the field stays null." },
      17: { fix: "public class MuteRemote extends RemoteControl {   // constructor: super(device)", why: "New remote features belong in the abstraction hierarchy. Extending Tv ties mute to one device and restarts the class explosion." },
      23: { fix: "RemoteControl remote = new RemoteControl(livingRoomTv);", why: "The remote controls a brand-new Tv, not the living-room TV the client wanted. Pass the existing device into the bridge." },
    },
    falseNotes: {
      6: "protected lets refined abstractions such as MuteRemote use the device. That is intended.",
      13: "Delegating to the device’s primitive operations is exactly how the abstraction should work.",
      22: "Creating the TV is fine; the problem is that it is never passed to the remote.",
    },
  },
};
