package patterns.structural.adapter;

/** The client: it only knows PaymentService and never sees any XML. */
public class CheckoutScreen {

    private final PaymentService payments;

    public CheckoutScreen(PaymentService payments) {
        this.payments = payments;
    }

    public void confirmOrder(String orderId, double total) {
        String receiptJson = payments.pay(orderId, total);
        System.out.println("Receipt: " + receiptJson);
    }
}
