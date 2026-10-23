import { errorFrom, getEnvConfig, getSession, json, requestEvent } from '../lib/cloud.mjs';

export default async function sessionHandler(request, context) {
  const event = await requestEvent(request, context);
  try {
    if (event.httpMethod !== 'GET') {
      return json(405, { error: 'method_not_allowed', message: 'Gunakan GET.' });
    }
    const { configured } = getEnvConfig();
    if (!configured) {
      return json(200, { configured: false, authenticated: false });
    }
    return json(200, {
      configured: true,
      authenticated: getSession(event)
    });
  } catch (err) {
    console.error('session:', err);
    const info = errorFrom(err);
    return json(info.status, { error: info.code, message: info.message });
  }
}
