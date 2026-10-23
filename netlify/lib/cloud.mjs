import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

export const SESSION_COOKIE = 'tumbuh_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
export const STATE_KEY = 'state/main';
export const SHARE_KEY = 'share/main';
const STORE_NAME = 'tumbuh-keluarga';
const MAX_STATE_BYTES = 3.5 * 1024 * 1024;
const MAX_BODY_BYTES = 4.5 * 1024 * 1024;
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export function json(statusCode, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders
    }
  });
}

export async function requestEvent(request, context = {}) {
  const method = request.method || 'GET';
  let body = '';
  if (method !== 'GET' && method !== 'HEAD') {
    body = await request.text();
  }
  return {
    httpMethod: method,
    headers: Object.fromEntries(request.headers.entries()),
    body,
    rawQuery: new URL(request.url).search.replace(/^\?/, ''),
    ip: context.ip || ''
  };
}

export function getEnvConfig() {
  const password = String(process.env.TUMBUH_EDIT_PASSWORD || '');
  const secret = String(process.env.TUMBUH_SESSION_SECRET || '');
  return {
    password,
    secret,
    configured: password.length >= 8 && secret.length >= 32
  };
}

export function getStoreClient() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

export function isSecureRequest(event) {
  const proto = String(event.headers['x-forwarded-proto'] || '').toLowerCase();
  const host = String(event.headers.host || '').toLowerCase();
  if (proto) return proto === 'https';
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) return false;
  return true;
}

export function parseCookies(header) {
  const result = {};
  if (!header) return result;
  String(header).split(';').forEach((part) => {
    const index = part.indexOf('=');
    if (index < 0) return;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) result[key] = decodeURIComponent(value);
  });
  return result;
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  if (a.length !== b.length) {
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken() {
  const { secret, configured } = getEnvConfig();
  if (!configured) throw new Error('not_configured');
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${expires}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token) {
  const { secret, configured } = getEnvConfig();
  if (!configured || !token) return false;
  const parts = String(token).split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  return safeEqual(parts[2], sign(payload, secret));
}

export function getSession(event) {
  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie);
  return verifySessionToken(cookies[SESSION_COOKIE]);
}

export function requireSession(event) {
  return getSession(event);
}

export function sessionCookie(event, token) {
  const secure = isSecureRequest(event);
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${SESSION_TTL_SECONDS}`,
    secure ? 'Secure' : ''
  ].filter(Boolean).join('; ');
}

export function clearSessionCookie(event) {
  const secure = isSecureRequest(event);
  return [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
    secure ? 'Secure' : ''
  ].filter(Boolean).join('; ');
}

export function readJsonBody(event) {
  const raw = event.body || '';
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    throw Object.assign(new Error('Body terlalu besar.'), { code: 'payload_too_large', status: 413 });
  }
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    throw Object.assign(new Error('Body JSON tidak valid.'), { code: 'invalid_json', status: 400 });
  }
}

export async function readState() {
  const store = getStoreClient();
  const value = await store.get(STATE_KEY, { type: 'json' });
  if (!value || typeof value !== 'object') {
    return { data: null, version: 0, updatedAt: null };
  }
  return {
    data: value.data && typeof value.data === 'object' ? value.data : null,
    version: Number(value.version) || 0,
    updatedAt: value.updatedAt || null
  };
}

export async function writeState(data, expectedVersion) {
  const store = getStoreClient();
  const current = await readState();
  if (current.version !== Number(expectedVersion)) {
    throw Object.assign(new Error('Data telah berubah di perangkat lain.'), {
      code: 'version_conflict',
      status: 409,
      currentVersion: current.version,
      updatedAt: current.updatedAt
    });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw Object.assign(new Error('Data harus berupa objek.'), { code: 'invalid_data', status: 400 });
  }
  const serialized = JSON.stringify(data);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_STATE_BYTES) {
    throw Object.assign(new Error('Data keluarga terlalu besar.'), { code: 'data_too_large', status: 413 });
  }
  const version = current.version + 1;
  const updatedAt = new Date().toISOString();
  await store.setJSON(STATE_KEY, { data, version, updatedAt });
  return { version, updatedAt };
}

export async function getShare({ create = false } = {}) {
  const store = getStoreClient();
  let value = await store.get(SHARE_KEY, { type: 'json' });
  if ((!value || !value.token) && create) {
    value = {
      token: crypto.randomBytes(24).toString('base64url'),
      enabled: true,
      createdAt: new Date().toISOString(),
      rotatedAt: new Date().toISOString()
    };
    await store.setJSON(SHARE_KEY, value);
  }
  if (!value) return null;
  return {
    token: String(value.token || ''),
    enabled: Boolean(value.enabled),
    createdAt: value.createdAt || null,
    rotatedAt: value.rotatedAt || null
  };
}

export async function saveShare(value) {
  const store = getStoreClient();
  await store.setJSON(SHARE_KEY, value);
  return value;
}

export function newShareToken() {
  return crypto.randomBytes(24).toString('base64url');
}

export function getClientIp(event) {
  const forwarded = event.headers['x-forwarded-for'];
  const direct = event.ip || event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'];
  const value = direct || (forwarded ? String(forwarded).split(',')[0].trim() : 'unknown');
  return String(value || 'unknown');
}

function rateKey(ip) {
  return `rate/${crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 40)}`;
}

export async function checkLoginRate(ip) {
  try {
    const store = getStoreClient();
    const value = await store.get(rateKey(ip), { type: 'json' });
    if (!value) return { allowed: true, remaining: RATE_LIMIT_MAX };
    if (Date.now() > Number(value.resetAt || 0)) return { allowed: true, remaining: RATE_LIMIT_MAX };
    if (Number(value.count) >= RATE_LIMIT_MAX) {
      return { allowed: false, retryAfter: Math.ceil((Number(value.resetAt) - Date.now()) / 1000) };
    }
    return { allowed: true, remaining: Math.max(0, RATE_LIMIT_MAX - Number(value.count)) };
  } catch (err) {
    console.warn('Rate limit tidak tersedia:', err);
    return { allowed: true, remaining: RATE_LIMIT_MAX };
  }
}

export async function recordLoginFailure(ip) {
  try {
    const store = getStoreClient();
    const key = rateKey(ip);
    const value = await store.get(key, { type: 'json' });
    const now = Date.now();
    if (!value || now > Number(value.resetAt || 0)) {
      await store.setJSON(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else {
      await store.setJSON(key, { count: Number(value.count || 0) + 1, resetAt: value.resetAt });
    }
  } catch (err) {
    console.warn('Gagal mencatat percobaan login:', err);
  }
}

export async function clearLoginRate(ip) {
  try {
    await getStoreClient().delete(rateKey(ip));
  } catch (err) {
    // Tidak masalah bila penghapusan gagal.
  }
}

export function noIndexHeaders() {
  return {
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'Referrer-Policy': 'no-referrer'
  };
}

export function errorFrom(err) {
  return {
    status: err && err.status ? err.status : 500,
    code: err && err.code ? err.code : 'server_error',
    message: err && err.code && err.code !== 'server_error'
      ? err.message
      : 'Terjadi kesalahan pada server.'
  };
}
