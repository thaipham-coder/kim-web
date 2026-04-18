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
}

interface OrderStatusUpdateProps {
  shopName: string;
  orderNumber: string;
  status: "PREPARING" | "DELIVERING" | "COMPLETED" | "CANCELLED";
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

const statusConfig: Record<
  string,
  { label: string; message: string; emoji: string; color: string; bgColor: string }
> = {
  PREPARING: {
    label: "Đang chuẩn bị",
    message:
      "Chúng tôi đã xác nhận và đang chuẩn bị đơn hàng của bạn. Vui lòng chờ trong giây lát!",
    emoji: "👨‍🍳",
    color: "text-blue-700",
    bgColor: "bg-blue-500",
  },
  DELIVERING: {
    label: "Đang giao hàng",
    message:
      "Đơn hàng đang trên đường giao đến bạn. Vui lòng để ý điện thoại nhé!",
    emoji: "🛵",
    color: "text-purple-700",
    bgColor: "bg-purple-500",
  },
  COMPLETED: {
    label: "Hoàn thành",
    message:
      "Đơn hàng đã hoàn thành. Cảm ơn bạn đã ủng hộ! Hẹn gặp lại lần sau 💛",
    emoji: "✅",
    color: "text-green-700",
    bgColor: "bg-green-500",
  },
  CANCELLED: {
    label: "Đã huỷ",
    message:
      "Rất tiếc, đơn hàng đã bị huỷ. Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi.",
    emoji: "❌",
    color: "text-red-700",
    bgColor: "bg-red-500",
  },
};

export default function OrderStatusUpdate({
  shopName,
  orderNumber,
  status,
  customerName,
  items,
  totalAmount,
}: OrderStatusUpdateProps) {
  const config = statusConfig[status];

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
            {config.emoji} Đơn hàng #{orderNumber} - {config.label}
          </Preview>
          <Container className="mx-auto py-10 px-5 max-w-xl">
            {/* Colored Header */}
            <Section
              className={`${config.bgColor} rounded-t-lg px-8 py-6 text-center`}
            >
              <Text className="text-4xl m-0 mb-2">{config.emoji}</Text>
              <Heading className="text-2xl font-bold text-white m-0">
                {config.label}
              </Heading>
              <Text className="text-base text-white m-0 mt-2">
                Đơn hàng #{orderNumber}
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="bg-white px-8 py-6">
              <Text className="text-base text-gray-800 mt-0 mb-2">
                Xin chào <strong>{customerName}</strong>,
              </Text>
              <Text className="text-base text-gray-600 mt-0 mb-6 leading-6">
                {config.message}
              </Text>

              <Hr className="border-solid border-gray-200 my-6" />

              {/* Order Summary */}
              <Heading
                as="h3"
                className="text-lg font-bold text-gray-800 mt-0 mb-4"
              >
                Tóm tắt đơn hàng
              </Heading>

              {items.map((item, index) => (
                <Row key={index}>
                  <Column className="align-top">
                    <Text className="text-sm text-gray-700 my-1">
                      {item.quantity}x {item.productName}
                    </Text>
                  </Column>
                  <Column className="w-24 text-right align-top">
                    <Text className="text-sm text-gray-700 my-1">
                      {formatVND(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}

              <Hr className="border-solid border-gray-200 my-3" />

              <Row>
                <Column>
                  <Text className="text-base font-bold text-gray-800 my-2">
                    Tổng cộng
                  </Text>
                </Column>
                <Column className="text-right">
                  <Text className="text-lg font-bold text-red-600 my-2">
                    {formatVND(totalAmount)}
                  </Text>
                </Column>
              </Row>
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

OrderStatusUpdate.PreviewProps = {
  shopName: "Kim Cafe",
  orderNumber: "ORD-1234001",
  status: "PREPARING" as const,
  customerName: "Nguyễn Văn A",
  items: [
    { productName: "Cà phê sữa đá", quantity: 2, price: 35000 },
    { productName: "Trà đào cam sả", quantity: 1, price: 45000 },
  ],
  totalAmount: 115000,
} satisfies OrderStatusUpdateProps;

export { OrderStatusUpdate };
