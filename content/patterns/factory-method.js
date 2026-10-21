// Factory Method (and Simple Factory): full guide.
const BASE = "java/patterns/creational/factorymethod/";

export default {
  id: "factory-method",
  lead: "Move the decision about which class to instantiate out of the code that uses the object, so that code depends only on an interface.",

  files: [
    { name: "Notification.java", path: BASE + "Notification.java", role: "The product interface" },
    { name: "EmailNotification.java", path: BASE + "EmailNotification.java", role: "Concrete product" },
    { name: "SmsNotification.java", path: BASE + "SmsNotification.java", role: "Concrete product" },
    { name: "PushNotification.java", path: BASE + "PushNotification.java", role: "Concrete product" },
    { name: "SimpleNotificationFactory.java", path: BASE + "SimpleNotificationFactory.java", role: "Simple Factory: one static method decides" },
    { name: "Channel.java", path: BASE + "Channel.java", role: "Enum of available channels" },
    { name: "NotificationSender.java", path: BASE + "NotificationSender.java", role: "GoF Factory Method: the abstract creator" },
    { name: "EmailSender.java", path: BASE + "EmailSender.java", role: "Concrete creator: overrides the factory method" },
    { name: "SmsSender.java", path: BASE + "SmsSender.java", role: "Concrete creator" },
    { name: "PushSender.java", path: BASE + "PushSender.java", role: "Concrete creator" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Client code using both approaches" },
  ],

  snippets: {
    problem:
`// Copied into the order screen, the profile screen and the scheduler...
Notification n;
if (type.equals("email")) {
    n = new EmailNotification();
} else if (type.equals("sms")) {
    n = new SmsNotification();
} else {
    n = new PushNotification();
}
n.send(user, message);`,
    simple:
`Notification n = SimpleNotificationFactory.create(Channel.SMS);
n.send("+966500000000", "Your order is on its way.");`,
    gof:
`NotificationSender sender = new EmailSender();   // pick a creator once
sender.notifyUser("sara@example.com", "Your receipt is attached.");`,
    whyNotSwitch:
`// Adding WhatsApp with a Simple Factory: edit tested code
case WHATSAPP: return new WhatsAppNotification();

// Adding WhatsApp with Factory Method: only new code
public class WhatsAppSender extends NotificationSender {
    @Override
    protected Notification createNotification() {
        return new WhatsAppNotification();
    }
}`,
  },

  body: {
    intent: `<p>Code that calls <code>new EmailNotification()</code> is tied to that exact class. Factory Method breaks that tie: object creation goes through a <strong>creation method</strong> that returns an <strong>interface</strong>, and the decision about the concrete class is made in one place.</p>
<div class="callout"><p>In the original GoF form: <strong>define a method for creating an object, and let subclasses decide which class to instantiate.</strong></p></div>`,

    problem: `<p>An app sends notifications by email, SMS or push. The choice of class is written out wherever a notification is sent:</p>
{{snippet:problem}}
<ul>
  <li><strong>Duplication:</strong> the same <code>if/else</code> appears in several places.</li>
  <li><strong>Tight coupling:</strong> client code names every concrete class, so it changes whenever a class changes.</li>
  <li><strong>Hard to extend:</strong> adding WhatsApp means finding and editing every copy, which breaks the <em>Open/Closed Principle</em> (open for extension, closed for modification).</li>
</ul>`,

    solution: `<p>All notifications implement one interface, <code>Notification</code>. Client code asks for “a notification” and never calls <code>new</code> on a concrete class. There are two common ways to organise the creation. They are often confused, so this guide shows both.</p>
<h3>1. Simple Factory (an idiom)</h3>
<p>One class with one <code>static</code> method holds the decision. This is what most people first write, and it already removes the duplication.</p>
{{snippet:simple}}
<h3>2. Factory Method (the GoF pattern)</h3>
<p>An abstract <strong>creator</strong> class declares a <code>createNotification()</code> method and uses it inside its own logic (<code>notifyUser</code>). Each <strong>subclass overrides</strong> that method to return a different product. The decision moves from a <code>switch</code> into inheritance.</p>
<div class="flow" aria-label="NotificationSender declares createNotification; EmailSender, SmsSender and PushSender override it">
  <span class="node key">NotificationSender.createNotification()</span><span class="arrow">←</span>
  <span class="node">EmailSender</span><span class="node">SmsSender</span><span class="node">PushSender</span>
</div>
{{snippet:gof}}
<div class="table-wrap"><table class="t">
  <thead><tr><th></th><th>Simple Factory</th><th>Factory Method (GoF)</th></tr></thead>
  <tbody>
    <tr><td>Where the choice lives</td><td>A <code>switch</code> or <code>if</code> in one static method</td><td>Subclasses that override the creation method</td></tr>
    <tr><td>Adding a product</td><td>Edit the factory (modify tested code)</td><td>Add a new subclass (extend, no edits)</td></tr>
    <tr><td>Uses inheritance</td><td>No</td><td>Yes</td></tr>
    <tr><td>Best for</td><td>A small, stable set of types</td><td>Frameworks and code that others extend</td></tr>
  </tbody>
</table></div>
<h3>So why not just use a switch?</h3>
<p>A <code>switch</code> works, and a Simple Factory is a perfectly good choice for a small, stable set of types. Its limit is the Open/Closed Principle: every new type means opening and editing the factory. With a real Factory Method, a new type is a new subclass, and existing code stays untouched.</p>
{{snippet:whyNotSwitch}}
<p>If you do switch on a <code>String</code>, check for <code>null</code> first (a <code>switch</code> on <code>null</code> throws <code>NullPointerException</code>) and remember it is case-sensitive. Switching on an <code>enum</code>, as in this example, avoids both problems.</p>`,

    when: `<ul>
  <li>The exact class to create is only known at run time (from user settings, configuration or input).</li>
  <li>The same <code>if/else</code> creation code appears in several places.</li>
  <li>You want to add new product types without changing the code that uses them.</li>
  <li>You are writing a library or framework and want users to plug in their own classes (GoF form).</li>
</ul>
<div class="callout"><p><strong>Skip it</strong> when there is only one implementation and no sign of more. Calling <code>new</code> directly is simpler.</p></div>`,

    "real-world": `<ul>
  <li><strong>JDK:</strong> <code>List.of(...)</code>, <code>Calendar.getInstance()</code>, <code>NumberFormat.getCurrencyInstance()</code> and <code>Executors.newFixedThreadPool(...)</code> return an interface type and hide the concrete class.</li>
  <li><strong>Frameworks:</strong> a framework calls a creation method that your subclass overrides, for example to create a custom view, handler or connection.</li>
  <li><strong>Apps:</strong> payment methods, export formats (PDF, CSV, Excel), notification channels, and ride types chosen at run time.</li>
</ul>`,
  },

  walkthrough: [
    { file: "Notification.java", find: "public interface Notification {", span: 3,
      title: "One interface for every product",
      body: "Client code depends on this interface only. That is “program to an interface, not an implementation”." },
    { file: "SimpleNotificationFactory.java", find: "public static Notification create(Channel channel) {", span: 11,
      title: "Simple Factory: the decision in one static method",
      body: "The return type is the interface, so callers never see the concrete classes. The null check runs first, because a switch on null throws NullPointerException." },
    { file: "NotificationSender.java", find: "protected abstract Notification createNotification();", span: 1,
      title: "GoF: the factory method is abstract",
      body: "The creator declares what it needs (a Notification) but not which one. Each subclass will fill in the answer." },
    { file: "NotificationSender.java", find: "public void notifyUser(String recipient, String message) {", span: 5,
      title: "The creator uses the product without knowing its class",
      body: "notifyUser works the same for every channel. It calls the factory method and talks to the result through the interface." },
    { file: "EmailSender.java", find: "protected Notification createNotification() {", span: 3,
      title: "A subclass decides",
      body: "EmailSender overrides one method to choose its product. Adding a new channel means adding a new subclass like this one, without editing existing classes." },
    { file: "Demo.java", find: "Notification n = SimpleNotificationFactory.create(Channel.SMS);", span: 8,
      title: "Both approaches in client code",
      body: "Neither call names EmailNotification, SmsNotification or PushNotification. The program decides which object to use at run time." },
  ],

  mistakes: [
    { title: "Returning a concrete type",
      effect: "Callers become tied to SmsNotification again, and the factory no longer hides anything.",
      wrong: "public static SmsNotification create(Channel c) {", right: "public static Notification create(Channel c) {" },
    { title: "extends instead of implements",
      effect: "Notification is an interface, so a class implements it. extends does not compile here.",
      wrong: "public class SmsNotification extends Notification {", right: "public class SmsNotification implements Notification {" },
    { title: "Comparing strings with ==",
      effect: "== compares object references, not text, so the branch may never match even when the text is the same.",
      wrong: "if (type == \"sms\") { ... }", right: "if (\"sms\".equalsIgnoreCase(type)) { ... }" },
    { title: "Switching on a String without a null check",
      effect: "switch (type) throws NullPointerException when type is null, and \"SMS\" does not match case \"sms\".",
      wrong: "switch (type) {\n    case \"sms\": return new SmsNotification();\n}",
      right: "if (type == null) throw new IllegalArgumentException(\"type\");\nswitch (type.toLowerCase()) {\n    case \"sms\": return new SmsNotification();\n}" },
    { title: "Calling new on a static factory",
      effect: "create is static, so it is called on the class. new SimpleNotificationFactory().create(...) does not even compile here, because the constructor is private.",
      wrong: "new SimpleNotificationFactory().create(Channel.SMS);", right: "SimpleNotificationFactory.create(Channel.SMS);" },
    { title: "Calling it “Factory Method” when it is a Simple Factory",
      effect: "Both are useful, but they are different designs. Factory Method relies on subclasses overriding a creation method; a static method with a switch is a Simple Factory.",
      wrong: "// \"Factory Method\"\nstatic Notification create(String type) { switch (type) { ... } }",
      right: "// Factory Method\nabstract class NotificationSender {\n    protected abstract Notification createNotification();\n}" },
  ],

  tradeoffs: {
    pros: ["Client code depends on an interface, not on concrete classes.", "Creation logic lives in one place (Single Responsibility).", "New products can be added as new classes (Open/Closed, in the GoF form).", "Easy to swap implementations, for example in tests."],
    cons: ["More classes: one creator subclass per product in the GoF form.", "A Simple Factory still needs editing for every new type.", "Overkill when there is only one implementation."],
  },

  quiz: {
    id: "factory-method-mcq",
    questions: [
      { id: "q1", q: "What makes a design a GoF Factory Method rather than a Simple Factory?",
        options: [
          { text: "It uses a switch statement.", why: "A switch is typical of a Simple Factory, not of the GoF pattern." },
          { correct: true, text: "Subclasses override a creation method to decide which product to create.", why: "Right. The decision lives in inheritance: each creator subclass returns its own product." },
          { text: "The creation method is static.", why: "A static method cannot be overridden, so it cannot be a GoF Factory Method." },
          { text: "It creates families of related products.", why: "That describes Abstract Factory." },
        ] },
      { id: "q2", q: "Why should a factory’s return type be the interface (Notification) and not EmailNotification?",
        options: [
          { correct: true, text: "So client code depends only on the interface and does not know the concrete class.", why: "Right. That is what lets you swap or add implementations without touching the client." },
          { text: "Because interfaces are faster.", why: "Performance is not the reason; decoupling is." },
          { text: "Java requires factories to return interfaces.", why: "Java has no such rule. It is a design choice." },
          { text: "So the factory can return null.", why: "Any reference type can be null. That is not the reason." },
        ] },
      { id: "q3", q: "A Simple Factory uses switch (type) on a String. What happens if type is null?",
        options: [
          { text: "The default branch runs.", why: "A switch on a null String never reaches default." },
          { correct: true, text: "A NullPointerException is thrown.", why: "Right. Check for null before the switch, or switch on an enum." },
          { text: "It returns null automatically.", why: "Nothing is returned; the switch itself throws." },
          { text: "It does not compile.", why: "It compiles. The problem only appears at run time." },
        ] },
      { id: "q4", q: "Scenario: if (format.equals(\"pdf\")) new PdfExporter(); else if … is copied into five screens, and supporting Excel means editing all five. What fits best?",
        options: [
          { correct: true, text: "Factory Method (or at least a Simple Factory)", why: "Right. One creation method returning an Exporter interface removes the duplication and the coupling." },
          { text: "Abstract Factory", why: "Only one product (an exporter) is created each time. There is no family of products." },
          { text: "Adapter", why: "All exporters are your own classes and share one idea. Nothing needs translating." },
          { text: "Singleton", why: "The problem is choosing a type, not limiting the number of instances." },
        ] },
      { id: "q5", q: "Scenario: a shop creates one of three independent discounts (Student, VIP, Employee) based on the user’s choice. Nothing has to match anything else. Which pattern?",
        options: [
          { text: "Abstract Factory, because there are three related classes.", why: "This is a trap: each call creates one object, and nothing must be used together, so there is no family." },
          { correct: true, text: "Factory Method", why: "Right. One product per call, chosen at run time." },
          { text: "Builder", why: "Each discount is simple to create. The question is which one to create." },
          { text: "Singleton", why: "Different users need different discounts, so one shared object does not fit." },
        ] },
    ],
  },

  completion: {
    id: "factory-method-complete",
    title: "Complete both factories",
    hint: "The top half is a Simple Factory, the bottom half is a GoF Factory Method.",
    code:
`public interface Exporter { String export(String data); }

public class PdfExporter [[0]] Exporter {
    public String export(String data) { return "PDF: " + data; }
}

public final class ExporterFactory {
    public [[1]] Exporter create(Format format) {
        if (format == null) throw new IllegalArgumentException("format");
        switch (format) {
            case PDF: return [[2]];
            case CSV: return new CsvExporter();
            default:  throw new IllegalArgumentException("Unknown: " + format);
        }
    }
}

public abstract class ReportService {
    protected abstract Exporter [[3]]();

    public void publish(String data) {
        Exporter exporter = createExporter();
        System.out.println(exporter.export(data));
    }
}

public class PdfReportService [[4]] ReportService {
    @Override
    protected Exporter createExporter() { return new PdfExporter(); }
}

// Client code using the Simple Factory:
Exporter csv = [[5]];`,
    blanks: [
      { answers: ["implements"], width: 11, why: "Exporter is an interface, so PdfExporter implements it." },
      { answers: ["static"], width: 7, why: "A Simple Factory method is static: it is called on the class, without an instance." },
      { answers: ["new PdfExporter()", "new PdfExporter();"], width: 18, why: "The factory is the only place that calls new on the concrete class." },
      { answers: ["createExporter"], width: 15, why: "This is the factory method. publish() calls it, and subclasses override it." },
      { answers: ["extends"], width: 8, why: "ReportService is an abstract class, so the concrete creator extends it." },
      { answers: ["ExporterFactory.create(Format.CSV)", "ExporterFactory.create(Format.CSV);"], width: 30, why: "Call the static method on the class and pass the enum value. The client never writes new CsvExporter()." },
    ],
  },
};
