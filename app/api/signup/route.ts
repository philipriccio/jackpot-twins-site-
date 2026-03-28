import { NextRequest, NextResponse } from "next/server";

const CRM_URL = process.env.CRM_URL || "https://crm.companytheatre.ca";
const CRM_AUTH = process.env.CRM_AUTH || "Philip:Riccio";
const TAG_NAME = "Jackpot Website";

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const authHeader = `Basic ${Buffer.from(CRM_AUTH).toString("base64")}`;

    // Check if contact already exists (CRM returns a plain array)
    const checkRes = await fetch(
      `${CRM_URL}/api/contacts?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: authHeader } },
    );

    if (checkRes.ok) {
      const existing = await checkRes.json();
      const contacts = Array.isArray(existing) ? existing : existing.contacts ?? [];
      if (contacts.length > 0) {
        const contact = contacts[0];
        const hasTag = contact.tags?.some(
          (t: { name: string }) => t.name === TAG_NAME,
        );

        if (hasTag) {
          return NextResponse.json(
            { message: "You're already signed up!" },
            { status: 200 },
          );
        }

        // Add the Jackpot Website tag to existing contact
        await fetch(`${CRM_URL}/api/contacts/${contact.id}/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ tag: TAG_NAME }),
        });

        return NextResponse.json(
          { message: "You're on the list!" },
          { status: 200 },
        );
      }
    }

    // Create new contact with Jackpot Website tag
    const createRes = await fetch(`${CRM_URL}/api/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        tags: [TAG_NAME],
        source: "Jackpot Twins website signup",
      }),
    });

    if (!createRes.ok) {
      // 409 = contact already exists (race condition with check above)
      if (createRes.status === 409) {
        return NextResponse.json(
          { message: "You're already signed up!" },
          { status: 200 },
        );
      }
      const errorData = await createRes.json().catch(() => ({}));
      console.error("CRM error:", errorData);
      return NextResponse.json(
        { error: "Unable to sign up. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "You're on the list!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
