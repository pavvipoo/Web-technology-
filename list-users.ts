
import { db } from "./server/db";
import { bookmarks, searchHistory } from "./shared/models/chat";

async function checkDb() {
  try {
    const b_users = await db.select({ userId: bookmarks.userId }).from(bookmarks);
    const s_users = await db.select({ userId: searchHistory.userId }).from(searchHistory);
    
    const unique_ids = new Set([...b_users.map(u => u.userId), ...s_users.map(u => u.userId)]);
    console.log("Unique User IDs in DB:", Array.from(unique_ids));
  } catch (err) {
    console.error("DB Check Error:", err);
  } finally {
      process.exit(0);
  }
}

checkDb();
