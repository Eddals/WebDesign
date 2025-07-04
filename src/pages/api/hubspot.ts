import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, phone, company, country, industry } = req.body;

  try {
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: "Bearer pat-na2-0e94e7a3-5904-4247-ba2c-68dcf7c50c08",
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
    return res.status(200).json(data);
  } catch (error) {
    console.error("HubSpot error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
