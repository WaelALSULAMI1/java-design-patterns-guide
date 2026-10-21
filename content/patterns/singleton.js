// Singleton: full guide.
const BASE = "java/patterns/creational/singleton/";

export default {
  id: "singleton",
  lead: "Guarantee that a class has exactly one instance, and give the whole program a single, well-defined way to reach it.",

  files: [
    { name: "AppConfig.java", path: BASE + "AppConfig.java", role: "The singleton: lazy, thread-safe configuration" },
    { name: "HolderConfig.java", path: BASE + "HolderConfig.java", role: "Alternative: the initialization-on-demand holder idiom" },
    { name: "SettingsScreen.java", path: BASE + "SettingsScreen.java", role: "One part of the program that changes a setting" },
    { name: "CheckoutService.java", path: BASE + "CheckoutService.java", role: "Another part that reads the same setting" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Client code showing that everyone shares one object" },
  ],

  snippets: {
    problem:
`// In the settings screen
AppConfig config = new AppConfig();
config.set("theme", "dark");

// Somewhere else
AppConfig other = new AppConfig();
other.get("theme");   // still "light": this is a different object`,
    usage:
`AppConfig a = AppConfig.getInstance();
AppConfig b = AppConfig.getInstance();
System.out.println(a == b);   // true: both names point to the same object`,
    enumSingleton:
`public enum Clock {
    INSTANCE;

    public long now() {
        return System.currentTimeMillis();
    }
}
// usage: Clock.INSTANCE.now()`,
  },

  body: {
    intent: `<p>Singleton makes a class responsible for its own uniqueness. The class <strong>controls its own creation</strong>, keeps the one object it creates, and hands that same object to anyone who asks.</p>
<div class="callout"><p>In one sentence: <strong>one instance, one global access point.</strong></p></div>
<p>The pattern solves two problems at once: limiting the number of instances, and giving easy access to that instance from anywhere. Keep both in mind, because the second one is also where its risks come from.</p>`,

    problem: `<p>Some objects represent something that must be <strong>shared</strong>: the application’s configuration, a log file, a connection pool, a printer queue. If different parts of the program create their own copies with <code>new</code>, each copy has its own state.</p>
{{snippet:problem}}
<p>The result is data that is split or out of sync: two log files instead of one, a theme change that only one screen sees, or several expensive connections where one is enough. A normal constructor cannot prevent this, because <code>new</code> always creates a new object.</p>`,

    solution: `<p>Take the power to create objects away from everyone else, and give it to the class itself:</p>
<ol>
  <li>Make the constructor <strong><code>private</code></strong>, so no other class can call <code>new</code>.</li>
  <li>Keep the single instance in a <strong><code>private static</code></strong> field. <code>static</code> means it belongs to the class, not to any object.</li>
  <li>Provide a <strong><code>public static getInstance()</code></strong> method. It creates the object the first time it is called (lazy initialization) and returns the same object every time after that.</li>
</ol>
<div class="flow" aria-label="Both clients call getInstance and receive the same AppConfig object">
  <span class="node">SettingsScreen</span><span class="arrow">→</span>
  <span class="node key">AppConfig.getInstance()</span><span class="arrow">←</span>
  <span class="node">CheckoutService</span><span class="arrow">=</span>
  <span class="node">one shared AppConfig</span>
</div>
{{snippet:usage}}
<h3>Thread safety</h3>
<p>If two threads call <code>getInstance()</code> at the same moment, both may see <code>instance == null</code> and create two objects. The example avoids this with <code>synchronized</code>. <code>HolderConfig</code> shows another common option: the JVM loads a nested holder class only when it is first used, and class loading is already thread-safe. A single-element <code>enum</code> is a third option, and it also survives serialization:</p>
{{snippet:enumSingleton}}`,

    when: `<ul>
  <li>Exactly one object must exist and be shared, such as configuration, a logger, a cache or a connection pool.</li>
  <li>Creating the object is expensive, and one copy is enough for the whole program.</li>
  <li>You need stricter control than a plain global variable: nobody can replace or recreate the instance.</li>
</ul>
<div class="callout"><p><strong>Use it sparingly.</strong> A singleton is global state. If a class only needs “one object” because your program happens to create one, pass that object in through a constructor instead. That is easier to test and to change later.</p></div>`,

    "real-world": `<ul>
  <li><strong>JDK:</strong> <code>Runtime.getRuntime()</code> returns the one <code>Runtime</code> object for the running JVM.</li>
  <li><strong>Logging:</strong> one shared logger that writes every module’s messages to the same file.</li>
  <li><strong>Configuration:</strong> settings loaded once at start-up and read everywhere.</li>
  <li><strong>Resource managers:</strong> a database connection pool or a printer spooler that coordinates access to a shared resource.</li>
</ul>
<p>Frameworks such as Spring create “singleton-scoped” objects too, but there the container guarantees one instance per application context. The class itself stays a normal class with a public constructor, which keeps it easy to test.</p>`,
  },

  walkthrough: [
    { file: "AppConfig.java", find: "private static AppConfig instance;", span: 1,
      title: "A private static field holds the instance",
      body: "static: there is one field for the whole class, not one per object. private: nobody outside can replace it." },
    { file: "AppConfig.java", find: "private AppConfig() {", span: 6,
      title: "The constructor is private",
      body: "No other class can write new AppConfig(). The message inside shows when the object is really created; in the demo it prints only once." },
    { file: "AppConfig.java", find: "public static synchronized AppConfig getInstance() {", span: 6,
      title: "getInstance() creates once, then reuses",
      body: "The first call creates the object (lazy initialization); every later call returns the same one. static lets you call it on the class, because no object exists yet. synchronized stops two threads from creating two instances." },
    { file: "SettingsScreen.java", find: "public void switchToDarkTheme() {", span: 3,
      title: "Every part of the program asks the class",
      body: "Clients never call new. They call AppConfig.getInstance(), so a change made here is visible everywhere else." },
    { file: "Demo.java", find: "AppConfig first = AppConfig.getInstance();", span: 6,
      title: "Proof: same object, shared state",
      body: "first == second is true because both variables refer to one object, so the theme changed by SettingsScreen is the theme everyone reads." },
    { file: "HolderConfig.java", find: "private static class Holder {", span: 7,
      title: "Alternative: the holder idiom",
      body: "The nested class is loaded only when getInstance() is first called. The JVM guarantees that class loading happens once, so this is lazy and thread-safe without synchronized." },
  ],

  mistakes: [
    { title: "The instance field is not static",
      effect: "Every object would have its own field, and a static getInstance() cannot even read it. The class can no longer remember a single shared instance.",
      wrong: "private AppConfig instance;", right: "private static AppConfig instance;" },
    { title: "The constructor is public",
      effect: "Anyone can still call new AppConfig(), so the “only one instance” promise is broken.",
      wrong: "public AppConfig() { ... }", right: "private AppConfig() { ... }" },
    { title: "getInstance() is not static",
      effect: "You would need an object to call it, but the only way to get an object is to call it. Make it static so it is called on the class.",
      wrong: "public AppConfig getInstance() {", right: "public static AppConfig getInstance() {" },
    { title: "Creating a new object on every call",
      effect: "Without the null check and the stored field, each call returns a different object, which is exactly the problem the pattern should solve.",
      wrong: "public static AppConfig getInstance() {\n    return new AppConfig();\n}",
      right: "public static AppConfig getInstance() {\n    if (instance == null) {\n        instance = new AppConfig();\n    }\n    return instance;\n}" },
    { title: "Ignoring threads",
      effect: "Two threads can pass the null check at the same time and create two objects. Use synchronized, the holder idiom, or an enum.",
      wrong: "public static AppConfig getInstance() {", right: "public static synchronized AppConfig getInstance() {" },
    { title: "Using Singleton for convenience",
      effect: "Turning ordinary classes into singletons hides dependencies and makes tests share state. Use it only when there must truly be one instance.",
      wrong: "PriceCalculator.getInstance().total(cart);   // why only one calculator?",
      right: "PriceCalculator calculator = new PriceCalculator();\ncalculator.total(cart);" },
  ],

  tradeoffs: {
    pros: ["Guarantees exactly one instance.", "Gives a single, well-known access point.", "The object can be created lazily, only when first needed.", "Saves resources when the object is expensive to create."],
    cons: ["It is global state: any code can change it, which hides dependencies.", "Harder to unit test, because tests share the same instance and private constructors are hard to replace.", "Needs extra care in multithreaded code.", "Mixes two jobs in one class (its real work and controlling its own creation)."],
  },

  quiz: {
    id: "singleton-mcq",
    questions: [
      { id: "q1", q: "Why must getInstance() be static?",
        options: [
          { correct: true, text: "Because no object exists yet, so it has to be called on the class itself.", why: "Right. The constructor is private, so the only way to get the first object is a method you can call without an object: a static one." },
          { text: "Because static methods are faster.", why: "Speed is not the reason. Without static there would be no way to call the method before an object exists." },
          { text: "So that each object gets its own copy of the method.", why: "That is the opposite of static. Static members belong to the class, not to individual objects." },
          { text: "It does not need to be static.", why: "A non-static getInstance() needs an object to be called on, but you cannot create one because the constructor is private." },
        ] },
      { id: "q2", q: "What is the purpose of the private constructor?",
        options: [
          { text: "To make the class faster to load.", why: "Visibility has nothing to do with loading speed." },
          { correct: true, text: "To stop other classes from creating instances with new.", why: "Right. If the constructor were public, anyone could create a second instance and break the guarantee." },
          { text: "To make the class immutable.", why: "Immutability comes from final fields and no setters. A singleton can be mutable." },
          { text: "To allow subclasses to call it.", why: "A private constructor actually prevents subclassing." },
        ] },
      { id: "q3", q: "Two threads call a lazy getInstance() without synchronized at the same moment. What can happen?",
        options: [
          { text: "Nothing, a singleton is always thread-safe.", why: "The basic lazy version is not thread-safe. The null check and the assignment can interleave." },
          { text: "The program will not compile.", why: "It compiles fine. The problem only appears at run time." },
          { correct: true, text: "Both may see null and create two instances.", why: "Right. Use synchronized, the holder idiom, or an enum to make creation safe." },
          { text: "The JVM throws an exception.", why: "No exception is thrown; you silently get two objects, which is worse." },
        ] },
      { id: "q4", q: "Scenario: every screen of a shopping app calls new Cart(), and items added on one screen disappear on the next. Which pattern fixes this?",
        options: [
          { correct: true, text: "Singleton", why: "Right. The screens need to share one cart, but each creates its own. One instance with a global access point keeps the items together." },
          { text: "Prototype", why: "Prototype creates copies. Copying the cart would still give each screen a separate cart." },
          { text: "Builder", why: "Creating a cart is easy. The problem is sharing it." },
          { text: "Composite", why: "A cart here is not a tree that needs uniform treatment." },
        ] },
      { id: "q5", q: "Scenario: an app needs exactly one PrinterSpooler, and creating it is expensive because it scans the network. What fits best?",
        options: [
          { text: "Prototype, because creation is expensive.", why: "This is a trap: Prototype makes more copies, but you need only one object." },
          { correct: true, text: "Singleton, because there must be exactly one.", why: "Right. “Exactly one” decides it, and creating it once and sharing it also solves the cost." },
          { text: "Factory Method, to choose the spooler class.", why: "There is only one kind of spooler. Nothing has to be chosen." },
          { text: "Adapter, to wrap the network scanner.", why: "Nothing has an incompatible interface in this scenario." },
        ] },
    ],
  },

  completion: {
    id: "singleton-complete",
    title: "Complete the singleton",
    hint: "Make Logger a correct, lazy singleton. Spacing does not matter.",
    code:
`public class Logger {

    private [[0]] Logger instance;

    [[1]] Logger() {
        System.out.println("Opening log file");
    }

    public [[2]] Logger getInstance() {
        if ([[3]]) {
            instance = new Logger();
        }
        return [[4]];
    }
}

// Client code:
Logger log = [[5]];`,
    blanks: [
      { answers: ["static"], width: 7, why: "static: one field for the whole class holds the single instance." },
      { answers: ["private"], width: 8, why: "private: nobody outside the class can call new Logger()." },
      { answers: ["static", "static synchronized", "synchronized static"], width: 13, why: "static: it is called on the class, before any object exists. Adding synchronized makes it thread-safe." },
      { answers: ["instance == null", "null == instance"], width: 17, why: "Create the object only the first time, when nothing is stored yet." },
      { answers: ["instance"], width: 9, why: "Always return the stored object, never a new one." },
      { answers: ["Logger.getInstance()", "Logger.getInstance();"], width: 21, why: "Clients ask the class for the instance. new Logger() would not compile, because the constructor is private." },
    ],
  },
};
