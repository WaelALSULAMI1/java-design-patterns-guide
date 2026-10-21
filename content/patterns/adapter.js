// Adapter: full guide.
const BASE = "java/patterns/structural/adapter/";

export default {
  id: "adapter",
  lead: "Let a class with an incompatible interface work with your code by wrapping it in a class that speaks the interface you expect.",

  files: [
    { name: "PaymentService.java", path: BASE + "PaymentService.java", role: "Target: the interface the app expects" },
    { name: "XmlPaymentGateway.java", path: BASE + "XmlPaymentGateway.java", role: "Adaptee: the third-party gateway (XML, halalas)" },
    { name: "PaymentAdapter.java", path: BASE + "PaymentAdapter.java", role: "Adapter: translates between the two" },
    { name: "CheckoutScreen.java", path: BASE + "CheckoutScreen.java", role: "Client: knows only PaymentService" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Wires the adapter into the app" },
  ],

  snippets: {
    problem:
`// Repeated in checkout, refunds, order history...
long halalas = Math.round(total * 100);
String xml = "<payment><order>" + id + "</order><amount currency=\\"SAR\\">" + halalas + "</amount></payment>";
String reply = gateway.processPayment(xml);
String status = reply.substring(reply.indexOf("<status>") + 8, reply.indexOf("</status>"));`,
    usage:
`PaymentService payments = new PaymentAdapter(new XmlPaymentGateway());
String receipt = payments.pay("ORD-17", 89.75);   // JSON in, JSON out`,
    classAdapter:
`// Class adapter (inheritance): possible in Java only when the target is an interface
public class PaymentClassAdapter extends XmlPaymentGateway implements PaymentService {
    public String pay(String orderId, double amountSar) {
        String xml = ...;                  // build the request
        return toJson(processPayment(xml)); // call the inherited method
    }
}`,
  },

  body: {
    intent: `<p>An adapter is a <strong>translator</strong>. It implements the interface your code already uses (the <em>target</em>), holds a reference to the class that does the real work (the <em>adaptee</em>), and converts every call from one form to the other.</p>
<div class="callout"><p>In one sentence: <strong>wrap an existing class so it fits the interface you expect.</strong> Think of a travel plug adapter: neither the socket nor the charger changes.</p></div>`,

    problem: `<p>A shopping app works with a <code>PaymentService</code> interface: amounts in riyals, results as JSON. The company switches to a new payment gateway whose library speaks XML and expects amounts in halalas. The library belongs to another company, so you cannot change it.</p>
<p>Without a plan, conversion code spreads to every place that takes a payment:</p>
{{snippet:problem}}
<ul>
  <li><strong>Duplication:</strong> the same conversion is repeated in many classes.</li>
  <li><strong>Coupling:</strong> business code now knows XML tags and halalas.</li>
  <li><strong>Lock-in:</strong> replacing the gateway later means touching all of that code again.</li>
</ul>`,

    solution: `<p>Put all the translation in one class that looks like what the app expects:</p>
<ol>
  <li>The adapter <strong>implements the target</strong> interface (<code>PaymentService</code>), so the client can use it like any other payment service.</li>
  <li>It <strong>holds a reference to the adaptee</strong> (<code>XmlPaymentGateway</code>). This is composition.</li>
  <li>Each target method <strong>converts</strong> the input, <strong>delegates</strong> the real work to the adaptee, and converts the result back.</li>
</ol>
<div class="flow" aria-label="CheckoutScreen calls PaymentService.pay on the adapter, which calls processPayment on the gateway">
  <span class="node">CheckoutScreen</span><span class="arrow">→</span>
  <span class="node">PaymentService</span><span class="arrow">→</span>
  <span class="node key">PaymentAdapter</span><span class="arrow">→</span>
  <span class="node">XmlPaymentGateway</span>
</div>
{{snippet:usage}}
<h3>Object adapter and class adapter</h3>
<p>The example is an <strong>object adapter</strong>: it <em>has</em> an adaptee (composition). A <strong>class adapter</strong> <em>is</em> an adaptee, through inheritance. In Java a class can extend only one class, so the class form works only when the target is an interface, and it ties the adapter to one concrete adaptee. The object adapter is more flexible and is the usual choice.</p>
{{snippet:classAdapter}}`,

    when: `<ul>
  <li>You want to use an existing class (third-party, legacy, generated code), but its interface does not match yours.</li>
  <li>You cannot, or should not, change that class.</li>
  <li>You want conversion logic in one place, so the rest of the code stays clean and the provider can be swapped later.</li>
</ul>
<div class="callout"><p><strong>Adapter or Bridge?</strong> Adapter fixes a mismatch between classes that <em>already exist</em>. Bridge is planned <em>up front</em> so two dimensions can grow independently.</p></div>`,

    "real-world": `<ul>
  <li><strong>JDK:</strong> <code>Arrays.asList(array)</code> lets an array be used as a <code>List</code>; <code>InputStreamReader</code> adapts a byte stream (<code>InputStream</code>) to a character stream (<code>Reader</code>).</li>
  <li><strong>Integrations:</strong> payment gateways, map and weather APIs, SMS providers, each wrapped behind your own interface.</li>
  <li><strong>Legacy systems:</strong> an old registration system that returns comma-separated text, adapted to return <code>Student</code> objects.</li>
  <li><strong>Data formats:</strong> XML to JSON, coordinates to city names, imperial to metric units.</li>
</ul>`,
  },

  walkthrough: [
    { file: "PaymentService.java", find: "public interface PaymentService {", span: 3,
      title: "The target: what the app wants",
      body: "Riyals in, JSON out. The rest of the app depends on this interface only." },
    { file: "XmlPaymentGateway.java", find: "public String processPayment(String xmlRequest) {", span: 5,
      title: "The adaptee: useful, but incompatible",
      body: "It does the real work, but it expects XML and halalas and answers in XML. We cannot change it." },
    { file: "PaymentAdapter.java", find: "public class PaymentAdapter implements PaymentService {", span: 7,
      title: "The adapter implements the target and holds the adaptee",
      body: "implements PaymentService lets it stand in for any payment service. The private gateway field is the wrapped object, received through the constructor." },
    { file: "PaymentAdapter.java", find: "// 1. Translate the request", span: 4,
      title: "Step 1: translate the request",
      body: "Riyals become halalas (Math.round avoids floating-point surprises: 19.99 × 100 is 1998.9999… as a double), and the values become an XML document." },
    { file: "PaymentAdapter.java", find: "// 2. Delegate the real work to the adaptee.", span: 2,
      title: "Step 2: delegate",
      body: "The adapter does not process payments itself. It calls the adaptee." },
    { file: "PaymentAdapter.java", find: "// 3. Translate the response: XML -> JSON.", span: 4,
      title: "Step 3: translate the response",
      body: "The XML reply is turned into the JSON the app expects. All format knowledge stays inside this class." },
    { file: "Demo.java", find: "PaymentService service = new PaymentAdapter(new XmlPaymentGateway());", span: 4,
      title: "The client never sees XML",
      body: "The variable type is the target interface. Swapping to another gateway later means writing another adapter; CheckoutScreen does not change." },
  ],

  mistakes: [
    { title: "Implementing the adaptee instead of the target",
      effect: "The adapter must look like what the client expects. Implementing the adaptee’s side makes it useless to the client.",
      wrong: "public class PaymentAdapter extends XmlPaymentGateway {", right: "public class PaymentAdapter implements PaymentService {" },
    { title: "Re-implementing the logic instead of delegating",
      effect: "An adapter that processes payments itself is no longer an adapter. It duplicates the adaptee and drifts out of sync with it.",
      wrong: "public String pay(String id, double amount) {\n    // my own payment logic...\n}",
      right: "public String pay(String id, double amount) {\n    String reply = gateway.processPayment(toXml(id, amount));\n    return toJson(reply);\n}" },
    { title: "Client code declared with the adapter or adaptee type",
      effect: "The client becomes tied to one implementation again. Declare variables with the target interface.",
      wrong: "PaymentAdapter payments = new PaymentAdapter(gateway);", right: "PaymentService payments = new PaymentAdapter(gateway);" },
    { title: "Creating the adaptee inside the adapter",
      effect: "Hard-coding new XmlPaymentGateway() makes the adapter impossible to test with a fake gateway or configure differently.",
      wrong: "private final XmlPaymentGateway gateway = new XmlPaymentGateway();",
      right: "public PaymentAdapter(XmlPaymentGateway gateway) {\n    this.gateway = gateway;\n}" },
    { title: "Putting business rules in the adapter",
      effect: "Discounts or stock checks do not belong in a translator. Keep the adapter about conversion only.",
      wrong: "double discounted = amountSar * 0.9;   // inside the adapter",
      right: "// Apply discounts before calling payments.pay(...)" },
  ],

  tradeoffs: {
    pros: ["Lets incompatible classes work together without changing them.", "Keeps conversion code in one place (Single Responsibility).", "New providers can be added as new adapters (Open/Closed).", "Client code stays tied to your interface, not to a vendor."],
    cons: ["One more class and one more layer to read through.", "Sometimes changing the original class is simpler, when you own it.", "A big mismatch can make the adapter itself complex."],
  },

  quiz: {
    id: "adapter-mcq",
    questions: [
      { id: "q1", q: "In this example, which class is the adaptee?",
        options: [
          { text: "PaymentService", why: "That is the target: the interface the client expects." },
          { correct: true, text: "XmlPaymentGateway", why: "Right. It is the existing class with the incompatible interface." },
          { text: "PaymentAdapter", why: "That is the adapter: the translator between the two." },
          { text: "CheckoutScreen", why: "That is the client, which only knows the target." },
        ] },
      { id: "q2", q: "Which statement about an object adapter is correct?",
        options: [
          { correct: true, text: "It implements the target interface and holds a reference to the adaptee.", why: "Right. It looks like the target from outside and delegates to the adaptee inside." },
          { text: "It extends both the target and the adaptee.", why: "Java allows only one superclass. An object adapter uses composition instead." },
          { text: "It changes the adaptee’s source code.", why: "The whole point is to avoid changing the adaptee." },
          { text: "It must be a Singleton.", why: "Adapters can be created as many times as needed." },
        ] },
      { id: "q3", q: "How is Adapter different from Bridge?",
        options: [
          { text: "Adapter is creational; Bridge is structural.", why: "Both are structural patterns." },
          { correct: true, text: "Adapter fixes a mismatch between existing classes; Bridge is designed up front so two dimensions can vary independently.", why: "Right. Adapter is applied after the fact; Bridge is a design decision made in advance." },
          { text: "Bridge wraps exactly one object; Adapter wraps a tree.", why: "Wrapping a tree is closer to Composite." },
          { text: "They are the same pattern with different names.", why: "Their structures look alike, but their purposes differ." },
        ] },
      { id: "q4", q: "Scenario: a map app uses a Location interface with decimal coordinates, but must use a legacy GPS library that returns text such as 21°29′N. The library cannot be changed. What fits best?",
        options: [
          { correct: true, text: "Adapter", why: "Right. An existing class you cannot change has the wrong interface. An adapter implements Location and converts the library’s output." },
          { text: "Bridge", why: "Bridge is a design choice for two dimensions. Here two existing pieces simply do not fit." },
          { text: "Composite", why: "There is no tree of objects to treat uniformly." },
          { text: "Singleton", why: "The number of instances is not the issue; the interface mismatch is." },
        ] },
      { id: "q5", q: "Scenario: a weather screen works with city names, but the new weather API only accepts latitude and longitude. The team also wants to swap providers later. What should they write?",
        options: [
          { text: "A Builder for weather requests.", why: "Building the request is easy. The problem is that the interfaces do not match." },
          { correct: true, text: "An adapter that implements the city-based interface and converts to coordinates.", why: "Right. The screen keeps using city names, and a new provider later means a new adapter." },
          { text: "A Prototype of the weather response.", why: "Copying a response does not convert city names to coordinates." },
          { text: "An Abstract Factory of weather screens.", why: "There is no family of products to keep consistent." },
        ] },
    ],
  },

  completion: {
    id: "adapter-complete",
    title: "Complete the adapter",
    hint: "The app uses Thermometer; a third-party sensor only reports Fahrenheit.",
    code:
`public interface Thermometer {          // target
    double getCelsius();
}

public class FahrenheitSensor {         // adaptee (cannot change)
    public double readFahrenheit() { return 98.6; }
}

public class SensorAdapter [[0]] {
    private final [[1]] sensor;

    public SensorAdapter(FahrenheitSensor sensor) {
        [[2]]
    }

    @Override
    public double getCelsius() {
        return ([[3]] - 32) * 5 / 9;
    }
}

// Client code:
[[4]] t = new SensorAdapter(new FahrenheitSensor());`,
    blanks: [
      { answers: ["implements Thermometer"], width: 22, why: "The adapter must look like the target, so it implements Thermometer." },
      { answers: ["FahrenheitSensor"], width: 17, why: "The adapter holds the adaptee (composition)." },
      { answers: ["this.sensor = sensor;", "this.sensor = sensor"], width: 22, why: "Store the adaptee that was passed in, so it can be replaced or faked in tests." },
      { answers: ["sensor.readFahrenheit()"], width: 24, why: "Delegate to the adaptee, then convert its answer." },
      { answers: ["Thermometer"], width: 12, why: "Clients depend on the target interface, not on the adapter class." },
    ],
  },
};
