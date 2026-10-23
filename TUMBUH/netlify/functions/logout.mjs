import { clearSessionCookie, errorFrom, json, requestEvent } from '../lib/cloud.mjs';

export default async function logoutHandler(request, context) {
  const event = await requestEvent(request, context);
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'method_not_allowed', message: 'Gunakan POST.' });
    }
    return json(200, { ok: true }, {
      'Set-Cookie': clearSessionCookie(event)
    });
  } catch (err) {
    console.error('logout:', err);
    const info = errorFrom(err);
    return json(info.status, { error: info.code, message: info.message });
  }
}
