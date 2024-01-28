import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const ACCESS_TOKEN = process.env.KODIC_ACCESS_TOKEN;

export default async function animeById(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  const config = {
    params: {
      token: ACCESS_TOKEN,
      id: id as string,
    },
  };

  try {
    const response = await axios.get("https://kodikapi.com/search", config);
    const data = response.data;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
