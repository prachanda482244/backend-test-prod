import express from "express";
import crypto from "crypto";

const app = express();
const CLIENT_SECRET =
  "6e83565daa74fc8f3d691f8c1309886e0ee4f1c722309072af0c2e149845cd3d";

// Middleware to capture raw request body for HMAC verification
app.use(express.json({ verify: (req, res, buf) => (req.rawBody = buf) }));

// Function to verify HMAC
function verifyWebhook(data, hmacHeader) {
  const calculatedHmac = crypto
    .createHmac("sha256", CLIENT_SECRET)
    .update(data, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(calculatedHmac),
    Buffer.from(hmacHeader)
  );
}

// Handle POST requests
app.post("/webhook_compliance/shopify", (req, res) => {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  const data = req.rawBody.toString(); // Get the raw body as a string

  if (!verifyWebhook(data, hmacHeader)) {
    return res.status(401).send("Unauthorized");
  }

  Example: console.log("Webhook payload:", req.body);

  res.status(200).send("Webhook received");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
