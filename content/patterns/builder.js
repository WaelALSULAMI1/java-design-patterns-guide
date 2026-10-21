// Builder: full guide.
const BASE = "java/patterns/creational/builder/";

export default {
  id: "builder",
  lead: "Build a complex object step by step, set only the parts you need, and receive a complete, valid object at the end.",

  files: [
    { name: "Pizza.java", path: BASE + "Pizza.java", role: "The product, with Pizza.Builder nested inside it" },
    { name: "PizzaMenu.java", path: BASE + "PizzaMenu.java", role: "Ready-made recipes (a small Director)" },
    { name: "TelescopingPizza.java", path: BASE + "TelescopingPizza.java", role: "The problem, kept for comparison" },
    { name: "Size.java", path: BASE + "Size.java", role: "Enum for the required size" },
    { name: "Crust.java", path: BASE + "Crust.java", role: "Enum for the required crust" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Client code that uses the builder" },
  ],

  snippets: {
    telescoping:
`new TelescopingPizza(Size.LARGE, Crust.THIN);
new TelescopingPizza(Size.LARGE, Crust.THIN, true);
new TelescopingPizza(Size.LARGE, Crust.THIN, true, "bbq", "chicken");`,
    usage:
`Pizza pizza = new Pizza.Builder(Size.LARGE, Crust.THIN)  // required values
        .withSauce("bbq")                                 // optional
        .withExtraCheese()                                // optional
        .addTopping("chicken")                            // optional
        .build();                                         // create the pizza`,
    jdk:
`HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://example.com"))
        .timeout(Duration.ofSeconds(5))
        .GET()
        .build();`,
  },

  body: {
    intent: `<p>Builder separates <strong>how an object is assembled</strong> from the object itself. Instead of one constructor that takes every value at once, you supply values one by one through clearly named methods, and a final <code>build()</code> call creates the finished object.</p>
<div class="callout"><p>In one sentence: <strong>Builder constructs a complex object step by step.</strong> Reach for it when creating an object is harder than using it.</p></div>`,

    problem: `<p>Imagine a <code>Pizza</code> with two required values (size and crust) and several optional ones (extra cheese, sauce, toppings). The usual first attempt is a <strong>telescoping constructor</strong>: one constructor for each combination, each calling the next.</p>
{{snippet:telescoping}}
<p>This works, but it ages badly:</p>
<ul>
  <li><strong>Unreadable calls.</strong> What does <code>true</code> mean? Which <code>String</code> is the sauce and which is the topping?</li>
  <li><strong>Silent mistakes.</strong> Two parameters of the same type can be swapped and the compiler will not complain.</li>
  <li><strong>No room to grow.</strong> Every new option adds another constructor, or another <code>null</code> in every call.</li>
</ul>
<p>This is a well-known <em>code smell</em> called a <strong>long parameter list</strong>.</p>`,

    solution: `<p>Move the construction into a separate <strong>builder</strong> object:</p>
<ol>
  <li>Required values go into the builder’s constructor, so they cannot be forgotten.</li>
  <li>Each optional value gets its own named method, such as <code>withExtraCheese()</code> or <code>addTopping(...)</code>.</li>
  <li>Every step returns the builder itself (<code>return this;</code>), so calls can be chained.</li>
  <li><code>build()</code> checks the values and creates the finished, immutable product.</li>
</ol>
<div class="flow" aria-label="Client creates a Pizza.Builder, calls optional steps, then build() returns a Pizza">
  <span class="node">Client</span><span class="arrow">→</span>
  <span class="node key">new Pizza.Builder(size, crust)</span><span class="arrow">→</span>
  <span class="node">.withSauce() .addTopping() …</span><span class="arrow">→</span>
  <span class="node key">.build()</span><span class="arrow">→</span>
  <span class="node">Pizza</span>
</div>
{{snippet:usage}}
<h3>Two flavours of Builder</h3>
<div class="table-wrap"><table class="t">
  <thead><tr><th></th><th>Fluent builder (used here)</th><th>Classic GoF builder</th></tr></thead>
  <tbody>
    <tr><td>Shape</td><td>A <code>static</code> nested class inside the product</td><td>A <code>Builder</code> interface with several concrete builders</td></tr>
    <tr><td>Main goal</td><td>Readable creation of a class with many optional fields</td><td>The same steps produce <strong>different representations</strong></td></tr>
    <tr><td>Director</td><td>Optional</td><td>A <em>Director</em> class decides the order of the steps</td></tr>
  </tbody>
</table></div>
<p>In this example, <code>PizzaMenu</code> plays a small Director role: it stores ready-made recipes so client code does not repeat the same steps.</p>`,

    when: `<ul>
  <li>A constructor needs <strong>four or more</strong> parameters, especially optional ones.</li>
  <li>Several parameters share a type and are easy to swap by mistake.</li>
  <li>You want the finished object to be <strong>immutable</strong> and still easy to create.</li>
  <li>The same construction steps should produce different representations (the classic GoF form).</li>
</ul>
<div class="callout"><p><strong>Skip it</strong> when a class has two or three required fields and nothing optional. A normal constructor is simpler and just as clear.</p></div>`,

    "real-world": `<p>You have probably used builders already. The Java standard library has several, for example <code>java.net.http.HttpRequest</code>:</p>
{{snippet:jdk}}
<ul>
  <li><strong>JDK:</strong> <code>HttpRequest.newBuilder()</code>, <code>Locale.Builder</code>, <code>Stream.builder()</code>.</li>
  <li><strong>Requests and settings:</strong> HTTP clients, email messages and database connection settings, where most fields are optional.</li>
  <li><strong>Domain objects:</strong> a food order, a user profile, a car configuration.</li>
</ul>
<p><code>StringBuilder</code> shares the step-by-step spirit, but it is a mutable text buffer rather than the Builder pattern described here.</p>`,
  },

  walkthrough: [
    { file: "Pizza.java", find: "private final Size size;", span: 5,
      title: "Final fields make the pizza immutable",
      body: "Once a pizza exists, nothing can change it, which makes it safe to share and easy to reason about. Size and crust are required; the others have defaults." },
    { file: "Pizza.java", find: "private Pizza(Builder builder) {", span: 7,
      title: "A private constructor that takes the builder",
      body: "Because it is private, the only way to get a Pizza is through the builder. It copies the collected values, and List.copyOf makes an unmodifiable copy so later changes to the builder cannot leak into the pizza." },
    { file: "Pizza.java", find: "public static class Builder {", span: 10,
      title: "A static nested Builder class",
      body: "static means the builder does not need an existing Pizza, so you can write new Pizza.Builder(...). Required fields are final; optional fields start with default values." },
    { file: "Pizza.java", find: "public Builder(Size size, Crust crust) {", span: 4,
      title: "Required values in the builder’s constructor",
      body: "You cannot create a builder without a size and a crust, so you can never build a pizza without them. Objects.requireNonNull fails fast if someone passes null." },
    { file: "Pizza.java", find: "public Builder withExtraCheese() {", span: 4,
      title: "Each step returns this",
      body: "Returning the same builder is what allows chaining: .withExtraCheese().addTopping(\"olives\"). If a step returned void, the chain would stop there." },
    { file: "Pizza.java", find: "public Pizza build() {", span: 6,
      title: "build() validates, then creates",
      body: "All rules live in one place, and an invalid pizza is rejected before it exists. Finally, new Pizza(this) hands the builder to the private constructor." },
    { file: "Demo.java", find: "Pizza custom = new Pizza.Builder", span: 6,
      title: "Client code reads like a sentence",
      body: "Every value is named, optional steps can be skipped, and the order of the optional steps does not matter." },
    { file: "PizzaMenu.java", find: "public static Pizza margherita(Size size) {", span: 6,
      title: "A small Director reuses recipes",
      body: "When the same sequence of steps is used often, put it in one method. Client code asks for a margherita instead of repeating the steps." },
  ],

  mistakes: [
    { title: "Forgetting static on the nested Builder",
      effect: "new Pizza.Builder(...) does not compile, because a non-static inner class needs an existing Pizza object.",
      wrong: "public class Builder {", right: "public static class Builder {" },
    { title: "A step that returns void",
      effect: "Chaining breaks: you cannot call .build() on void. Every step must return the builder.",
      wrong: "public void withExtraCheese() {\n    this.extraCheese = true;\n}",
      right: "public Builder withExtraCheese() {\n    this.extraCheese = true;\n    return this;\n}" },
    { title: "Calling new Pizza() without the builder",
      effect: "The values collected by the builder are lost, and the code does not compile because the only constructor expects a Builder.",
      wrong: "public Pizza build() {\n    return new Pizza();\n}", right: "public Pizza build() {\n    return new Pizza(this);\n}" },
    { title: "A public product constructor",
      effect: "Code can bypass the builder and its validation, so invalid pizzas become possible again.",
      wrong: "public Pizza(Builder builder) {", right: "private Pizza(Builder builder) {" },
    { title: "Required values as optional steps",
      effect: "Nothing forces the caller to set them, so a pizza without a size can be built.",
      wrong: "new Pizza.Builder()\n        .withCrust(Crust.THIN)\n        .build();   // size was never set",
      right: "new Pizza.Builder(Size.LARGE, Crust.THIN)\n        .build();" },
    { title: "Sharing the builder’s list with the product",
      effect: "If the builder is used again, the “finished” pizza changes too. Copy collections when building.",
      wrong: "this.toppings = builder.toppings;", right: "this.toppings = List.copyOf(builder.toppings);" },
  ],

  tradeoffs: {
    pros: ["Creation code is readable: every value has a name.", "Optional values can be skipped and get sensible defaults.", "Validation lives in one place: build().", "Works naturally with immutable objects."],
    cons: ["More code: a second class that mirrors the product’s fields.", "Overkill for small classes with only a few required fields.", "Required values are only enforced if they go in the builder’s constructor."],
  },

  quiz: {
    id: "builder-mcq",
    questions: [
      { id: "q1", q: "Why is Pizza.Builder declared static?",
        options: [
          { correct: true, text: "So it can be created with new Pizza.Builder(...) without an existing Pizza.", why: "Right. A non-static inner class needs an instance of the outer class, but the builder must exist before any pizza does." },
          { text: "So that only one builder can exist in the program.", why: "static on a nested class does not limit the number of instances; you can create as many builders as you like. Limiting instances is Singleton’s job." },
          { text: "Because static classes run faster.", why: "Speed is not the reason. The difference is whether the nested class needs an outer instance." },
          { text: "So all builders share the same field values.", why: "The builder’s fields are not static, so each builder keeps its own values. Only the class nesting is static." },
        ] },
      { id: "q2", q: "What should withExtraCheese() return to allow chaining?",
        options: [
          { text: "void", why: "With void the chain stops: there is no object on which to call the next method." },
          { text: "A new Pizza", why: "Creating the product inside a step ends construction early and skips build() and its validation." },
          { correct: true, text: "The same builder: return this;", why: "Right. return this gives the caller the same builder, with every value set so far." },
          { text: "A new Builder", why: "A new builder would start empty and forget the values set in earlier steps." },
        ] },
      { id: "q3", q: "In build(), what is wrong with return new Pizza(); ?",
        options: [
          { text: "Nothing, it creates a pizza.", why: "It ignores every value the builder collected, and it does not compile because the constructor expects a Builder." },
          { correct: true, text: "It should be return new Pizza(this); so the values reach the product.", why: "Right. Passing this hands the builder, with all its values, to the private constructor." },
          { text: "It should be return this;", why: "build() must return a Pizza. this is the Builder, so the types do not match." },
          { text: "build() should be static.", why: "build() reads the builder’s own fields, so it must be an instance method." },
        ] },
      { id: "q4", q: "Scenario: an HttpRequest needs a URL; headers, timeout, body and retry count are optional. Its constructor has nine parameters and most calls pass null. What fits best?",
        options: [
          { correct: true, text: "Builder", why: "Right. A long parameter list with optional values is the textbook case. The URL goes in the builder’s constructor, everything else through named steps." },
          { text: "Factory Method", why: "There is only one class to create. The pain is how to fill it, not which type to choose." },
          { text: "Prototype", why: "Each request is different, so copying a template would not remove the long constructor." },
          { text: "Abstract Factory", why: "There is no family of related products, just one object with many options." },
        ] },
      { id: "q5", q: "Scenario: a Point class has exactly two required int values, x and y. Should it use a builder?",
        options: [
          { text: "Yes, every class should use a builder.", why: "A builder adds a second class and more code. It pays off only when construction is complicated." },
          { correct: true, text: "No, a normal constructor is clearer.", why: "Right. Two required values fit a constructor perfectly. A builder would only add code." },
          { text: "Yes, to make Point immutable.", why: "A constructor with final fields already makes Point immutable." },
          { text: "No, it should be a Singleton.", why: "There are many different points, so one instance makes no sense." },
        ] },
    ],
  },

  completion: {
    id: "builder-complete",
    title: "Complete the builder",
    hint: "Fill each blank, then check. Spacing does not matter.",
    code:
`public class Coffee {
    private final String size;
    private final boolean milk;

    [[0]] Coffee(Builder builder) {
        this.size = builder.size;
        this.milk = builder.milk;
    }

    public [[1]] class Builder {
        private final String size;
        private boolean milk = false;

        public Builder(String size) {
            this.size = size;
        }

        public [[2]] withMilk() {
            this.milk = true;
            [[3]]
        }

        public Coffee build() {
            return [[4]];
        }
    }
}`,
    blanks: [
      { answers: ["private"], width: 8, why: "private: only the builder may create a Coffee, so its rules cannot be bypassed." },
      { answers: ["static"], width: 7, why: "static: new Coffee.Builder(\"L\") must work before any Coffee exists." },
      { answers: ["Builder", "Coffee.Builder"], width: 8, why: "Builder: each step returns the builder so calls can be chained." },
      { answers: ["return this;", "return this"], width: 13, why: "return this; gives back the same builder, now with milk set." },
      { answers: ["new Coffee(this)", "new Coffee(this);"], width: 17, why: "new Coffee(this) passes the builder, with every value, to the private constructor." },
    ],
  },

  fixBug: {
    id: "builder-fix",
    title: "Find the mistakes",
    intro: "This Laptop builder has four mistakes. The client line at the bottom should compile and work once they are fixed.",
    lines: [
      "public class Laptop {",
      "    private final String cpu;",
      "    private final int ram;",
      "    private final boolean ssd;",
      "",
      "    public Laptop(Builder b) {",
      "        cpu = b.cpu; ram = b.ram; ssd = b.ssd;",
      "    }",
      "",
      "    public class Builder {",
      "        private final String cpu;",
      "        private int ram = 8;",
      "        private boolean ssd;",
      "",
      "        public Builder(String cpu) { this.cpu = cpu; }",
      "        public Builder withRam(int ram) { this.ram = ram; return this; }",
      "        public void withSsd() { this.ssd = true; }",
      "        public Laptop build() { return new Laptop(); }",
      "    }",
      "}",
      "",
      "// Client:",
      "Laptop l = new Laptop.Builder(\"M3\").withRam(16).withSsd().build();",
    ],
    bugs: {
      5: { fix: "    private Laptop(Builder b) {", why: "The product constructor must be private so nobody can skip the builder." },
      9: { fix: "    public static class Builder {", why: "Without static, new Laptop.Builder(\"M3\") does not compile." },
      16: { fix: "        public Builder withSsd() { this.ssd = true; return this; }", why: "A void step breaks the chain: .build() cannot be called on void." },
      17: { fix: "        public Laptop build() { return new Laptop(this); }", why: "The builder must be passed to the constructor, otherwise its values are lost." },
    },
    falseNotes: {
      15: "withRam is correct: it returns Builder and ends with return this.",
      14: "Putting the required cpu in the builder’s constructor is the right design.",
      11: "ram = 8 is a default value for an optional field. That is fine.",
    },
  },
};
