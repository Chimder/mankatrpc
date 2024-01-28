import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const ACCESS_TOKEN = process.env.KODIC_ACCESS_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name } = req.query;

  console.log(name);
  const config = {
    params: {
      token: ACCESS_TOKEN,
      title: name as string,
      strict: true,
      with_material_data: true,
      has_field: "shikimori_id",
    },
  };

  try {
    const { data } = await axios.get("https://kodikapi.com/search", config);
    // const data = response.data;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
