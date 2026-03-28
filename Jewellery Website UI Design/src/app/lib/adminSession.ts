export interface AdminSession {
  token: string;
  loggedInAt: string;
}

const ADMIN_SESSION_KEY = "sri-amman-admin-session";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAdminSession(): AdminSession | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as AdminSession;
    if (!parsedSession?.token) {
      return null;
    }

    return parsedSession;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
