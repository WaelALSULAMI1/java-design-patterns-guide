package patterns.structural.adapter;

public class Demo {

    public static void main(String[] args) {
        PaymentService service = new PaymentAdapter(new XmlPaymentGateway());
        CheckoutScreen checkout = new CheckoutScreen(service);

        checkout.confirmOrder("ORD-17", 89.75);
        checkout.confirmOrder("ORD-18", 15.00);
    }
}
