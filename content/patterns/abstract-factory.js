// Abstract Factory: full guide.
const BASE = "java/patterns/creational/abstractfactory/";

export default {
  id: "abstract-factory",
  lead: "Create families of related objects that must be used together, without naming their concrete classes.",

  files: [
    { name: "UiFactory.java", path: BASE + "UiFactory.java", role: "The abstract factory: one method per product" },
    { name: "LightUiFactory.java", path: BASE + "LightUiFactory.java", role: "Concrete factory for the light family" },
    { name: "DarkUiFactory.java", path: BASE + "DarkUiFactory.java", role: "Concrete factory for the dark family" },
    { name: "Button.java", path: BASE + "Button.java", role: "Abstract product A" },
    { name: "Checkbox.java", path: BASE + "Checkbox.java", role: "Abstract product B" },
    { name: "LightButton.java", path: BASE + "LightButton.java", role: "Concrete product (light)" },
    { name: "DarkButton.java", path: BASE + "DarkButton.java", role: "Concrete product (dark)" },
    { name: "LightCheckbox.java", path: BASE + "LightCheckbox.java", role: "Concrete product (light)" },
    { name: "DarkCheckbox.java", path: BASE + "DarkCheckbox.java", role: "Concrete product (dark)" },
    { name: "SettingsScreen.java", path: BASE + "SettingsScreen.java", role: "Client: works only with the interfaces" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Chooses one factory and builds the screen" },
  ],

  snippets: {
    problem:
`Button save = darkMode ? new DarkButton() : new LightButton();
Checkbox alerts = new LightCheckbox();   // oops: a light checkbox on a dark screen
// ...and the same ternaries repeated on every screen`,
    usage:
`UiFactory factory = darkModeEnabled ? new DarkUiFactory() : new LightUiFactory();
SettingsScreen screen = new SettingsScreen(factory);   // every widget comes from one family`,
    matrix:
`                 Button          Checkbox
Light family     LightButton     LightCheckbox    <- LightUiFactory
Dark family      DarkButton      DarkCheckbox     <- DarkUiFactory`,
  },

  body: {
    intent: `<p>Some objects only make sense together: a dark button belongs with a dark checkbox, and a Windows menu belongs with a Windows dialog. Abstract Factory groups the creation of such a <strong>family</strong> behind one interface, so the client gets matching products without ever naming their classes.</p>
<div class="callout"><p>In one sentence: <strong>one factory per family, so products from different families never mix.</strong> It is often described as a “factory of factories”.</p></div>`,

    problem: `<p>An app supports light and dark themes. Every screen creates its widgets one by one and picks the theme each time:</p>
{{snippet:problem}}
<ul>
  <li><strong>Inconsistent products:</strong> nothing stops a light widget from appearing on a dark screen.</li>
  <li><strong>Tight coupling:</strong> every screen knows every concrete widget class.</li>
  <li><strong>Hard to extend:</strong> a third theme (say, high contrast) means editing every screen.</li>
</ul>`,

    solution: `<p>Think of the products as a grid: product <em>types</em> in one direction and <em>families</em> (variants) in the other.</p>
{{snippet:matrix}}
<ol>
  <li>Declare an interface for each product type: <code>Button</code>, <code>Checkbox</code>.</li>
  <li>Declare the <strong>abstract factory</strong>, <code>UiFactory</code>, with one creation method per product type.</li>
  <li>Write one <strong>concrete factory</strong> per family. Each creates only products of its own family.</li>
  <li>The client receives a <code>UiFactory</code> and uses only the interfaces. The program chooses the concrete factory once, at start-up.</li>
</ol>
<div class="flow" aria-label="The client asks a UiFactory for a button and a checkbox; the dark factory returns dark products">
  <span class="node">SettingsScreen</span><span class="arrow">→</span>
  <span class="node key">UiFactory</span><span class="arrow">→</span>
  <span class="node">createButton()</span><span class="node">createCheckbox()</span><span class="arrow">→</span>
  <span class="node">same family</span>
</div>
{{snippet:usage}}
<h3>How it relates to Factory Method</h3>
<p>Each <code>createX()</code> method inside a concrete factory is a small factory method. The difference is scale: Factory Method creates <strong>one</strong> product; Abstract Factory creates a <strong>set</strong> of products that belong together.</p>`,

    when: `<ul>
  <li>Products come in families or themes that must not be mixed (light/dark, Windows/macOS, Modern/Classic furniture).</li>
  <li>You want to switch the whole family in one place, for example from a user setting.</li>
  <li>Client code should not depend on the concrete classes of any product.</li>
</ul>
<div class="callout"><p><strong>Know the cost:</strong> adding a new <em>family</em> is easy (one new factory and its products), but adding a new <em>product type</em>, such as a <code>Slider</code>, means changing the factory interface and every concrete factory.</p></div>`,

    "real-world": `<ul>
  <li><strong>UI toolkits:</strong> look-and-feel themes that supply matching buttons, menus and dialogs.</li>
  <li><strong>Cross-platform code:</strong> one factory per operating system or database vendor, producing compatible connections, commands and readers.</li>
  <li><strong>JDK:</strong> <code>javax.xml.parsers.DocumentBuilderFactory</code> and <code>javax.xml.transform.TransformerFactory</code> return implementation-specific objects through abstract types.</li>
  <li><strong>Games:</strong> a world theme that creates matching enemies, weapons and scenery.</li>
</ul>`,
  },

  walkthrough: [
    { file: "UiFactory.java", find: "public interface UiFactory {", span: 4,
      title: "The abstract factory",
      body: "One creation method per product type. It returns interfaces, so the client never sees a concrete class." },
    { file: "DarkUiFactory.java", find: "public class DarkUiFactory implements UiFactory {", span: 11,
      title: "A concrete factory produces one family",
      body: "Every method returns a dark product. Because a single object creates the whole family, the products are guaranteed to match." },
    { file: "Button.java", find: "public interface Button {", span: 3,
      title: "Products are interfaces too",
      body: "LightButton and DarkButton both implement Button, so the client can use either one in the same way." },
    { file: "SettingsScreen.java", find: "public SettingsScreen(UiFactory factory) {", span: 4,
      title: "The client depends only on abstractions",
      body: "The constructor parameter is the interface UiFactory. The screen asks for a button and a checkbox and receives a matching pair." },
    { file: "Demo.java", find: "UiFactory factory = darkModeEnabled ? new DarkUiFactory() : new LightUiFactory();", span: 1,
      title: "The family is chosen in one place",
      body: "This is the only line in the program that names a concrete factory. Switching the whole app to another theme means changing this one decision." },
  ],

  mistakes: [
    { title: "A factory that mixes families",
      effect: "The guarantee of matching products is lost, and the bug is hard to notice because everything still compiles.",
      wrong: "public Checkbox createCheckbox() {\n    return new LightCheckbox();   // inside DarkUiFactory\n}",
      right: "public Checkbox createCheckbox() {\n    return new DarkCheckbox();\n}" },
    { title: "The client depends on a concrete factory",
      effect: "The screen now only works with the dark theme, and switching families means editing it.",
      wrong: "public SettingsScreen(DarkUiFactory factory) {", right: "public SettingsScreen(UiFactory factory) {" },
    { title: "Bypassing the factory with new",
      effect: "One widget is no longer controlled by the chosen family.",
      wrong: "this.alerts = new DarkCheckbox();", right: "this.alerts = factory.createCheckbox();" },
    { title: "Using Abstract Factory for a single product",
      effect: "If there is only one product type, there is no family to keep consistent. Factory Method is simpler.",
      wrong: "interface ExporterFactory { Exporter createExporter(); }   // the only method",
      right: "// One product: use Factory Method or a Simple Factory\nExporter e = ExporterFactory.create(Format.PDF);" },
  ],

  tradeoffs: {
    pros: ["Products from one factory always match.", "Client code is independent of concrete product classes.", "Switching the whole family is a one-line change.", "Creation code for a family lives in one place."],
    cons: ["Many interfaces and classes for a small feature.", "Adding a new product type changes the factory interface and every concrete factory.", "Overkill when products do not need to match."],
  },

  quiz: {
    id: "abstract-factory-mcq",
    questions: [
      { id: "q1", q: "What is the key difference between Abstract Factory and Factory Method?",
        options: [
          { correct: true, text: "Abstract Factory creates a family of related products; Factory Method creates one product.", why: "Right. Abstract Factory is about keeping several products consistent with each other." },
          { text: "Abstract Factory uses static methods; Factory Method does not.", why: "Neither pattern is defined by static methods. Abstract Factory usually uses instance methods on a factory object." },
          { text: "Factory Method is structural; Abstract Factory is creational.", why: "Both are creational patterns." },
          { text: "There is no difference; they are two names for the same thing.", why: "They are related, but they solve different problems: one product versus a family." },
        ] },
      { id: "q2", q: "You need to add a third theme, “high contrast”. What changes?",
        options: [
          { correct: true, text: "Add HighContrastUiFactory and its products; existing code stays the same.", why: "Right. New families are cheap: one new factory plus its products." },
          { text: "Edit every screen that creates widgets.", why: "Screens only use UiFactory, so they do not change." },
          { text: "Add a method to UiFactory.", why: "That is needed for a new product type, not a new family." },
          { text: "Nothing: Abstract Factory supports new themes automatically.", why: "Someone still has to write the new factory and products." },
        ] },
      { id: "q3", q: "Which change is the hardest with Abstract Factory?",
        options: [
          { text: "Adding a new family.", why: "That is the easy direction: one new factory class." },
          { correct: true, text: "Adding a new product type, such as Slider.", why: "Right. The factory interface gains a method, so every concrete factory must change." },
          { text: "Switching families at start-up.", why: "That is a one-line change, one of the pattern’s main benefits." },
          { text: "Writing client code.", why: "Client code is simple: it only talks to interfaces." },
        ] },
      { id: "q4", q: "Scenario: a game has Medieval and Sci-Fi worlds. Each world needs its own Weapon, Armor and Vehicle, and a bug just gave a knight a laser rifle. What fits best?",
        options: [
          { correct: true, text: "Abstract Factory", why: "Right. Products come in families that must not mix. One factory per world guarantees matching items." },
          { text: "Factory Method", why: "Close, but Factory Method creates one product. The bug is about a set of products staying consistent." },
          { text: "Bridge", why: "There is no explosion of subclasses to fix. The issue is mixing families." },
          { text: "Builder", why: "Each item is easy to create. Keeping them in one family is the hard part." },
        ] },
      { id: "q5", q: "Scenario: a reporting tool supports several databases. For each database it needs a matching Connection, Command and ResultReader. What fits best?",
        options: [
          { text: "Singleton", why: "Many connections and commands are needed. The problem is compatibility, not the number of instances." },
          { text: "Adapter", why: "Adapter would wrap one existing class. Here whole sets of compatible objects must be created." },
          { correct: true, text: "Abstract Factory", why: "Right. Each database is a family of compatible products, created by one factory per database." },
          { text: "Prototype", why: "Copying objects does not ensure they belong to the same database." },
        ] },
    ],
  },

  fixBug: {
    id: "abstract-factory-fix",
    title: "Find the mistakes",
    intro: "This code should build a dark settings screen where every widget comes from the same family. It has three mistakes.",
    lines: [
      "public interface UiFactory {",
      "    Button createButton();",
      "    Checkbox createCheckbox();",
      "}",
      "",
      "public class DarkUiFactory implements UiFactory {",
      "    public Button createButton() { return new DarkButton(); }",
      "    public Checkbox createCheckbox() { return new LightCheckbox(); }",
      "}",
      "",
      "public class SettingsScreen {",
      "    private final Button save;",
      "    private final Checkbox alerts;",
      "",
      "    public SettingsScreen(DarkUiFactory factory) {",
      "        this.save = factory.createButton();",
      "        this.alerts = new DarkCheckbox();",
      "    }",
      "}",
      "",
      "// Client",
      "UiFactory factory = new DarkUiFactory();",
      "SettingsScreen screen = new SettingsScreen(factory);",
    ],
    bugs: {
      7: { fix: "    public Checkbox createCheckbox() { return new DarkCheckbox(); }", why: "A dark factory must only create dark products, or the family is mixed." },
      14: { fix: "    public SettingsScreen(UiFactory factory) {", why: "The client should depend on the abstract factory. With DarkUiFactory, the client line below does not even compile, because factory is declared as UiFactory." },
      16: { fix: "        this.alerts = factory.createCheckbox();", why: "Calling new directly bypasses the factory and ties the screen to one concrete class." },
    },
    falseNotes: {
      21: "Choosing the concrete factory once, at start-up, is exactly how the pattern is meant to be used.",
      15: "Creating the button through the factory is correct.",
      6: "createButton returns a dark product, which is correct for DarkUiFactory.",
    },
  },
};
