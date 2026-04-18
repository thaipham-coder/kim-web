import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Hr,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  modifiers: string[];
}

interface OrderConfirmationProps {
  shopName: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  paymentMethod: string;
  items: OrderItem[];
  totalAmount: number;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    COD: "Thanh toán khi nhận hàng (COD)",
    BANK_TRANSFER: "Chuyển khoản ngân hàng",
    ZALOPAY: "ZaloPay",
  };
  return map[method] || method;
}

export default function OrderConfirmation({
  shopName,
  orderNumber,
  orderDate,
  customerName,
  customerPhone,
  customerAddress,
  customerNote,
  paymentMethod,
  items,
  totalAmount,
}: OrderConfirmationProps) {
  return (
    <Html lang="vi">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#1a1a1a",
                accent: "#d97706",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Preview>
            Xác nhận đơn hàng #{orderNumber} - {shopName}
          </Preview>
          <Container className="mx-auto py-10 px-5 max-w-xl">
            {/* Header */}
            <Section className="bg-brand rounded-t-lg px-8 py-6 text-center">
              <Heading className="text-2xl font-bold text-white m-0">
                {shopName}
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="bg-white px-8 py-6">
              <Heading
                as="h2"
                className="text-xl font-bold text-gray-800 mt-0 mb-2"
              >
                ✅ Đặt hàng thành công!
              </Heading>
              <Text className="text-base text-gray-600 mt-0 mb-6">
                Cảm ơn bạn đã đặt hàng tại {shopName}. Đơn hàng của bạn đã
                được tiếp nhận.
              </Text>

              {/* Order Info */}
              <Section className="bg-gray-50 p-4 rounded mb-6">
                <Row>
                  <Column>
                    <Text className="text-xs text-gray-500 uppercase m-0 mb-1">
                      Mã đơn hàng
                    </Text>
                    <Text className="text-base font-bold text-gray-800 m-0">
                      #{orderNumber}
                    </Text>
                  </Column>
                  <Column>
                    <Text className="text-xs text-gray-500 uppercase m-0 mb-1">
                      Ngày đặt
                    </Text>
                    <Text className="text-base font-bold text-gray-800 m-0">
                      {orderDate}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border-solid border-gray-200 my-6" />

              {/* Order Items */}
              <Heading
                as="h3"
                className="text-lg font-bold text-gray-800 mt-0 mb-4"
              >
                Chi tiết đơn hàng
              </Heading>

              {items.map((item, index) => (
                <Section key={index} className="mb-3">
                  <Row>
                    <Column className="align-top">
                      <Text className="text-base font-bold text-gray-800 m-0 mb-1">
                        {item.quantity}x {item.productName}
                      </Text>
                      {item.modifiers.length > 0 && (
                        <Text className="text-sm text-gray-500 m-0">
                          {item.modifiers.join(", ")}
                        </Text>
                      )}
                    </Column>
                    <Column className="w-28 text-right align-top">
                      <Text className="text-base font-bold text-gray-800 m-0">
                        {formatVND(item.price * item.quantity)}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              ))}

              <Hr className="border-solid border-gray-200 my-4" />

              {/* Total */}
              <Row>
                <Column>
                  <Text className="text-lg font-bold text-gray-800 my-2">
                    Tổng cộng
                  </Text>
                </Column>
                <Column className="text-right">
                  <Text className="text-xl font-bold text-red-600 my-2">
                    {formatVND(totalAmount)}
                  </Text>
                </Column>
              </Row>

              <Hr className="border-solid border-gray-200 my-6" />

              {/* Delivery Info */}
              <Heading
                as="h3"
                className="text-lg font-bold text-gray-800 mt-0 mb-4"
              >
                Thông tin nhận hàng
              </Heading>
              <Section className="bg-gray-50 p-4 rounded mb-4">
                <Text className="text-sm text-gray-800 m-0 mb-1">
                  <strong>Người nhận:</strong> {customerName}
                </Text>
                <Text className="text-sm text-gray-800 m-0 mb-1">
                  <strong>Số điện thoại:</strong> {customerPhone}
                </Text>
                <Text className="text-sm text-gray-800 m-0 mb-1">
                  <strong>Địa chỉ:</strong> {customerAddress}
                </Text>
                <Text className="text-sm text-gray-800 m-0">
                  <strong>Thanh toán:</strong>{" "}
                  {formatPaymentMethod(paymentMethod)}
                </Text>
              </Section>

              {customerNote && (
                <Section className="bg-amber-50 p-4 rounded mb-4 border border-solid border-amber-200">
                  <Text className="text-sm text-gray-800 m-0">
                    <strong>📝 Ghi chú:</strong> {customerNote}
                  </Text>
                </Section>
              )}
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 rounded-b-lg px-8 py-6 text-center">
              <Text className="text-sm text-gray-500 m-0 mb-2">
                Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi.
              </Text>
              <Text className="text-xs text-gray-400 m-0">
                © {new Date().getFullYear()} {shopName}. Đây là email tự động,
                vui lòng không trả lời.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

OrderConfirmation.PreviewProps = {
  shopName: "Kim Cafe",
  orderNumber: "ORD-1234001",
  orderDate: "18/04/2026 15:30",
  customerName: "Nguyễn Văn A",
  customerPhone: "0901234567",
  customerAddress: "123 Đường ABC, Quận 1, TP.HCM",
  customerNote: "Lấy nhiều đá, ít đường",
  paymentMethod: "COD",
  items: [
    {
      productName: "Cà phê sữa đá",
      quantity: 2,
      price: 35000,
      modifiers: ["Size L", "Thêm shot"],
    },
    {
      productName: "Trà đào cam sả",
      quantity: 1,
      price: 45000,
      modifiers: [],
    },
  ],
  totalAmount: 115000,
} satisfies OrderConfirmationProps;

export { OrderConfirmation };
