"use server";
import { sql } from "@/app/lib/sql-hack";
import { Link } from "@/app/lib/definitions";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_noStore as noStore } from "next/cache";

async function fetchLinks() {
  noStore();
  try {
    const data = await sql<Array<Link>>`
          SELECT * FROM links;
      `;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch links");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const data = {
      message: await fetchLinks(),
    };
    return res.status(200).json(data);
  }
}
