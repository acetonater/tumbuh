import {
  errorFrom,
  getShare,
  json,
  noIndexHeaders,
  readState,
  requestEvent,
  safeEqual
} from '../lib/cloud.mjs';

export default async function sharedHandler(request, context) {
  const event = await requestEvent(request, context);
  try {
    if (event.httpMethod !== 'GET') {
      return json(405, { error: 'method_not_allowed', message: 'Gunakan GET.' });
    }
    const params = new URLSearchParams(event.rawQuery || '');
    const token = String(params.get('token') || '').trim();
    if (!token || token.length < 20 || token.length > 80) {
      return json(404, { error: 'share_not_found', message: 'Tautan tidak berlaku.' }, noIndexHeaders());
    }

    const share = await getShare();
    if (!share || !share.enabled || !safeEqual(token, share.token)) {
      return json(404, { error: 'share_not_found', message: 'Tautan tidak berlaku atau sudah dinonaktifkan.' }, noIndexHeaders());
    }

    const state = await readState();
    if (!state.data) {
      return json(404, { error: 'share_empty', message: 'Belum ada data keluarga untuk ditampilkan.' }, noIndexHeaders());
    }

    // Tautan lihat-saja hanya membawa catatan tumbuh kembang anak.
    // Data keluarga (anggota, dokumen, kontak, tagihan) tidak pernah dikirim lewat tautan publik.
    const { household, ...tumbuhOnly } = state.data;
    void household;
    return json(200, {
      data: tumbuhOnly,
      version: state.version,
      updatedAt: state.updatedAt
    }, noIndexHeaders());
  } catch (err) {
    console.error('shared:', err);
    const info = errorFrom(err);
    return json(info.status, { error: info.code, message: info.message }, noIndexHeaders());
  }
}
