package patterns.structural.adapter;

/**
 * The adapter: implements the interface the app expects (PaymentService)
 * and translates every call into what the gateway understands.
 */
public class PaymentAdapter implements PaymentService {

    private final XmlPaymentGateway gateway;   // composition: the adapter wraps the adaptee

    public PaymentAdapter(XmlPaymentGateway gateway) {
        this.gateway = gateway;
    }

    @Override
    public String pay(String orderId, double amountSar) {
        // 1. Translate the request: riyals -> halalas, Java values -> XML.
        long halalas = Math.round(amountSar * 100);
        String xmlRequest = "<payment><order>" + orderId + "</order>"
                + "<amount currency=\"SAR\">" + halalas + "</amount></payment>";

        // 2. Delegate the real work to the adaptee.
        String xmlResponse = gateway.processPayment(xmlRequest);

        // 3. Translate the response: XML -> JSON.
        String status = readTag(xmlResponse, "status");
        String reference = readTag(xmlResponse, "reference");
        return "{\"orderId\":\"" + orderId + "\",\"status\":\"" + status + "\",\"reference\":\"" + reference + "\"}";
    }

    // A tiny helper, enough for this example's flat XML.
    private static String readTag(String xml, String tag) {
        int start = xml.indexOf("<" + tag + ">");
        int end = xml.indexOf("</" + tag + ">");
        if (start < 0 || end < 0) {
            return "";
        }
        return xml.substring(start + tag.length() + 2, end);
    }
}
