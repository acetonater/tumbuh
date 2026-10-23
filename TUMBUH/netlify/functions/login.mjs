import {
  checkLoginRate,
  clearLoginRate,
  createSessionToken,
  errorFrom,
  getClientIp,
  getEnvConfig,
  json,
  readJsonBody,
  recordLoginFailure,
  requestEvent,
  safeEqual,
  sessionCookie
} from '../lib/cloud.mjs';

export default async function loginHandler(request, context) {
  const event = await requestEvent(request, context);
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'method_not_allowed', message: 'Gunakan POST.' });
    }
    const config = getEnvConfig();
    if (!config.configured) {
      return json(503, {
        error: 'not_configured',
        message: 'TUMBUH_EDIT_PASSWORD dan TUMBUH_SESSION_SECRET belum diatur di Netlify.'
      });
    }

    const ip = getClientIp(event);
    const rate = await checkLoginRate(ip);
    if (!rate.allowed) {
      return json(429, {
        error: 'rate_limited',
        message: 'Terlalu banyak percobaan. Coba lagi nanti.'
      }, { 'Retry-After': String(rate.retryAfter || 900) });
    }

    const body = readJsonBody(event);
    const password = String(body.password || '');
    if (!password) {
      return json(400, { error: 'invalid_password', message: 'Kata sandi wajib diisi.' });
    }
    if (!safeEqual(password, config.password)) {
      await recordLoginFailure(ip);
      return json(401, { error: 'invalid_password', message: 'Kata sandi keluarga salah.' });
    }

    await clearLoginRate(ip);
    const token = createSessionToken();
    return json(200, { ok: true }, {
      'Set-Cookie': sessionCookie(event, token)
    });
  } catch (err) {
    console.error('login:', err);
    const info = errorFrom(err);
    return json(info.status, { error: info.code, message: info.message });
  }
}
