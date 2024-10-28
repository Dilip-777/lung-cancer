import { db } from '@/db/drizzle';
import { user } from '@/db/schema';
import { and, eq, is } from 'drizzle-orm';

export const userService = {
  authenticate,
};

async function authenticate(name: string, password: string) {
  const isExist = await db
    .select()
    .from(user)
    .where(and(eq(user.name, name)))
    .execute();

  console.log(isExist);

  if (!isExist) {
    return null;
  }

  if (isExist[0]?.password === password) {
    return isExist[0];
  }

  return null;
}
