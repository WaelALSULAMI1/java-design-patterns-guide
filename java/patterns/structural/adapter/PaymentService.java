package patterns.structural.adapter;

/**
 * The target interface: what the rest of the app expects.
 * Amounts are in riyals and results are JSON text.
 */
public interface PaymentService {
    String pay(String orderId, double amountSar);
}
