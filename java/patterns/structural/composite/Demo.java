package patterns.structural.composite;

public class Demo {

    public static void main(String[] args) {
        Folder photos = new Folder("photos")
                .add(new File("beach.jpg", 2400))
                .add(new File("desert.jpg", 1800));

        Folder projects = new Folder("projects")
                .add(new File("notes.txt", 4))
                .add(new Folder("website").add(new File("index.html", 12)).add(new File("style.css", 6)));

        Folder home = new Folder("home").add(photos).add(projects).add(new File("todo.md", 1));

        home.print("");

        // The client treats a single file and a whole tree the same way.
        FileSystemItem[] items = { new File("readme.txt", 3), photos, home };
        for (FileSystemItem item : items) {
            System.out.println(item.getName() + " uses " + item.getSize() + " KB");
        }
    }
}
