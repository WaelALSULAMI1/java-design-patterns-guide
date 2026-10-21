package patterns.creational.prototype;

import java.util.ArrayList;
import java.util.List;

/**
 * The same idea with Java's built-in Cloneable interface.
 * super.clone() makes a shallow copy; the list is then copied by hand (deep copy).
 */
public class Document implements Cloneable {

    private String title;
    private List<String> pages = new ArrayList<>();

    public Document(String title) {
        this.title = title;
    }

    public void addPage(String text) {
        pages.add(text);
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public Document clone() {
        try {
            Document copy = (Document) super.clone();   // copies fields; "pages" still points to the same list
            copy.pages = new ArrayList<>(this.pages);   // give the copy its own list
            return copy;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError("Document implements Cloneable, so this cannot happen", e);
        }
    }

    @Override
    public String toString() {
        return title + " " + pages;
    }
}
