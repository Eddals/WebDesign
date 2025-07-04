import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/hubspot", async (req, res) => {
  const { name, email, phone, company, country, industry } = req.body;
  try {
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_TOKEN || "pat-na2-0e94e7a3-5904-4247-ba2c-68dcf7c50c08"}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          email,
          firstname: name,
          phone,
          company,
          country,
          industry
        }
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("HubSpot error:", err);
    res.status(500).json({ error: "Failed to submit to HubSpot" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
