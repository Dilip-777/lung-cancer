import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: number; // Keep the id as a number
    name: string;
    email: string;
  }

  interface Session {
    user: User; // Extend the session user to include your custom user type
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
  }
}
