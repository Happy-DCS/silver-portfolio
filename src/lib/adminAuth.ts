import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 4;

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET 환경변수가 설정되지 않았습니다.");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createAdminToken(): string {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

function isValidToken(token: string): boolean {
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const expected = sign(expiresAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  return Number(expiresAt) > Date.now();
}

/** Route Handler에서 쓰기 요청을 인가한다. 실패 시 401 응답을 반환하고, 성공 시 null을 반환한다. */
export function requireAdminToken(request: Request): Response | null {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";

  if (!token || !isValidToken(token)) {
    return Response.json({ error: "인증이 필요합니다. 다시 로그인해주세요." }, { status: 401 });
  }
  return null;
}
