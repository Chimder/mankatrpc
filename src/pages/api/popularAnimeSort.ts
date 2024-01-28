import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const ACCESS_TOKEN = process.env.KODIC_ACCESS_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // const { title } = req.query;

  const config = {
    params: {
      token: ACCESS_TOKEN,
      sort: "updated_at",
      order: "desc",
      limit: 30,
      anime_status: "ongoing",
      with_material_data: true,
      has_field: "shikimori_id",
    },
  };

  try {
    const response = await axios.get("https://kodikapi.com/list", config);
    const data = response.data;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
