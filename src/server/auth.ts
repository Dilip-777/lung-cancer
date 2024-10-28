import { getServerSession, type NextAuthOptions } from 'next-auth';
import { userService } from './services/userService';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as number;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        name: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { name, password } = credentials as {
          name: string;
          password: string;
        };

        return userService.authenticate(name, password);
      },
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
