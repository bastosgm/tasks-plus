import { NextAuthOptions, Session, getServerSession } from "next-auth";

export async function getSession(authOptions: NextAuthOptions) {
  const session: Session | null = await getServerSession(authOptions);
  return session;
}
