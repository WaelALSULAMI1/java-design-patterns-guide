package patterns.structural.composite;

/** The component: what files and folders have in common. */
public interface FileSystemItem {
    String getName();
    long getSize();                 // in kilobytes
    void print(String indent);
}
