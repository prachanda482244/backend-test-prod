import express from "express";
import crypto from "crypto";

const app = express();
const SHOPIFY_SECRET =
  "6e83565daa74fc8f3d691f8c1309886e0ee4f1c722309072af0c2e149845cd3d";

app.use(express.json()); // Parse JSON request bodies

async function verifyShopifyRequest(req, res, next) {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");

  console.log("Received X-Shopify-Hmac-Sha256:", hmacHeader);

  if (!hmacHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body = JSON.stringify(req.body); // Get the raw body as a string
  const hmac = crypto
    .createHmac("sha256", SHOPIFY_SECRET)
    .update(body, "utf8")
    .digest("base64");

  const isValidRequest = crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(hmacHeader)
  );

  if (!isValidRequest) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}

app.get("/", verifyShopifyRequest, (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.post("/webhook_compliance/shopify/", verifyShopifyRequest, (req, res) => {
  console.log("Request received at webhooks");

  res.status(200).json({ message: "OK" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
