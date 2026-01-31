import { createApi } from "unsplash-js";
import { NextResponse } from "next/server";

const accessKey = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const unsplash = accessKey ? createApi({ accessKey }) : null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(30, Math.max(1, parseInt(searchParams.get("count") ?? "9", 10)));
  const collectionIds = searchParams.get("collectionIds") ?? "317099";

  if (!unsplash) {
    return NextResponse.json(
      { error: "Unsplash not configured. Set UNSPLASH_ACCESS_KEY or NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in .env." },
      { status: 500 }
    );
  }

  try {
    const result = await unsplash.photos.getRandom({
      collectionIds: collectionIds.split(",").map((id) => id.trim()),
      count,
    });

    if (result.type === "error" || result.errors) {
      const message = result.errors?.[0] ?? "Unsplash API error";
      console.error("[Unsplash API]", message);
      return NextResponse.json({ error: String(message) }, { status: 502 });
    }

    const data = result.response;
    const photos = Array.isArray(data) ? data : data ? [data] : [];
    return NextResponse.json(photos);
  } catch (err) {
    console.error("[Unsplash proxy]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch from Unsplash" },
      { status: 502 }
    );
  }
}
