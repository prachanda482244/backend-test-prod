import express, { urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 6000;
const app = express();
app.use(cors({ origin: "*", withCredentials: true }));

app.use(express.json({ limit: "20mb" }));
app.use(urlencoded({ extended: true, limit: "20mb" }));

app.post("/get-console-data", (req, res) => {
  res.status(200).send(req.body);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
