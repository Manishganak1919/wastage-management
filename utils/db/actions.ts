import { db } from "./dbConfig";
import { Users, Notifications, Transactions } from "./schema";
import { eq, sql, and, desc } from "drizzle-orm";

//function for create new user
export async function createUser(email: string, name: string) {
  try {
    const [user] = await db
      .insert(Users)
      .values({ email, name })
      .returning()
      .execute();
    return user;
  } catch (error) {
    console.log("Error creating user", error);
    return null;
  }
}

// function for get User by email
export async function getUserByemail(email: string) {
  try {
    const [user] = await db.select().from(Users).where(eq(Users.email, email));
    return user;
  } catch (error) {
    console.log("Error fetching user by email", error);
    return null;
  }
}

// function for getUnreadNotification
export async function getUnreadNotification(userId: number) {
  try {
    return await db
      .select()
      .from(Notifications)
      .where(
        and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))
      )
      .execute();
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
}

// Function to get user balance
export async function getUserBalance(userId: number): Promise<number> {
    try {
        const transactions = await getRewardedTransaction(userId) || [];

        // Calculate the balance by summing earned and subtracting non-earned amounts
        const balance = transactions.reduce((acc, transaction) => {
            return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount;
        }, 0);

        // Ensure the balance is never negative
        return Math.max(balance, 0);
    } catch (error) {
        console.error("Error calculating user balance:", error);
        throw error;
    }
}

// Function to get rewarded transactions
export async function getRewardedTransaction(userId: number) {
    try {
        console.log('Fetching transactions for user ID:', userId);

        const transactions = await db
            .select({
                id: Transactions.id,
                type: Transactions.type,
                amount: Transactions.amount,
                description: Transactions.description,
                date: Transactions.date,
            })
            .from(Transactions)
            .where(eq(Transactions.userId, userId))
            .orderBy(desc(Transactions.date))
            .limit(10)
            .execute();

        console.log('Raw transactions from database:', transactions);

        // Format the transactions
        const formattedTransaction = transactions.map(t => ({
            ...t,
            date: t.date.toISOString().split('T')[0] // Format the date as 'yyyy-mm-dd'
        }));

        return formattedTransaction;
    } catch (error) {
        console.error("Error fetching rewarded transactions:", error);
        return [];
    }
}
