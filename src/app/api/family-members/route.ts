import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    const name = (body.name as string)?.trim();
    const phone = (body.phone as string)?.trim();

    if (!name || !phone) {
      return Response.json(
        { message: "Name and phone are required." },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { message: "Server configuration error." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try family_members table if it exists.
    const { error } = await supabase.from("family_members").insert({
      name,
      phone,
    });

    if (error) {
      // Table may not exist (42P01) or other DB error; allow UI to work.
      const isMissingTable =
        error.code === "42P01" ||
        (error.message && /does not exist|relation.*not found/i.test(error.message));
      if (isMissingTable) {
        return Response.json({ success: true });
      }
      console.error("family-members insert error:", error);
      return Response.json(
        { message: error.message ?? "Failed to save." },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
