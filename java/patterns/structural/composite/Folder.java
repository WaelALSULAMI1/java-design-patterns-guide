package patterns.structural.composite;

import java.util.ArrayList;
import java.util.List;

/**
 * The composite: it holds children of the component type, so a folder can contain
 * files and other folders, and it delegates work to them recursively.
 */
public class Folder implements FileSystemItem {

    private final String name;
    private final List<FileSystemItem> children = new ArrayList<>();

    public Folder(String name) {
        this.name = name;
    }

    public Folder add(FileSystemItem item) {
        children.add(item);
        return this;
    }

    public void remove(FileSystemItem item) {
        children.remove(item);
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public long getSize() {
        long total = 0;
        for (FileSystemItem child : children) {
            total += child.getSize();   // a file returns its size; a folder recurses
        }
        return total;
    }

    @Override
    public void print(String indent) {
        System.out.println(indent + "+ " + name + "/ (" + getSize() + " KB)");
        for (FileSystemItem child : children) {
            child.print(indent + "   ");
        }
    }
}
