// Composite: full guide.
const BASE = "java/patterns/structural/composite/";

export default {
  id: "composite",
  lead: "Arrange objects in a tree, and let client code treat a single item and a whole group of items in exactly the same way.",

  files: [
    { name: "FileSystemItem.java", path: BASE + "FileSystemItem.java", role: "Component: the common interface" },
    { name: "File.java", path: BASE + "File.java", role: "Leaf: has no children" },
    { name: "Folder.java", path: BASE + "Folder.java", role: "Composite: holds children and delegates to them" },
    { name: "Demo.java", path: BASE + "Demo.java", role: "Builds a tree and works with it" },
  ],

  snippets: {
    problem:
`long total = 0;
for (Object item : folder.getContents()) {
    if (item instanceof File) {
        total += ((File) item).getFileSize();
    } else if (item instanceof Folder) {
        total += ((Folder) item).calculateTotal();   // different name, and it needs its own loop
    }
}`,
    tree:
`home/            Folder  (composite)
├── photos/      Folder  (composite)
│   ├── beach.jpg     File (leaf)
│   └── desert.jpg    File (leaf)
├── projects/    Folder  (composite)
│   └── ...
└── todo.md      File    (leaf)`,
    usage:
`FileSystemItem item = home;   // or a single File: the code below does not change
System.out.println(item.getName() + " uses " + item.getSize() + " KB");`,
    transparent:
`// Transparent design: add/remove declared in the component
public interface FileSystemItem {
    long getSize();
    void add(FileSystemItem item);      // a File must implement this too...
    void remove(FileSystemItem item);   // ...usually by throwing an exception
}`,
  },

  body: {
    intent: `<p>Many structures are trees: folders contain files and folders, menus contain items and sub-menus, departments contain teams and people. Composite gives the leaves and the containers <strong>one common interface</strong>, so code can ask anything in the tree the same question, for example “how big are you?”, and get a correct answer.</p>
<div class="callout"><p>In one sentence: <strong>treat individual objects and compositions of objects uniformly.</strong></p></div>`,

    problem: `<p>A storage app has a <code>File</code> class and a completely different <code>Folder</code> class, with different method names for the same idea. To total the size of a folder, the code checks the type of every item:</p>
{{snippet:problem}}
<ul>
  <li><strong>Type checks everywhere:</strong> every operation (size, delete, search) repeats the same <code>instanceof</code> logic.</li>
  <li><strong>Deep nesting is painful:</strong> folders inside folders need more and more special-case code.</li>
  <li><strong>Hard to extend:</strong> a new item type, such as a shortcut, means editing every one of those checks.</li>
</ul>`,

    solution: `<p>Give every node in the tree the same interface, and let containers forward the work to their children:</p>
<ol>
  <li>Declare a <strong>component</strong> interface with the operations that make sense for every node: <code>getName()</code>, <code>getSize()</code>, <code>print()</code>.</li>
  <li>A <strong>leaf</strong> (<code>File</code>) implements them directly.</li>
  <li>A <strong>composite</strong> (<code>Folder</code>) keeps a list of children <em>of the component type</em> and implements each operation by delegating to them, for example by summing their sizes.</li>
</ol>
{{snippet:tree}}
<p>Because a folder’s children are <code>FileSystemItem</code>s, a folder can contain other folders, and <code>getSize()</code> recurses down the tree automatically. Client code no longer cares whether it holds one file or a whole tree:</p>
{{snippet:usage}}
<h3>Where should add() and remove() live?</h3>
<p>In this example only <code>Folder</code> has <code>add()</code> and <code>remove()</code>. This is the <strong>safe</strong> design: you cannot add a child to a file, and the compiler enforces it. Some designs declare them in the component interface instead (the <strong>transparent</strong> design), so every node looks identical, but leaves must then implement methods that make no sense for them:</p>
{{snippet:transparent}}
<p>Both versions are valid Composite. The trade-off is uniformity versus type safety.</p>`,

    when: `<ul>
  <li>Your data is naturally a tree, or a part-whole hierarchy.</li>
  <li>Client code should not care whether it is working with one item or a group.</li>
  <li>The same operation (total, print, search, delete) must work at any level of nesting.</li>
</ul>
<div class="callout"><p><strong>Skip it</strong> when leaves and containers have little in common. Forcing them into one interface then produces methods that are empty or confusing.</p></div>`,

    "real-world": `<ul>
  <li><strong>File systems:</strong> files and folders, with total size and recursive delete.</li>
  <li><strong>User interfaces:</strong> in Java Swing, <code>Container</code> extends <code>Component</code>, so a panel can hold buttons and other panels and be laid out and drawn like a single component.</li>
  <li><strong>Menus:</strong> a menu holds items and sub-menus; computing the price of a combo meal works the same way.</li>
  <li><strong>Organisations:</strong> a manager has employees, some of whom are managers; total salary is computed recursively.</li>
  <li><strong>Documents:</strong> HTML and XML trees, where an element holds text and other elements.</li>
</ul>`,
  },

  walkthrough: [
    { file: "FileSystemItem.java", find: "public interface FileSystemItem {", span: 5,
      title: "The component interface",
      body: "These operations make sense for both a file and a folder. Clients program against this interface only." },
    { file: "File.java", find: "public long getSize() {", span: 3,
      title: "A leaf answers directly",
      body: "A file has no children, so it simply returns its own size." },
    { file: "Folder.java", find: "private final List<FileSystemItem> children = new ArrayList<>();", span: 1,
      title: "Children are components, not files",
      body: "The list type is the interface, so a folder can hold files and other folders. This one line is what makes nesting possible." },
    { file: "Folder.java", find: "public Folder add(FileSystemItem item) {", span: 4,
      title: "Managing children",
      body: "Only the composite has add() and remove() (the safe design). add() returns this so trees can be built in one fluent expression." },
    { file: "Folder.java", find: "public long getSize() {", span: 7,
      title: "The composite delegates, recursively",
      body: "Each child answers getSize() its own way: a file returns its size, a folder repeats this loop for its own children. The recursion follows the shape of the tree." },
    { file: "Demo.java", find: "FileSystemItem[] items = { new File(\"readme.txt\", 3), photos, home };", span: 4,
      title: "Uniform treatment",
      body: "A single file, a folder and the whole tree go into one array and are handled by one loop. No instanceof is needed." },
  ],

  mistakes: [
    { title: "Storing children as the concrete leaf type",
      effect: "A folder could then hold only files, so nesting folders becomes impossible.",
      wrong: "private final List<File> children = new ArrayList<>();", right: "private final List<FileSystemItem> children = new ArrayList<>();" },
    { title: "Checking types instead of using polymorphism",
      effect: "instanceof checks bring back the original problem and break when a new item type is added.",
      wrong: "if (child instanceof File) total += ((File) child).getSize();\nelse total += ((Folder) child).getSize();",
      right: "total += child.getSize();" },
    { title: "Forgetting to recurse",
      effect: "A folder that only counts its direct files reports the wrong size whenever it contains sub-folders.",
      wrong: "for (FileSystemItem child : children) {\n    if (child instanceof File) total += child.getSize();\n}",
      right: "for (FileSystemItem child : children) {\n    total += child.getSize();\n}" },
    { title: "Leaves that silently ignore add()",
      effect: "In a transparent design, an empty add() on a leaf hides bugs: the child just disappears. Throw an exception, or keep add() in the composite only.",
      wrong: "public void add(FileSystemItem item) { }   // in File",
      right: "public void add(FileSystemItem item) {\n    throw new UnsupportedOperationException(\"A file has no children\");\n}" },
    { title: "Adding a folder to itself",
      effect: "A cycle turns the tree into a loop, and getSize() recurses forever until a StackOverflowError.",
      wrong: "home.add(home);", right: "// Validate in add(): reject the folder itself and its ancestors" },
  ],

  tradeoffs: {
    pros: ["Clients treat single items and groups the same way, so code gets simpler.", "Recursive operations follow the tree naturally.", "New kinds of nodes can be added without changing client code (Open/Closed).", "Trees of any depth are handled by the same few lines."],
    cons: ["A common interface can be hard to design when leaves and containers differ a lot.", "The transparent design gives leaves methods that make no sense for them; the safe design loses some uniformity.", "Restricting which children are allowed (for example, no folders inside a certain folder) needs extra run-time checks."],
  },

  quiz: {
    id: "composite-mcq",
    questions: [
      { id: "q1", q: "In this example, which class is the composite?",
        options: [
          { text: "File", why: "File is a leaf: it has no children." },
          { correct: true, text: "Folder", why: "Right. Folder holds children of the component type and delegates work to them." },
          { text: "FileSystemItem", why: "FileSystemItem is the component interface shared by leaves and composites." },
          { text: "Demo", why: "Demo is the client." },
        ] },
      { id: "q2", q: "Why is the children list declared as List<FileSystemItem> and not List<File>?",
        options: [
          { correct: true, text: "So a folder can contain both files and other folders.", why: "Right. Using the component type is what makes nesting possible." },
          { text: "Because generics require an interface type.", why: "Java generics accept any reference type, including classes." },
          { text: "To make the list immutable.", why: "The element type has nothing to do with immutability." },
          { text: "It makes no difference.", why: "With List<File>, folders could not be nested, so the tree could not grow." },
        ] },
      { id: "q3", q: "How does Folder.getSize() work for deeply nested folders?",
        options: [
          { text: "It reads the size from the operating system.", why: "The example computes sizes from the tree itself." },
          { text: "It uses instanceof to handle each level separately.", why: "No type checks are needed. Each child answers in its own way." },
          { correct: true, text: "It asks every child for its size; child folders do the same, recursively.", why: "Right. The recursion follows the shape of the tree, however deep it is." },
          { text: "It only counts direct children.", why: "Then the total would be wrong for nested folders." },
        ] },
      { id: "q4", q: "Scenario: an online store has categories that contain products and sub-categories, which contain more products and sub-categories. The app must count the products at any level with one call. What fits best?",
        options: [
          { correct: true, text: "Composite", why: "Right. Containers inside containers form a tree, and the client wants the same call for a product and a category." },
          { text: "Builder", why: "Builder is about constructing one object, not about working with a nested structure." },
          { text: "Bridge", why: "There are not two independent dimensions here, just one recursive structure." },
          { text: "Prototype", why: "Nothing needs to be copied." },
        ] },
      { id: "q5", q: "Scenario: a company chart has a general manager with managers and developers below, and managers with developers below them. You need to print everyone’s name and salary from the top. What fits best?",
        options: [
          { text: "Singleton for the general manager", why: "Having one top manager does not explain how to walk the whole hierarchy." },
          { correct: true, text: "Composite: employees and managers share an interface, and managers hold a list of employees.", why: "Right. print() on a manager prints itself and then asks each subordinate to print." },
          { text: "Adapter between managers and developers", why: "Their interfaces do not need translating; they need to be treated the same way." },
          { text: "Abstract Factory for each department", why: "Creating families of objects is not the problem; working with a tree is." },
        ] },
    ],
  },

  completion: {
    id: "composite-complete",
    title: "Complete the menu",
    hint: "A Menu can hold MenuItems and other Menus. getPrice() of a menu is the sum of its contents.",
    code:
`public interface MenuComponent {
    String getName();
    double getPrice();
}

public class MenuItem [[0]] {
    private final String name;
    private final double price;
    public MenuItem(String name, double price) { this.name = name; this.price = price; }
    public String getName() { return name; }
    public double getPrice() { return price; }
}

public class Menu implements MenuComponent {
    private final String name;
    private final List<[[1]]> children = new ArrayList<>();

    public Menu(String name) { this.name = name; }
    public void add(MenuComponent c) { [[2]] }
    public String getName() { return name; }

    public double getPrice() {
        double total = 0;
        for (MenuComponent child : children) {
            total += [[3]];
        }
        return total;
    }
}

// Client code: a drinks menu inside the main menu
Menu main = new Menu("Main");
Menu drinks = new Menu("Drinks");
drinks.add(new MenuItem("Coffee", 12));
main.add(new MenuItem("Burger", 25));
[[4]]
System.out.println(main.getPrice());   // 37.0`,
    blanks: [
      { answers: ["implements MenuComponent"], width: 25, why: "A leaf implements the component interface, just like the composite." },
      { answers: ["MenuComponent"], width: 14, why: "Children are components, so a menu can hold items and other menus." },
      { answers: ["children.add(c);", "children.add(c)", "this.children.add(c);", "this.children.add(c)"], width: 18, why: "The composite stores the child in its list." },
      { answers: ["child.getPrice()"], width: 17, why: "Delegate to each child. A menu child will recurse into its own children." },
      { answers: ["main.add(drinks);", "main.add(drinks)"], width: 18, why: "Adding a menu to a menu is what creates the tree. Without it the total would be 25.0." },
    ],
  },
};
