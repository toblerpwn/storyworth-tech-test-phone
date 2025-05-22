import type { CallRequestBody } from "@/app/api/call/route";

export async function makeCall(phoneNumber: string) {
  console.warn("Making call to:", phoneNumber);

  const res = await fetch("/api/call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber } satisfies CallRequestBody),
  });

  console.log("res:", res.status);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Unknown error");
  }
  return data;
}
