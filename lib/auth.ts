import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  customerId?: string;
  displayName?: string;
  matchValue?: string;
  boardId?: string;
  adminBoardId?: string;
  isLoggedIn: boolean;
  isAdmin?: boolean;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "complex_password_at_least_32_characters_long",
  cookieName: "os2_portal_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireSession() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.matchValue || !session.boardId) {
    return null;
  }
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) return null;
  return session;
}
