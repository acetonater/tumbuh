import {
  errorFrom,
  getShare,
  json,
  newShareToken,
  readJsonBody,
  requestEvent,
  requireSession,
  saveShare
} from '../lib/cloud.mjs';

function publicShare(share) {
  return {
    token: share.token,
    enabled: Boolean(share.enabled),
    createdAt: share.createdAt || null,
    rotatedAt: share.rotatedAt || null
  };
}

export default async function shareHandler(request, context) {
  const event = await requestEvent(request, context);
  try {
    if (!requireSession(event)) {
      return json(401, { error: 'unauthorized', message: 'Masuk ke akun keluarga terlebih dahulu.' });
    }
    if (event.httpMethod === 'GET') {
      const share = await getShare({ create: true });
      return json(200, publicShare(share));
    }
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'method_not_allowed', message: 'Gunakan GET atau POST.' });
    }

    const body = readJsonBody(event);
    const action = String(body.action || '');
    const now = new Date().toISOString();
    let share = await getShare({ create: true });

    if (action === 'rotate') {
      share = {
        token: newShareToken(),
        enabled: true,
        createdAt: share.createdAt || now,
        rotatedAt: now
      };
    } else if (action === 'enable') {
      share = { ...share, enabled: true };
    } else if (action === 'disable') {
      share = { ...share, enabled: false };
    } else {
      return json(400, { error: 'invalid_action', message: 'Aksi tautan tidak dikenal.' });
    }

    await saveShare(share);
    return json(200, publicShare(share));
  } catch (err) {
    console.error('share:', err);
    const info = errorFrom(err);
    return json(info.status, { error: info.code, message: info.message });
  }
}
