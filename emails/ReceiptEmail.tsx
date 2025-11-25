// emails/ReceiptEmail.tsx
import { Html, Head, Preview, Body, Container, Heading, Text, Hr, Img, Section } from "@react-email/components";

export function ReceiptEmail({ order, user }: any) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your order!</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ padding: "40px 20px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "40px", textAlign: "center" }}>
            <Heading style={{ fontSize: "28px", marginBottom: "20px" }}>
              Order Confirmed! Thank you {user.user_metadata.full_name || "Shopper"}!
            </Heading>
            <Text style={{ fontSize: "16px", color: "#666" }}>
              Your order has been confirmed and will be shipped soon.
            </Text>
            <Hr style={{ margin: "30px 0" }} />
            <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
              Total: ₹{order.amount}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}