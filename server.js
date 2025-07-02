import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors()); // allow frontend requests
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "dist")));

// hubspot form
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
console.log(HUBSPOT_TOKEN);

app.post("/api/create-contact", async (req, res) => {
  const {
    prenom,
    nom,
    email,
    tel,
    adress1,
    adress2,
    zipCode,
    etat,
    countryResidence,
    countryPassport,
    isOver18,
    financialQualification,
    destination,
    year,
    pleaseShare,
  } = req.body;

  const properties = {
    firstname: prenom,
    lastname: nom,
    email: email,
    phone: tel,
    address: adress1,
    address2: adress2,
    zip: zipCode,
    state: etat,
    country: countryResidence,
    country_of_residence: countryResidence,
    country_of_passport: countryPassport,
    is_over_18: isOver18,
    financial_qualification: financialQualification,
    destination: destination,
    year: year,
    notes: pleaseShare,
  };

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      { properties },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "Error creating contact:",
      error.response?.data || error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get(/.*/, (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
