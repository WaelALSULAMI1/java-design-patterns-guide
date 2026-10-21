// Scenario quiz: each option explains why it fits or does not.

export const scenarios = [
  {
    "id": "s1",
    "answer": "singleton",
    "text": "A hospital app has Lab, Pharmacy and Billing modules. Each module creates its own AuditLogger, and each logger writes to a different file, so one patient’s audit trail is split across three files.",
    "why": {
      "singleton": "Correct. The logger must be shared, but every module creates a new one. One instance with a global access point fixes it.",
      "prototype": "Prototype makes more copies. Here the problem is that there are already too many objects.",
      "factory-method": "The modules all create the same class. There is no choice of type to centralize.",
      "adapter": "Nothing has an incompatible interface. Every module uses AuditLogger the same way."
    }
  },
  {
    "id": "s2",
    "answer": "builder",
    "text": "An HttpRequest class needs a URL. Headers, timeout, body and retry count are optional. Its constructor has nine parameters, and most calls pass null for half of them.",
    "why": {
      "builder": "Correct. A long parameter list with optional values is the classic Builder problem. Required URL in the builder’s constructor, everything else through named steps.",
      "factory-method": "There is only one class to create. The pain is how to fill it, not which type to pick.",
      "prototype": "Each request is different, so copying a template does not remove the long constructor.",
      "abstract-factory": "There is no family of related products, just one object with many options."
    }
  },
  {
    "id": "s3",
    "answer": "adapter",
    "text": "A map app works with a Location interface that uses decimal coordinates. It now has to use a legacy GPS library that returns text such as 21°29′N, and the library cannot be changed.",
    "why": {
      "adapter": "Correct. An existing class you cannot change has the wrong interface. An adapter implements Location and converts the library’s output.",
      "bridge": "Bridge is a design choice made up front for two dimensions. Here two existing pieces simply do not fit.",
      "composite": "There is no tree of objects to treat uniformly.",
      "singleton": "The number of instances is not the issue. The interface mismatch is."
    }
  },
  {
    "id": "s4",
    "answer": "bridge",
    "text": "A chat app has message types (Text, Image, Video) and platforms (WhatsApp, Telegram). The developer wrote TextWhatsApp, ImageTelegram and so on. Adding one platform now means three new classes.",
    "why": {
      "bridge": "Correct. Two independent dimensions multiplied through inheritance. Bridge keeps messages and platforms in separate hierarchies connected by a reference.",
      "adapter": "Adapter fixes one interface mismatch. The problem here is the growing number of combinations.",
      "abstract-factory": "Nothing has to match as a family. The pain is the class explosion itself.",
      "composite": "Messages and platforms do not form a part-whole tree."
    }
  },
  {
    "id": "s5",
    "answer": "composite",
    "text": "An online store has categories that contain products and sub-categories, which contain more products and sub-categories. The app must count the products at any level with one call.",
    "why": {
      "composite": "Correct. Containers inside containers form a tree, and the client wants the same call for a product and a category.",
      "builder": "Builder is about constructing one object, not working with a nested structure.",
      "bridge": "There are not two independent dimensions here, just one recursive structure.",
      "prototype": "Nothing needs to be copied."
    }
  },
  {
    "id": "s6",
    "answer": "abstract-factory",
    "text": "A game supports Medieval and Sci-Fi worlds. Each world needs its own Weapon, Armor and Vehicle. A bug just gave a medieval knight a laser rifle from the Sci-Fi set.",
    "why": {
      "abstract-factory": "Correct. Products come in families that must not be mixed. One factory per world guarantees matching items.",
      "factory-method": "Close, but Factory Method creates one product. The bug is about a set of products staying consistent.",
      "bridge": "There is no explosion of subclasses to fix. The issue is mixing families.",
      "builder": "Each item is simple to create. Keeping them in the same family is the hard part."
    }
  },
  {
    "id": "s7",
    "answer": "factory-method",
    "text": "The line if (format.equals(\"pdf\")) exporter = new PdfExporter(); else if (format.equals(\"csv\")) … is copied into five screens. Supporting Excel means editing all five.",
    "why": {
      "factory-method": "Correct. Client code is coupled to concrete classes through repeated if/else. One creation method returning an Exporter interface removes the duplication.",
      "abstract-factory": "Only one product (an exporter) is created each time. There is no family.",
      "adapter": "All exporters are your own classes and share the same idea. Nothing needs translating.",
      "singleton": "The problem is choosing a type, not limiting the number of instances."
    }
  },
  {
    "id": "s8",
    "answer": "prototype",
    "text": "A report template (header, logos, chart settings) takes three seconds to load from the database. Every new report starts from the same template and loads it again.",
    "why": {
      "prototype": "Correct. The expensive object is identical every time. Load it once and clone it for each report.",
      "singleton": "Each report must be its own object that can change independently, so one shared instance is not enough.",
      "builder": "The content is the same each time, so assembling it step by step still repeats the expensive loading.",
      "factory-method": "There is no choice between classes. It is the cost of creation that hurts."
    }
  },
  {
    "id": "s9",
    "answer": "singleton",
    "text": "Every screen of a shopping app creates new Cart(). Items added on the product screen are missing when the user opens the checkout screen.",
    "why": {
      "singleton": "Correct. The screens need the same cart, but each creates its own. A single shared instance keeps the items together.",
      "prototype": "Copying the cart would still give each screen a separate cart.",
      "composite": "The cart is not a tree that needs uniform treatment.",
      "builder": "Building the cart is easy. Sharing it is the problem."
    }
  },
  {
    "id": "s10",
    "answer": "adapter",
    "text": "A university app works with Student objects, but the old registration system only returns comma-separated text, and the parsing code has been copied into many classes.",
    "why": {
      "adapter": "Correct. The old system’s format does not match the interface the app expects. One adapter does the conversion in one place.",
      "factory-method": "Creating Student objects is not the issue. Translating the old format is.",
      "bridge": "There are not two dimensions to separate, just one incompatible source.",
      "builder": "Builder would help create a Student, but it does not explain how to read the old text format."
    }
  },
  {
    "id": "s11",
    "answer": "singleton",
    "text": "The app needs exactly one PrinterSpooler, and creating it is expensive because it scans the network for printers.",
    "why": {
      "singleton": "Correct. “Exactly one” decides it. Creating the object once and sharing it also solves the cost.",
      "prototype": "A trap: “expensive” suggests Prototype, but Prototype makes more copies, and you need only one.",
      "builder": "Construction is not complex in terms of parameters.",
      "adapter": "No interface mismatch is described."
    }
  },
  {
    "id": "s12",
    "answer": "factory-method",
    "text": "A shop creates one of three discount objects (Student, VIP, Employee) based on the user’s choice. The discounts are independent; nothing has to match anything else.",
    "why": {
      "factory-method": "Correct. One product per call, chosen at run time. The words “nothing has to match” rule out a family.",
      "abstract-factory": "A trap: three related classes sound like a family, but each call creates only one object and nothing must be used together.",
      "builder": "Each discount is simple. The question is which one to create.",
      "singleton": "Different users need different discounts, so one shared object does not fit."
    }
  }
];
