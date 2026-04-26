import type { Subscription } from "./types";

const API_URL = "http://localhost:8080";

export async function getSubscriptions(userId: string): Promise<Subscription[]> {
  const response = await fetch(`${API_URL}/api/subscriptions/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  return response.json();
}