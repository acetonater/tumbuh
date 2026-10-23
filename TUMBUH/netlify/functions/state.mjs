import {
  errorFrom,
  json,
  readJsonBody,
  readState,
  requestEvent,
  requireSession,
  writeState
} from '../lib/cloud.mjs';

export default async function stateHandler(request, context) {
  const event = await requestEvent(request, context);
  try {
    if (!requireSession(event)) {
      return json(401, { error: 'unauthorized', message: 'Masuk ke akun keluarga terlebih dahulu.' });
    }
    if (event.httpMethod === 'GET') {
      const state = await readState();
      return json(200, state);
    }
    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      const body = readJsonBody(event);
      const baseVersion = Number(body.baseVersion) || 0;
      const result = await writeState(body.data, baseVersion);
      return json(200, result);
    }
    return json(405, { error: 'method_not_allowed', message: 'Gunakan GET atau PUT.' });
  } catch (err) {
    console.error('state:', err);
    const info = errorFrom(err);
    return json(info.status, {
      error: info.code,
      message: info.message,
      ...(err && err.currentVersion != null ? { version: err.currentVersion, updatedAt: err.updatedAt } : {})
    });
  }
}
