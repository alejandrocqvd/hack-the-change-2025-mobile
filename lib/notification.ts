import { supabase } from "../lib/supabase";
import { getUserId } from "./users";

export async function getUserNotifications() {
    try {
        const userId = await getUserId();
        if (!userId) throw new Error("No user found");

        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;
        return data;
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    } 
}

export async function updateAllNotificationsToRead() {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("No user found");

    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false)
      .select();

    if (error) throw error;

    console.log("Notifications marked as read:", data);
  } catch (error) {
    console.error("Error updating notifications:", error);
  }
}