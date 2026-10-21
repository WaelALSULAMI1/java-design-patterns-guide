package patterns.creational.prototype;

/** A small mutable object held inside an order. Copies need their own Address. */
public class Address {

    private String street;
    private String city;

    public Address(String street, String city) {
        this.street = street;
        this.city = city;
    }

    /** Copy constructor: creates an independent Address with the same values. */
    public Address(Address source) {
        this(source.street, source.city);
    }

    public void setStreet(String street) {
        this.street = street;
    }

    @Override
    public String toString() {
        return street + ", " + city;
    }
}
