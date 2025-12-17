export interface Order {
    id: number;
    orderDate: Date;
    buyerEmail: string;
    shippingPrice: number;
    shippingAddress: ShippingAddress;
    deliveryMethod: DeliveryMethod;
    paymentSummary: PaymentSummary;
    orderItems: OrderItem[];
    subtotal: number;
    status: string;
    paymentIntentId: string;
    total: number;
}

export interface DeliveryMethod {
    shortName: string;
    deliveryTime: string;
    description: string;
    price: number;
    id: number;
}

export interface OrderItem {
    productId: number;
    productName: string;
    pictureUrl: string;
    price: number;
    quantity: number;
}

export interface PaymentSummary {
    last4: number;
    brand: string;
    expMonth: number;
    expYear: number;
}

export interface ShippingAddress {
    name: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface OrderToCreate {
    cartId: string;
    deliveryMethodId: number;
    shippingAddress: ShippingAddress;
    paymentSummary: PaymentSummary;
}
