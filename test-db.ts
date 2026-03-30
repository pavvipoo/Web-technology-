
import { db } from "./server/db";
import { bookmarks, searchHistory } from "./shared/models/chat";

async function checkDb() {
  try {
    const b = await db.select().from(bookmarks);
    console.log("Total Bookmarks in DB:", b.length);
    if (b.length > 0) {
      console.log("Sample Bookmark UserId:", b[0].userId);
    }

    const s = await db.select().from(searchHistory);
    console.log("Total Search History in DB:", s.length);
    if (s.length > 0) {
      console.log("Sample Search UserId:", s[0].userId);
    }
  } catch (err) {
    console.error("DB Check Error:", err);
  } finally {
      process.exit(0);
  }
}

checkDb();
