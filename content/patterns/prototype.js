// Prototype: full guide.
const BASE = "java/patterns/creational/prototype/";

export default {
  id: "prototype",
  lead: "Create new objects by copying an existing, ready-made object, instead of building each one from scratch.",

  files: [
    { name: "OrderTemplate.java", path: BASE + "OrderTemplate.java", role: "The prototype: an expensive object with a copy constructor" },
    { name: "Address.java", path: BASE + "Address.java", role: "A mutable part that must be copied too (deep copy)" },
    { name: "TemplateRegistry.java", path: BASE + "TemplateRegistry.java", role: "A prototype registry that hands out copies" },
    { name: "RestaurantApi.java", path: BASE + "RestaurantApi.java", role: "Simulates slow API calls and counts them" },
    { name: "Document.java", path: BASE + "Document.java", role: "The same idea with Java’s Cloneable interface" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Client code: two orders, no extra API calls" },
  ],

  snippets: {
    problem:
`// Every order repeats the same slow calls
OrderTemplate monday = new OrderTemplate("Burger House", "c-42");  // 2 API calls
OrderTemplate friday = new OrderTemplate("Burger House", "c-42");  // 2 more, same data`,
    usage:
`OrderTemplate template = new OrderTemplate("Burger House", "c-42");  // expensive, once
OrderTemplate monday = template.copy();                              // cheap
OrderTemplate friday = template.copy();                              // cheap
friday.addItem("Ice cream");                                         // monday is not affected`,
    shallow:
`// Shallow: both objects point to the same list
this.items = source.items;

// Deep: the copy gets its own list
this.items = new ArrayList<>(source.items);`,
  },

  body: {
    intent: `<p>Prototype moves the job of copying into the object itself. Instead of asking “how do I build this from scratch?”, you ask an existing object to <strong>make a copy of itself</strong>, and then adjust the copy.</p>
<div class="callout"><p>In one sentence: <strong>clone a ready-made object instead of constructing a new one.</strong></p></div>`,

    problem: `<p>A food delivery app keeps a default order template for each customer: a usual meal and a delivery address, both fetched through slow, paid API calls. Every new order rebuilds the template from scratch and repeats the same calls.</p>
{{snippet:problem}}
<p>The cost grows with every order, and the code that fills in the template is repeated wherever an order is created. Copying the object from the outside is not a clean fix either: the outside code may not see private fields, and it becomes tied to the concrete class it copies.</p>`,

    solution: `<p>Give the class a way to copy itself, then create the expensive object once and copy it whenever you need another one.</p>
<ol>
  <li>Add a <strong>copy constructor</strong> (or override <code>clone()</code>) that copies every field from a source object.</li>
  <li>Add a short <strong><code>copy()</code></strong> method that returns <code>new OrderTemplate(this)</code>.</li>
  <li>Copy mutable parts <strong>deeply</strong>, so changing a copy never changes the original.</li>
  <li>Optionally keep ready-made prototypes in a <strong>registry</strong> and hand out copies by name.</li>
</ol>
<div class="flow" aria-label="Build the template once, then copy it for each order">
  <span class="node">new OrderTemplate(...)</span><span class="arrow">→</span>
  <span class="node key">prototype</span><span class="arrow">→</span>
  <span class="node">.copy()</span><span class="arrow">→</span>
  <span class="node">monday, friday, …</span>
</div>
{{snippet:usage}}
<h3>Shallow copy and deep copy</h3>
<p>A <strong>shallow copy</strong> copies field values as they are. For a reference such as a list, that means both objects point to the <em>same</em> list, so adding an item to one adds it to the other. A <strong>deep copy</strong> also copies the objects inside, so the copy is fully independent.</p>
{{snippet:shallow}}
<p>Immutable values such as <code>String</code> can be shared safely. Mutable ones, such as <code>List</code> or <code>Address</code> here, need their own copies. Java’s <code>Object.clone()</code> makes a shallow copy, which is why <code>Document.clone()</code> copies its list by hand.</p>`,

    when: `<ul>
  <li>Creating an object is expensive (network, database, disk, heavy calculation), but copying it is cheap.</li>
  <li>You need many similar objects that start from the same preset or template.</li>
  <li>Your code should copy objects without depending on their concrete classes.</li>
  <li>You would otherwise create many subclasses that differ only in their initial settings.</li>
</ul>
<div class="callout"><p><strong>Watch out</strong> when objects have deep or circular references: writing a correct deep copy becomes tricky, and a bug there is hard to notice.</p></div>`,

    "real-world": `<ul>
  <li><strong>Templates and presets:</strong> document templates, email templates, default orders, game levels.</li>
  <li><strong>Games:</strong> spawning many enemies with the same armour and AI settings loaded once from disk.</li>
  <li><strong>Editors:</strong> “Duplicate” in a drawing or slide app copies a complex group of shapes.</li>
  <li><strong>JDK:</strong> <code>ArrayList</code> and <code>HashMap</code> implement <code>Cloneable</code>, and copy constructors such as <code>new ArrayList&lt;&gt;(otherList)</code> follow the same idea.</li>
</ul>`,
  },

  walkthrough: [
    { file: "OrderTemplate.java", find: "public OrderTemplate(String restaurant, String customerId) {", span: 6,
      title: "The expensive constructor",
      body: "This is the slow path: it calls the remote API twice. With Prototype it runs only once, to build the template." },
    { file: "OrderTemplate.java", find: "private OrderTemplate(OrderTemplate source) {", span: 6,
      title: "A copy constructor with a deep copy",
      body: "String is immutable, so sharing it is safe. The list and the Address are mutable, so the copy gets new ones; otherwise a change in one order would appear in the other." },
    { file: "OrderTemplate.java", find: "public OrderTemplate copy() {", span: 3,
      title: "copy(): one line, no API calls",
      body: "The prototype operation simply calls the copy constructor. Note the new: a copy is a new object, never this." },
    { file: "Address.java", find: "public Address(Address source) {", span: 3,
      title: "Nested objects need their own copy method",
      body: "A deep copy works level by level: OrderTemplate copies its Address by calling Address’s own copy constructor." },
    { file: "TemplateRegistry.java", find: "public OrderTemplate create(String key) {", span: 7,
      title: "A registry hands out copies",
      body: "Ready-made prototypes are stored by name. Callers always receive a copy, so the stored original stays clean." },
    { file: "Demo.java", find: "OrderTemplate monday = registry.create(\"usual\");", span: 9,
      title: "Proof: independent copies, no extra calls",
      body: "Friday’s extra item and new street do not affect Monday, and the API call counter stays at 2." },
    { file: "Document.java", find: "public Document clone() {", span: 8,
      title: "The Cloneable version",
      body: "super.clone() copies all fields, but it is a shallow copy: pages would still be shared. The next line gives the copy its own list. Cloneable must be implemented, or super.clone() throws CloneNotSupportedException." },
  ],

  mistakes: [
    { title: "Returning this instead of a copy",
      effect: "The “copy” is the same object, so original == copy is true and every change affects both.",
      wrong: "public OrderTemplate copy() {\n    return this;\n}", right: "public OrderTemplate copy() {\n    return new OrderTemplate(this);\n}" },
    { title: "Sharing a mutable list (shallow copy)",
      effect: "Adding an item to one order adds it to every order made from the same template.",
      wrong: "this.items = source.items;", right: "this.items = new ArrayList<>(source.items);" },
    { title: "Forgetting nested objects",
      effect: "The list is copied, but the Address is still shared, so changing one order’s street changes the original too.",
      wrong: "this.address = source.address;", right: "this.address = new Address(source.address);" },
    { title: "Repeating the expensive work inside copy()",
      effect: "Calling the expensive constructor again defeats the purpose: the API calls are repeated for every copy.",
      wrong: "public OrderTemplate copy() {\n    return new OrderTemplate(restaurant, customerId);\n}",
      right: "public OrderTemplate copy() {\n    return new OrderTemplate(this);   // copy constructor\n}" },
    { title: "Calling super.clone() without implementing Cloneable",
      effect: "Object.clone() throws CloneNotSupportedException at run time.",
      wrong: "public class Document {", right: "public class Document implements Cloneable {" },
  ],

  tradeoffs: {
    pros: ["Avoids repeating expensive set-up work.", "Copies objects without depending on their concrete classes.", "Replaces many preset subclasses with a few configured prototypes.", "New presets can be added at run time by registering a new prototype."],
    cons: ["Deep copies of complex objects, especially with circular references, are hard to get right.", "Every class in the copy chain needs its own copy logic.", "Java’s Cloneable is easy to misuse; many developers prefer copy constructors."],
  },

  quiz: {
    id: "prototype-mcq",
    questions: [
      { id: "q1", q: "What is the main problem Prototype solves?",
        options: [
          { correct: true, text: "Creating many similar objects is expensive or complicated.", why: "Right. Prototype builds the expensive object once and copies it." },
          { text: "A class must have only one instance.", why: "That is Singleton. Prototype creates more objects, not fewer." },
          { text: "A constructor has too many optional parameters.", why: "That is Builder’s problem: how to assemble one object, not how to repeat it." },
          { text: "Two interfaces do not match.", why: "That is Adapter, a structural pattern." },
        ] },
      { id: "q2", q: "A copy constructor contains this.items = source.items; for a List. What kind of copy is this?",
        options: [
          { text: "A deep copy", why: "A deep copy would create a new list. Here both objects point to the same one." },
          { correct: true, text: "A shallow copy: both objects share the same list", why: "Right. Use new ArrayList<>(source.items) so the copy gets its own list." },
          { text: "No copy at all: it will not compile", why: "It compiles fine. The problem only shows up when one object’s list changes." },
          { text: "A singleton list", why: "Sharing a list by accident has nothing to do with Singleton." },
        ] },
      { id: "q3", q: "Which statement about Java’s Object.clone() is correct?",
        options: [
          { text: "It always makes a deep copy.", why: "It makes a shallow copy. Nested objects must be copied by hand." },
          { text: "It works on any class without extra code.", why: "The class must implement Cloneable, or clone() throws CloneNotSupportedException." },
          { correct: true, text: "It makes a shallow copy and requires implements Cloneable.", why: "Right. That is why Document copies its list after calling super.clone()." },
          { text: "It calls the class constructor.", why: "Object.clone() copies the object without running any constructor." },
        ] },
      { id: "q4", q: "Scenario: a report template (logo, header, chart settings) takes three seconds to load from the database, and every report starts from the same template. What fits best?",
        options: [
          { correct: true, text: "Prototype", why: "Right. The expensive object is the same every time: load it once and copy it for each report." },
          { text: "Singleton", why: "Each report must be its own object that can change independently, so one shared instance is not enough." },
          { text: "Builder", why: "The content is identical every time, so assembling it step by step would still repeat the slow loading." },
          { text: "Factory Method", why: "There is no choice between classes; the cost of creation is the problem." },
        ] },
      { id: "q5", q: "Scenario: a game spawns 500 identical soldiers per level, each loading its armour and AI settings from a large file. Which change helps most?",
        options: [
          { text: "Make Soldier a Singleton.", why: "500 soldiers must move and take damage independently, so one shared object does not work." },
          { text: "Add a Builder with optional armour.", why: "The settings are the same for every soldier. The problem is repeated loading, not construction steps." },
          { correct: true, text: "Load one soldier and clone it 499 times.", why: "Right. Cloning skips the file reading for every soldier after the first." },
          { text: "Wrap the file in an Adapter.", why: "The file format is not the issue; reading it 500 times is." },
        ] },
    ],
  },

  fixBug: {
    id: "prototype-fix",
    title: "Find the mistakes",
    intro: "This Enemy prototype should let a game create many independent enemies without loading weapons from disk each time. It has four mistakes.",
    lines: [
      "public class Enemy {",
      "    private String type;",
      "    private List<String> weapons;",
      "    private Position position;",
      "",
      "    public Enemy(String type) {",
      "        this.type = type;",
      "        this.weapons = AssetLoader.loadWeapons(type);   // slow: reads files",
      "        this.position = new Position(0, 0);",
      "    }",
      "",
      "    private Enemy(Enemy source) {",
      "        this.type = source.type;",
      "        this.weapons = source.weapons;",
      "        this.position = source.position;",
      "    }",
      "",
      "    public Enemy copy() {",
      "        return this;",
      "    }",
      "}",
      "",
      "// Client: spawn 100 enemies",
      "Enemy prototype = new Enemy(\"orc\");",
      "for (int i = 0; i < 100; i++) {",
      "    Enemy e = new Enemy(\"orc\");",
      "}",
    ],
    bugs: {
      13: { fix: "        this.weapons = new ArrayList<>(source.weapons);", why: "Shallow copy: every enemy would share one weapons list, so picking up a weapon would give it to all of them." },
      14: { fix: "        this.position = new Position(source.position);", why: "Position is mutable. Sharing it would make all enemies move together." },
      18: { fix: "        return new Enemy(this);", why: "this is the same object, not a copy." },
      25: { fix: "    Enemy e = prototype.copy();", why: "Calling the constructor again repeats the slow file loading 100 times. Copy the prototype instead." },
    },
    falseNotes: {
      12: "type is a String, which is immutable, so sharing it is safe.",
      7: "The slow call is fine in the normal constructor: with Prototype it runs only once.",
      23: "Creating the first prototype with the constructor is correct.",
    },
  },
};
