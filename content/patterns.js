// Overview data for all eight patterns: home cards, search, comparison and quiz.

export const patterns = [
  {
    "id": "singleton",
    "name": "Singleton",
    "category": "creational",
    "intent": "Make sure a class has exactly one instance, and give the whole program one place to get it.",
    "problem": "Different parts of the program call new on a class that should be shared, such as a logger or a configuration. Each part ends up with its own copy, so data is split or out of sync.",
    "solution": "Make the constructor private, keep the single instance in a private static field, and expose it through a public static getInstance() method.",
    "useWhen": [
      "One shared object must serve the whole program (configuration, logger, connection manager).",
      "You need control over when and how that object is created."
    ],
    "example": "A shared application configuration (AppConfig).",
    "keywords": "one instance single shared global configuration logger database connection getInstance static private constructor"
  },
  {
    "id": "prototype",
    "name": "Prototype",
    "category": "creational",
    "intent": "Create new objects by copying an existing, ready-made object instead of building each one from scratch.",
    "problem": "Building the object is expensive (a network call, a database query, a heavy calculation), and you need many objects that start with the same data.",
    "solution": "Give the class a way to copy itself (a copy constructor or clone()). Build the expensive object once, then clone it, copying nested objects deeply when the copies must be independent.",
    "useWhen": [
      "Creating an object is costly, but copying it is cheap.",
      "You need many similar objects based on a template or preset."
    ],
    "example": "Cloning an order template (OrderTemplate), plus a Cloneable example.",
    "keywords": "copy clone cloneable duplicate template preset expensive costly api deep shallow copy constructor"
  },
  {
    "id": "builder",
    "name": "Builder",
    "category": "creational",
    "intent": "Build a complex object step by step, setting only the parts you need, and get a complete, valid object at the end.",
    "problem": "A constructor with many parameters, several of them optional. Calls are hard to read, values of the same type get swapped, and every new option adds another constructor.",
    "solution": "A separate builder collects the values through named methods that return the builder itself, then build() validates them and creates the final object.",
    "useWhen": [
      "A constructor needs four or more parameters, especially optional ones.",
      "You want an immutable object that is still easy to create."
    ],
    "example": "A Pizza with required size and crust, and optional toppings.",
    "keywords": "too many parameters optional telescoping constructor step by step fluent chaining immutable complex object"
  },
  {
    "id": "factory-method",
    "name": "Factory Method",
    "category": "creational",
    "intent": "Move the decision of which class to instantiate into one creation method, so client code works with an interface and never calls new on concrete classes.",
    "problem": "Code like if (type.equals(\"sms\")) new SmsNotification() is repeated in many places. Adding a new type means finding and editing every copy.",
    "solution": "All products implement one interface. A creation method returns that interface type. In the formal GoF version, subclasses override the creation method to choose the product; a Simple Factory keeps the choice in one static method.",
    "useWhen": [
      "The exact class to create is only known at run time.",
      "You want to add new product types without editing the code that uses them."
    ],
    "example": "Email, SMS and push notifications.",
    "keywords": "which class type if else switch new concrete class coupling create object run time notification simple factory"
  },
  {
    "id": "abstract-factory",
    "name": "Abstract Factory",
    "category": "creational",
    "intent": "Create families of related objects that must be used together, without naming their concrete classes.",
    "problem": "Several products must match (a dark button with a dark checkbox), but code creates them one by one and sometimes mixes products from different families.",
    "solution": "Define a factory interface with one creation method per product. Each family gets its own concrete factory, so everything it creates belongs together.",
    "useWhen": [
      "Products come in families or themes that must not be mixed.",
      "You want to switch the whole family (theme, platform) in one place."
    ],
    "example": "Light and dark UI components (Button, Checkbox).",
    "keywords": "family families related matching theme platform dark light set consistent factory of factories"
  },
  {
    "id": "adapter",
    "name": "Adapter",
    "category": "structural",
    "intent": "Let a class with an incompatible interface work with your code by wrapping it in a class that speaks the interface you expect.",
    "problem": "You must use an existing class (third-party or legacy) whose methods or data format do not match your interface, and you cannot change it. Conversion code spreads across the project.",
    "solution": "Write an adapter that implements your target interface, holds a reference to the existing object, and translates every call into the form that object understands.",
    "useWhen": [
      "An existing class does what you need but has the wrong interface.",
      "You want conversion logic in one place instead of scattered."
    ],
    "example": "An XML payment gateway used through a JSON PaymentService.",
    "keywords": "incompatible interface mismatch wrapper legacy third party library xml json convert translate wrong format"
  },
  {
    "id": "bridge",
    "name": "Bridge",
    "category": "structural",
    "intent": "Split a design that varies in two independent ways into two separate hierarchies, connected by composition, so each side can grow on its own.",
    "problem": "Two dimensions are combined through inheritance, such as remotes × devices. Every new remote or device multiplies the number of subclasses.",
    "solution": "Keep one dimension as the abstraction (the remote) and move the other into its own interface (the device). The abstraction holds a reference to an implementation and delegates to it.",
    "useWhen": [
      "A class varies in two independent dimensions.",
      "You want to switch the implementation at run time."
    ],
    "example": "Remote controls × devices (TV, radio).",
    "keywords": "two dimensions class explosion too many subclasses combinations abstraction implementation independent remote device"
  },
  {
    "id": "composite",
    "name": "Composite",
    "category": "structural",
    "intent": "Arrange objects in a tree and let client code treat a single item and a group of items in exactly the same way.",
    "problem": "Containers hold items and other containers (folders inside folders). Code needs different logic for each level, and it gets harder as nesting deepens.",
    "solution": "Leaves and containers share one component interface. A container stores child components and forwards work to them recursively, for example summing their sizes.",
    "useWhen": [
      "Your data is a part-whole tree.",
      "Clients should not care whether they hold one item or a whole group."
    ],
    "example": "Files and folders with a total size.",
    "keywords": "tree nested hierarchy part whole folder file menu submenu container recursive uniform"
  }
];

export const byId = Object.fromEntries(patterns.map((p) => [p.id, p]));

// The one difference that matters most for frequently confused pairs.
const pairs = {
  "prototype|singleton": "Singleton keeps exactly one shared object. Prototype produces many independent copies of an object.",
  "factory-method|singleton": "Singleton controls how many instances exist (one). Factory Method controls which class gets instantiated.",
  "builder|prototype": "Prototype starts from an existing object and copies it. Builder starts from nothing and assembles a new object from parts.",
  "builder|factory-method": "Builder decides how one object is assembled, step by step. Factory Method decides which class to create.",
  "abstract-factory|builder": "Abstract Factory returns finished products from a family immediately. Builder lets you add optional steps before build() creates one product.",
  "builder|composite": "Composite describes a structure (a tree you work with). Builder describes a construction process (how to create an object).",
  "abstract-factory|factory-method": "Factory Method creates one product. Abstract Factory creates a whole family of products that must match.",
  "abstract-factory|bridge": "Bridge solves too many subclasses from two dimensions. Abstract Factory solves mismatched products from different families.",
  "adapter|bridge": "Adapter fixes a mismatch between classes that already exist. Bridge is planned up front so two dimensions can grow independently.",
  "adapter|composite": "Adapter changes the interface of one object. Composite gives a whole tree of objects one common interface."
};

export function pairDifference(a, b) {
  return pairs[[a, b].sort().join("|")] || null;
}
