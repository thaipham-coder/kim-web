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
  Button,
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

interface NewOrderNotificationProps {
  shopName: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerNote?: string;
  paymentMethod: string;
  isPaid: boolean;
  items: OrderItem[];
  totalAmount: number;
  adminUrl: string;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    COD: "COD (Thanh toán khi nhận)",
    BANK_TRANSFER: "Chuyển khoản",
    ZALOPAY: "ZaloPay",
  };
  return map[method] || method;
}

export default function NewOrderNotification({
  shopName,
  orderNumber,
  orderDate,
  customerName,
  customerPhone,
  customerEmail,
  customerAddress,
  customerNote,
  paymentMethod,
  isPaid,
  items,
  totalAmount,
  adminUrl,
}: NewOrderNotificationProps) {
  return (
    <Html lang="vi">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#1a1a1a",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Preview>
            🔔 Đơn hàng mới #{orderNumber} - {formatVND(totalAmount)}
          </Preview>
          <Container className="mx-auto py-10 px-5 max-w-xl">
            {/* Header */}
            <Section className="bg-amber-500 rounded-t-lg px-8 py-6 text-center">
              <Heading className="text-2xl font-bold text-white m-0">
                🔔 Đơn hàng mới!
              </Heading>
              <Text className="text-base text-amber-100 m-0 mt-2">
                #{orderNumber} • {formatVND(totalAmount)}
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="bg-white px-8 py-6">
              {/* Customer Info */}
              <Heading
                as="h3"
                className="text-lg font-bold text-gray-800 mt-0 mb-4"
              >
                👤 Thông tin khách hàng
              </Heading>
              <Section className="bg-gray-50 p-4 rounded mb-6">
                <Text className="text-sm text-gray-800 m-0 mb-1">
                  <strong>Họ tên:</strong> {customerName}
                </Text>
                <Text className="text-sm text-gray-800 m-0 mb-1">
                  <strong>SĐT:</strong> {customerPhone}
                </Text>
                {customerEmail && (
                  <Text className="text-sm text-gray-800 m-0 mb-1">
                    <strong>Email:</strong> {customerEmail}
                  </Text>
                )}
                <Text className="text-sm text-gray-800 m-0 mb-1">
                  <strong>Địa chỉ:</strong> {customerAddress}
                </Text>
                <Text className="text-sm text-gray-800 m-0">
                  <strong>Thời gian:</strong> {orderDate}
                </Text>
              </Section>

              <Hr className="border-solid border-gray-200 my-6" />

              {/* Order Items */}
              <Heading
                as="h3"
                className="text-lg font-bold text-gray-800 mt-0 mb-4"
              >
                🛒 Danh sách món
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
                          ↳ {item.modifiers.join(", ")}
                        </Text>
                      )}
                    </Column>
                    <Column className="w-28 text-right align-top">
                      <Text className="text-base text-gray-800 m-0">
                        {formatVND(item.price * item.quantity)}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              ))}

              <Hr className="border-solid border-gray-200 my-4" />

              {/* Payment & Total */}
              <Section className="mb-6">
                <Row>
                  <Column>
                    <Text className="text-sm text-gray-600 my-1">
                      Thanh toán
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text className="text-sm text-gray-800 my-1">
                      {formatPaymentMethod(paymentMethod)}
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-sm text-gray-600 my-1">
                      Trạng thái
                    </Text>
                  </Column>
                  <Column className="text-right">
                    <Text
                      className={`text-sm font-bold my-1 ${isPaid ? "text-green-600" : "text-amber-600"}`}
                    >
                      {isPaid ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}
                    </Text>
                  </Column>
                </Row>
                <Hr className="border-solid border-gray-200 my-3" />
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
              </Section>

              {/* Customer Note */}
              {customerNote && (
                <Section className="bg-amber-50 p-4 rounded mb-6 border border-solid border-amber-200">
                  <Text className="text-sm text-gray-800 m-0">
                    <strong>📝 Ghi chú của khách:</strong> {customerNote}
                  </Text>
                </Section>
              )}

              {/* CTA Button */}
              <Button
                href={adminUrl}
                className="bg-brand text-white px-7 py-3.5 rounded block text-center font-bold text-base no-underline box-border w-full"
              >
                Xem & Xử lý đơn hàng →
              </Button>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 rounded-b-lg px-8 py-4 text-center">
              <Text className="text-xs text-gray-400 m-0">
                Email thông báo tự động từ {shopName}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

NewOrderNotification.PreviewProps = {
  shopName: "Kim Cafe",
  orderNumber: "ORD-1234001",
  orderDate: "18/04/2026 15:30",
  customerName: "Nguyễn Văn A",
  customerPhone: "0901234567",
  customerEmail: "vana@gmail.com",
  customerAddress: "123 Đường ABC, Quận 1, TP.HCM",
  customerNote: "Lấy nhiều đá, ít đường",
  paymentMethod: "COD",
  isPaid: false,
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
  adminUrl: "https://kimcafe.biz.vn/admin/orders",
} satisfies NewOrderNotificationProps;

export { NewOrderNotification };
