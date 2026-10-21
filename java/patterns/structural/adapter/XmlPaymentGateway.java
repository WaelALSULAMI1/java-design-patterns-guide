package patterns.structural.adapter;

/**
 * The adaptee: a third-party gateway we cannot change.
 * It speaks XML and expects amounts in halalas (1 riyal = 100 halalas).
 */
public class XmlPaymentGateway {

    private int counter = 1000;

    public String processPayment(String xmlRequest) {
        boolean valid = xmlRequest.startsWith("<payment>") && xmlRequest.contains("<amount currency=\"SAR\">");
        String status = valid ? "APPROVED" : "REJECTED";
        return "<result><status>" + status + "</status><reference>TX-" + (++counter) + "</reference></result>";
    }
}
