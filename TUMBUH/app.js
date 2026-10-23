(() => {
  'use strict';

  /* =========================================================
     Konstanta & data rujukan
     ========================================================= */

  const STORAGE_KEY = 'tumbuh-app-v1';
  const VALID_VIEWS = ['dashboard', 'growth', 'milestones', 'immunizations', 'journal', 'family', 'settings'];
  const VIEW_META = {
    dashboard: { crumb: 'Ringkasan', title: 'Ringkasan' },
    growth: { crumb: 'Tumbuh kembang', title: 'Tumbuh kembang' },
    milestones: { crumb: 'Milestone', title: 'Milestone' },
    immunizations: { crumb: 'Imunisasi', title: 'Imunisasi' },
    journal: { crumb: 'Jurnal kecil', title: 'Jurnal kecil' },
    family: { crumb: 'Keluarga', title: 'Keluarga' },
    settings: { crumb: 'Pengaturan', title: 'Pengaturan' }
  };

  const COLORS = ['#E67655', '#2E7D6B', '#D9A441', '#8273AD', '#4E7F98', '#B96478'];

  const CATEGORIES = {
    achievement: { label: 'Pencapaian', icon: 'star', tone: 'star', pill: 'gold' },
    health: { label: 'Kesehatan', icon: 'heart', tone: 'heart', pill: 'coral' },
    activity: { label: 'Aktivitas', icon: 'sun', tone: 'sun', pill: 'green' },
    food: { label: 'Makan', icon: 'utensils', tone: 'utensils', pill: 'gold' },
    sleep: { label: 'Tidur', icon: 'moon', tone: 'moon', pill: 'lilac' },
    note: { label: 'Catatan', icon: 'file', tone: 'file', pill: 'blue' }
  };

  const DOMAINS = {
    gross: { label: 'Motorik kasar', icon: 'activity', color: '#B94E32', tint: '#FBE8DF' },
    fine: { label: 'Motorik halus', icon: 'sparkles', color: '#926915', tint: '#FBF0D4' },
    language: { label: 'Bahasa', icon: 'message', color: '#174E42', tint: '#E2EEE7' },
    social: { label: 'Sosial & emosional', icon: 'heart', color: '#65558F', tint: '#EEE9F7' },
    cognitive: { label: 'Kognitif', icon: 'head', color: '#38677E', tint: '#E5F0F4' }
  };
  const DOMAIN_KEYS = Object.keys(DOMAINS);

  const AGE_BANDS = [
    { id: '0-3', label: '0–3 bulan', min: 0, max: 3 },
    { id: '3-6', label: '3–6 bulan', min: 3, max: 6 },
    { id: '6-9', label: '6–9 bulan', min: 6, max: 9 },
    { id: '9-12', label: '9–12 bulan', min: 9, max: 12 },
    { id: '12-18', label: '12–18 bulan', min: 12, max: 18 },
    { id: '18-24', label: '18–24 bulan', min: 18, max: 24 },
    { id: '24-36', label: '2–3 tahun', min: 24, max: 36 },
    { id: '36-48', label: '3–4 tahun', min: 36, max: 48 },
    { id: '48-60', label: '4–5 tahun', min: 48, max: 60 },
    { id: '60-72', label: '5–6 tahun', min: 60, max: 999 }
  ];

  const MILESTONES = [
    // 0–3 bulan
    { id: '0-3-gross', band: '0-3', domain: 'gross', title: 'Mengangkat kepala saat tengkurap', tip: 'Sediakan waktu tengkurap singkat 2–3 kali sehari, selalu dalam pengawasan.' },
    { id: '0-3-fine', band: '0-3', domain: 'fine', title: 'Menggenggam jari yang menyentuh telapak tangan', tip: 'Sentuh telapak tangannya dengan jari Anda dan beri waktu untuk menggenggam.' },
    { id: '0-3-language', band: '0-3', domain: 'language', title: 'Menangis dengan nada berbeda untuk tiap kebutuhan', tip: 'Respons cepat dan lembut membantunya merasa aman.' },
    { id: '0-3-social', band: '0-3', domain: 'social', title: 'Tenang saat mendengar suara orang terdekat', tip: 'Ajak bicara dengan suara hangat dan tatap matanya.' },
    { id: '0-3-cognitive', band: '0-3', domain: 'cognitive', title: 'Mengikuti wajah atau benda dengan mata', tip: 'Gerakkan mainan kontras perlahan di depan wajahnya.' },

    // 3–6 bulan
    { id: '3-6-gross', band: '3-6', domain: 'gross', title: 'Berguling dari tengkurap ke telentang', tip: 'Letakkan mainan di samping saat ia tengkurap untuk memancing gerakan.' },
    { id: '3-6-fine', band: '3-6', domain: 'fine', title: 'Meraih dan memegang mainan dengan sengaja', tip: 'Gunakan mainan ringan bertekstur yang aman.' },
    { id: '3-6-language', band: '3-6', domain: 'language', title: 'Mengoceh dan menirukan suara', tip: 'Tirukan ocehannya, lalu beri jeda seperti bercakap-cakap.' },
    { id: '3-6-social', band: '3-6', domain: 'social', title: 'Tersenyum sebagai respons pada wajah', tip: 'Balas senyumnya dengan ekspresi wajah yang hidup.' },
    { id: '3-6-cognitive', band: '3-6', domain: 'cognitive', title: 'Mengamati benda dan mencari sumber suara', tip: 'Bunyikan loceng lembut dari sisi kanan dan kiri.' },

    // 6–9 bulan
    { id: '6-9-gross', band: '6-9', domain: 'gross', title: 'Duduk tegak dengan sedikit bantuan', tip: 'Beri bantal empuk di sekeliling saat latihan duduk.' },
    { id: '6-9-fine', band: '6-9', domain: 'fine', title: 'Memindahkan benda dari satu tangan ke tangan lain', tip: 'Tawarkan balok kecil yang aman untuk dipindahkan.' },
    { id: '6-9-language', band: '6-9', domain: 'language', title: 'Merespons saat namanya dipanggil', tip: 'Panggil namanya dari arah berbeda, lalu puji saat ia menoleh.' },
    { id: '6-9-social', band: '6-9', domain: 'social', title: 'Menunjukkan minat pada cermin dan wajah', tip: 'Bermain cermin sambil menyebut bagian wajah.' },
    { id: '6-9-cognitive', band: '6-9', domain: 'cognitive', title: 'Mencari benda yang jatuh', tip: 'Jatuhkan mainan ringan dan biarkan ia mencari.' },

    // 9–12 bulan
    { id: '9-12-gross', band: '9-12', domain: 'gross', title: 'Merangkak atau menarik badan untuk berdiri', tip: 'Letakkan mainan favorit sedikit di luar jangkauan.' },
    { id: '9-12-fine', band: '9-12', domain: 'fine', title: 'Menjepit benda kecil dengan ibu jari dan telunjuk', tip: 'Beri camilan aman berukuran sesuai untuk latihan menjepit.' },
    { id: '9-12-language', band: '9-12', domain: 'language', title: "Mengucapkan suku kata berulang seperti 'ma-ma'", tip: 'Tanggapi setiap ocehan seolah percakapan sungguhan.' },
    { id: '9-12-social', band: '9-12', domain: 'social', title: 'Melambai atau mengulurkan tangan untuk meminta', tip: 'Contohkan lambaian saat berpamitan.' },
    { id: '9-12-cognitive', band: '9-12', domain: 'cognitive', title: 'Memasukkan benda ke dalam wadah', tip: 'Sediakan ember dan balok; tunjukkan cara memasukkannya.' },

    // 12–18 bulan
    { id: '12-18-gross', band: '12-18', domain: 'gross', title: 'Berjalan sendiri atau dengan bantuan ringan', tip: 'Beri ruang aman dan biarkan ia mencoba tanpa buru-buru.' },
    { id: '12-18-fine', band: '12-18', domain: 'fine', title: 'Menyusun dua balok atau mencoret dengan krayon', tip: 'Sediakan krayon besar dan kertas lebar.' },
    { id: '12-18-language', band: '12-18', domain: 'language', title: 'Mengucapkan 3–6 kata bermakna', tip: 'Sebut nama benda yang ia tunjuk, perlahan dan jelas.' },
    { id: '12-18-social', band: '12-18', domain: 'social', title: 'Meniru aktivitas orang dewasa', tip: "Ajak ia 'membantu' pekerjaan rumah sederhana." },
    { id: '12-18-cognitive', band: '12-18', domain: 'cognitive', title: 'Menunjuk benda yang diinginkan', tip: 'Tunggu sebentar dan beri kesempatan menunjuk sebelum dibantu.' },

    // 18–24 bulan
    { id: '18-24-gross', band: '18-24', domain: 'gross', title: 'Berlari atau naik tangga dengan bantuan', tip: 'Bermain kejar-kejaran di area yang aman.' },
    { id: '18-24-fine', band: '18-24', domain: 'fine', title: 'Menyusun empat balok atau memasukkan bentuk', tip: 'Gunakan mainan bentuk sederhana dan pujilah usahanya.' },
    { id: '18-24-language', band: '18-24', domain: 'language', title: "Menggabungkan dua kata, misal 'mau susu'", tip: 'Ulangi ucapannya dengan kalimat pendek yang lengkap.' },
    { id: '18-24-social', band: '18-24', domain: 'social', title: 'Mulai bermain di samping anak lain', tip: 'Ajak bermain berdampingan, belum perlu berbagi sempurna.' },
    { id: '18-24-cognitive', band: '18-24', domain: 'cognitive', title: 'Mengenali beberapa bagian tubuh', tip: 'Sebut dan sentuh hidung, mata, telinga sambil bernyanyi.' },

    // 24–36 bulan
    { id: '24-36-gross', band: '24-36', domain: 'gross', title: 'Melompat dengan dua kaki', tip: 'Bermain lompat dari garis ke garis di lantai empuk.' },
    { id: '24-36-fine', band: '24-36', domain: 'fine', title: 'Menggambar garis dan memegang krayon stabil', tip: "Biarkan ia mencoret bebas tanpa harus 'benar'." },
    { id: '24-36-language', band: '24-36', domain: 'language', title: 'Menggunakan kalimat tiga kata', tip: "Perluas ucapannya: 'Mobil besar itu cepat!'" },
    { id: '24-36-social', band: '24-36', domain: 'social', title: 'Mulai bermain bergiliran', tip: 'Mainkan permainan sederhana dengan giliran pendek.' },
    { id: '24-36-cognitive', band: '24-36', domain: 'cognitive', title: 'Membedakan banyak–sedikit dan warna dasar', tip: 'Libatkan ia saat merapikan mainan sambil menghitung.' },

    // 36–48 bulan
    { id: '36-48-gross', band: '36-48', domain: 'gross', title: 'Berdiri satu kaki sebentar atau naik sepeda roda tiga', tip: 'Latihan keseimbangan sambil bernyanyi dan menghitung.' },
    { id: '36-48-fine', band: '36-48', domain: 'fine', title: 'Menggunting sederhana dengan pengawasan', tip: 'Gunakan gunting anak dan kertas bekas.' },
    { id: '36-48-language', band: '36-48', domain: 'language', title: "Bercerita pendek dan sering bertanya 'kenapa'", tip: 'Jawab pertanyaannya dengan cerita singkat yang menyenangkan.' },
    { id: '36-48-social', band: '36-48', domain: 'social', title: 'Bermain peran bersama teman', tip: 'Sediakan kostum sederhana dan biarkan ceritanya mengalir.' },
    { id: '36-48-cognitive', band: '36-48', domain: 'cognitive', title: 'Mengenal urutan angka dan pola sederhana', tip: 'Buat pola warna dengan balok, lalu minta ia melanjutkan.' },

    // 48–60 bulan
    { id: '48-60-gross', band: '48-60', domain: 'gross', title: 'Melompat, menangkap bola, dan bergerak lincah', tip: 'Lempar-tangkap bola besar di halaman.' },
    { id: '48-60-fine', band: '48-60', domain: 'fine', title: 'Menulis sebagian huruf atau menggambar orang', tip: 'Sediakan alat tulis beragam dan apresiasi karyanya.' },
    { id: '48-60-language', band: '48-60', domain: 'language', title: 'Bicara jelas dan bercerita runtut', tip: 'Dengarkan tanpa terburu-buru, lalu ajukan pertanyaan terbuka.' },
    { id: '48-60-social', band: '48-60', domain: 'social', title: 'Mengikuti aturan permainan sederhana', tip: 'Mainkan permainan papan sederhana dan bahas aturannya.' },
    { id: '48-60-cognitive', band: '48-60', domain: 'cognitive', title: 'Memahami konsep waktu dasar', tip: "Gunakan rutinitas 'pagi, siang, malam' dengan gambar." },

    // 60–72 bulan
    { id: '60-72-gross', band: '60-72', domain: 'gross', title: 'Bersepeda atau berkoordinasi dalam olahraga', tip: 'Beri kesempatan mencoba berbagai gerakan baru.' },
    { id: '60-72-fine', band: '60-72', domain: 'fine', title: 'Menggambar detail atau menulis namanya', tip: 'Sediakan buku tulis dan biarkan ia berlatih tanpa tekanan.' },
    { id: '60-72-language', band: '60-72', domain: 'language', title: 'Menggunakan kalimat kompleks', tip: 'Ajak berdiskusi tentang hal yang ia sukai.' },
    { id: '60-72-social', band: '60-72', domain: 'social', title: 'Menyelesaikan konflik dengan kata-kata', tip: 'Bantu ia menamai perasaan dan mencari jalan tengah.' },
    { id: '60-72-cognitive', band: '60-72', domain: 'cognitive', title: 'Mengenal huruf, angka, dan simbol', tip: 'Bermain tebak huruf dari nama benda di sekitar.' }
  ];

  const VACCINES = [
    { id: 'hb0', name: 'Hepatitis B-0', protects: 'Infeksi hepatitis B', ageMonths: 0, ageLabel: '0–24 jam', group: 'Saat lahir', note: 'Diberikan dalam 24 jam pertama setelah lahir.' },
    { id: 'polio0', name: 'Polio 0', protects: 'Virus polio', ageMonths: 0, ageLabel: '0–1 bulan', group: 'Saat lahir' },
    { id: 'bcg', name: 'BCG', protects: 'Tuberkulosis (TBC) berat', ageMonths: 1, ageLabel: '1 bulan', group: '1 bulan' },
    { id: 'polio1', name: 'Polio 1', protects: 'Virus polio', ageMonths: 2, ageLabel: '2 bulan', group: '2 bulan' },
    { id: 'dpt1', name: 'DPT-HB-Hib 1', protects: 'Difteri, tetanus, pertusis, hepatitis B, dan Hib', ageMonths: 2, ageLabel: '2 bulan', group: '2 bulan' },
    { id: 'pcv1', name: 'PCV 1', protects: 'Pneumokokus penyebab pneumonia', ageMonths: 2, ageLabel: '2 bulan', group: '2 bulan' },
    { id: 'rota1', name: 'Rotavirus 1', protects: 'Diare berat akibat rotavirus', ageMonths: 2, ageLabel: '2 bulan', group: '2 bulan' },
    { id: 'polio2', name: 'Polio 2', protects: 'Virus polio', ageMonths: 3, ageLabel: '3 bulan', group: '3 bulan' },
    { id: 'dpt2', name: 'DPT-HB-Hib 2', protects: 'Difteri, tetanus, pertusis, hepatitis B, dan Hib', ageMonths: 3, ageLabel: '3 bulan', group: '3 bulan' },
    { id: 'polio3', name: 'Polio 3', protects: 'Virus polio', ageMonths: 4, ageLabel: '4 bulan', group: '4 bulan' },
    { id: 'dpt3', name: 'DPT-HB-Hib 3', protects: 'Difteri, tetanus, pertusis, hepatitis B, dan Hib', ageMonths: 4, ageLabel: '4 bulan', group: '4 bulan' },
    { id: 'ipv1', name: 'IPV 1', protects: 'Virus polio', ageMonths: 4, ageLabel: '4 bulan', group: '4 bulan' },
    { id: 'pcv2', name: 'PCV 2', protects: 'Pneumokokus penyebab pneumonia', ageMonths: 4, ageLabel: '4 bulan', group: '4 bulan' },
    { id: 'rota2', name: 'Rotavirus 2', protects: 'Diare berat akibat rotavirus', ageMonths: 4, ageLabel: '4 bulan', group: '4 bulan' },
    { id: 'pcv3', name: 'PCV 3', protects: 'Pneumokokus penyebab pneumonia', ageMonths: 6, ageLabel: '6 bulan', group: '6 bulan' },
    { id: 'rota3', name: 'Rotavirus 3', protects: 'Diare berat akibat rotavirus', ageMonths: 6, ageLabel: '6 bulan', group: '6 bulan' },
    { id: 'mr1', name: 'MR 1', protects: 'Campak dan rubela', ageMonths: 9, ageLabel: '9 bulan', group: '9 bulan' },
    { id: 'ipv2', name: 'IPV 2', protects: 'Virus polio', ageMonths: 9, ageLabel: '9 bulan', group: '9 bulan' },
    { id: 'je', name: 'JE', protects: 'Japanese encephalitis', ageMonths: 9, ageLabel: '9 bulan', group: '9 bulan', optional: true, note: 'Di daerah endemis, sesuai anjuran dokter.' },
    { id: 'dptBooster', name: 'DPT-HB-Hib booster', protects: 'Difteri, tetanus, pertusis, hepatitis B, dan Hib', ageMonths: 18, ageLabel: '18 bulan', group: '18 bulan' },
    { id: 'mr2', name: 'MR 2', protects: 'Campak dan rubela', ageMonths: 18, ageLabel: '18 bulan', group: '18 bulan' },
    { id: 'polio4', name: 'Polio 4', protects: 'Virus polio', ageMonths: 18, ageLabel: '18 bulan', group: '18 bulan' }
  ];

  const METRICS = {
    weight: { key: 'weight', label: 'Berat badan', short: 'Berat', unit: 'kg', icon: 'scale', color: '#E67655', tint: '#FBE8DF', decimals: 1 },
    height: { key: 'height', label: 'Tinggi badan', short: 'Tinggi', unit: 'cm', icon: 'ruler', color: '#174E42', tint: '#E2EEE7', decimals: 1 },
    head: { key: 'head', label: 'Lingkar kepala', short: 'Lingkar kepala', unit: 'cm', icon: 'head', color: '#8273AD', tint: '#EEE9F7', decimals: 1 }
  };

  /* =========================================================
     State & penyimpanan
     ========================================================= */

  function defaultState() {
    return {
      version: 1,
      children: [],
      measurements: [],
      milestones: {},
      immunizations: {},
      journal: [],
      activeChildId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return normalizeState(JSON.parse(raw));
    } catch (err) {
      console.warn('Tidak dapat membaca data tersimpan.', err);
      return defaultState();
    }
  }

  function normalizeState(raw) {
    const next = defaultState();
    if (!raw || typeof raw !== 'object') return next;

    const childIds = new Set();
    const children = (Array.isArray(raw.children) ? raw.children : [])
      .filter((c) => c && typeof c === 'object' && c.name && isValidISODate(String(c.birthDate || '').slice(0, 10)) && String(c.birthDate).slice(0, 10) <= todayISO())
      .map((c, index) => {
        const id = String(c.id || `child-${index + 1}`);
        childIds.add(id);
        return {
          id,
          name: String(c.name).slice(0, 40),
          sex: c.sex === 'P' ? 'P' : 'L',
          birthDate: String(c.birthDate).slice(0, 10),
          color: COLORS.includes(c.color) ? c.color : COLORS[index % COLORS.length],
          createdAt: c.createdAt || new Date().toISOString()
        };
      });
    next.children = children;

    next.measurements = (Array.isArray(raw.measurements) ? raw.measurements : [])
      .filter((m) => m && childIds.has(String(m.childId)) && isValidISODate(String(m.date || '').slice(0, 10)))
      .map((m, index) => ({
        id: String(m.id || `measurement-${index + 1}`),
        childId: String(m.childId),
        date: String(m.date).slice(0, 10),
        weight: toNullableNumber(m.weight),
        height: toNullableNumber(m.height),
        head: toNullableNumber(m.head),
        note: String(m.note || '').slice(0, 500),
        createdAt: m.createdAt || new Date().toISOString()
      }));

    const sourceMilestones = raw.milestones && typeof raw.milestones === 'object' ? raw.milestones : {};
    Object.keys(sourceMilestones).forEach((childId) => {
      if (!childIds.has(childId) || !sourceMilestones[childId] || typeof sourceMilestones[childId] !== 'object') return;
      next.milestones[childId] = {};
      Object.entries(sourceMilestones[childId]).forEach(([key, value]) => {
        if (typeof value === 'string' && isValidISODate(value)) next.milestones[childId][key] = value;
        else if (value && value.done && isValidISODate(String(value.date || ''))) next.milestones[childId][key] = String(value.date);
      });
    });

    const sourceImmunizations = raw.immunizations && typeof raw.immunizations === 'object' ? raw.immunizations : {};
    Object.keys(sourceImmunizations).forEach((childId) => {
      if (!childIds.has(childId) || !sourceImmunizations[childId] || typeof sourceImmunizations[childId] !== 'object') return;
      next.immunizations[childId] = {};
      Object.entries(sourceImmunizations[childId]).forEach(([key, value]) => {
        if (!value) return;
        if (typeof value === 'string' && isValidISODate(value)) {
          next.immunizations[childId][key] = { date: value, note: '' };
        } else if (typeof value === 'object' && isValidISODate(String(value.date || ''))) {
          next.immunizations[childId][key] = { date: String(value.date), note: String(value.note || '').slice(0, 300) };
        }
      });
    });

    next.journal = (Array.isArray(raw.journal) ? raw.journal : [])
      .filter((j) => j && childIds.has(String(j.childId)) && isValidISODate(String(j.date || '').slice(0, 10)))
      .map((j, index) => ({
        id: String(j.id || `journal-${index + 1}`),
        childId: String(j.childId),
        date: String(j.date).slice(0, 10),
        category: CATEGORIES[j.category] ? j.category : 'note',
        title: String(j.title || '').slice(0, 100),
        note: String(j.note || '').slice(0, 2000),
        createdAt: j.createdAt || new Date().toISOString()
      }));

    next.activeChildId = childIds.has(String(raw.activeChildId)) ? String(raw.activeChildId) : (children[0] ? children[0].id : null);
    next.createdAt = raw.createdAt || next.createdAt;
    next.updatedAt = raw.updatedAt || next.updatedAt;
    return next;
  }

  let state = loadState();

  function saveState({ fromCloud = false } = {}) {
    if (READ_ONLY_MODE) return;
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Penyimpanan browser penuh atau tidak tersedia.', err);
      toast('Data tidak dapat disimpan di perangkat ini.', 'error');
    }
    if (!fromCloud && !CLOUD.suppressDirty) markCloudLocalChange();
  }

  const ui = {
    view: 'dashboard',
    metric: 'weight',
    profileOpen: false,
    milestoneMode: 'focus',
    immFilter: 'all',
    journalFilter: 'all',
    journalQuery: '',
    cloudAuthMode: 'login'
  };

  const CLOUD_META_KEY = 'tumbuh-cloud-meta-v1';
  const SHARE_TOKEN = getShareTokenFromLocation();
  const READ_ONLY_MODE = Boolean(SHARE_TOKEN);

  let SHARE_LOADING = READ_ONLY_MODE;
  let SHARE_ERROR = '';
  let SHARE_UPDATED_AT = null;
  let SHARE_REFRESH_TIMER = null;

  const CLOUD = {
    initialized: false,
    authenticated: false,
    status: READ_ONLY_MODE ? 'share' : (location.protocol.startsWith('http') ? 'loading' : 'local'),
    error: '',
    authMessage: '',
    conflict: null,
    lastSyncAt: null,
    pending: false,
    suppressDirty: false,
    syncing: false,
    syncTimer: null,
    pollTimer: null,
    share: null,
    shareBusy: false
  };

  /* =========================================================
     Utilitas umum
     ========================================================= */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function ic(name, cls = '') {
    return `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  function uid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function isoOf(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function todayISO() { return isoOf(new Date()); }

  function parseISO(value) {
    if (!isValidISODate(value)) return null;
    return new Date(`${value}T00:00:00`);
  }

  function isValidISODate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
    const d = new Date(`${value}T00:00:00`);
    return !Number.isNaN(d.getTime()) && isoOf(d) === value;
  }

  function addMonthsISO(iso, months) {
    const d = parseISO(iso);
    if (!d) return iso;
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
    return isoOf(d);
  }

  function daysAgoISO(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return isoOf(d);
  }

  function ageOn(birthISO, refISO = todayISO()) {
    const birth = parseISO(birthISO);
    const ref = parseISO(refISO);
    if (!birth || !ref) return { years: 0, months: 0, days: 0, totalMonths: 0, totalDays: 0 };
    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalMonths = Math.max(0, years * 12 + months);
    const totalDays = Math.max(0, Math.floor((ref - birth) / 86400000));
    return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days), totalMonths, totalDays };
  }

  function formatAge(birthISO, refISO = todayISO()) {
    const age = ageOn(birthISO, refISO);
    if (age.years > 0) return `${age.years} tahun${age.months ? ` ${age.months} bulan` : ''}`;
    if (age.months > 0) return `${age.months} bulan${age.days ? ` ${age.days} hari` : ''}`;
    if (age.totalDays === 0) return 'Baru lahir';
    return `${age.totalDays} hari`;
  }

  function formatAgeCompact(birthISO) {
    const age = ageOn(birthISO);
    if (age.years > 0) return `${age.years} thn ${age.months} bln`;
    return `${age.months} bln ${age.days} hr`;
  }

  function formatDate(iso, opts = {}) {
    const d = parseISO(iso);
    if (!d) return '—';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...opts
    });
  }

  function formatDateLong(iso) {
    const d = parseISO(iso);
    if (!d) return '—';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatMonth(iso) {
    const d = parseISO(iso);
    return d ? d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '—';
  }

  function formatNumber(value, decimals = 1) {
    if (value == null || value === '' || Number.isNaN(Number(value))) return '—';
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(Number(value));
  }

  function formatDelta(value, unit, decimals = 1) {
    if (value == null || Number.isNaN(Number(value))) return '';
    const num = Number(value);
    const sign = num > 0 ? '+' : '';
    return `${sign}${formatNumber(num, decimals)} ${unit}`;
  }

  function toNullableNumber(value) {
    if (value === '' || value == null) return null;
    const num = Number(String(value).replace(',', '.'));
    return Number.isFinite(num) ? num : null;
  }

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

  function initials(name) {
    const parts = String(name || 'Anak').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'A';
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase();
  }

  function activeChild() {
    return state.children.find((c) => c.id === state.activeChildId) || state.children[0] || null;
  }

  function getChild(id) { return state.children.find((c) => c.id === id) || null; }

  function measurementsFor(childId, direction = 'asc') {
    const list = state.measurements
      .filter((m) => m.childId === childId)
      .slice()
      .sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.createdAt).localeCompare(String(b.createdAt)));
    return direction === 'desc' ? list.reverse() : list;
  }

  function latestMeasurement(childId) {
    return measurementsFor(childId, 'desc')[0] || null;
  }

  function journalFor(childId, direction = 'desc') {
    const list = state.journal
      .filter((j) => j.childId === childId)
      .slice()
      .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.createdAt).localeCompare(String(a.createdAt)));
    return direction === 'asc' ? list.reverse() : list;
  }

  function currentBandForAge(totalMonths) {
    return AGE_BANDS.find((band) => totalMonths >= band.min && totalMonths < band.max) || AGE_BANDS[AGE_BANDS.length - 1];
  }

  function currentBand(child) {
    return currentBandForAge(ageOn(child.birthDate).totalMonths);
  }

  function milestoneDate(childId, milestoneId) {
    return state.milestones[childId] ? state.milestones[childId][milestoneId] : null;
  }

  function bandMilestones(bandId) {
    return MILESTONES.filter((m) => m.band === bandId);
  }

  function bandProgress(child, bandId) {
    const items = bandMilestones(bandId);
    const done = items.filter((m) => Boolean(milestoneDate(child.id, m.id))).length;
    return { done, total: items.length, percent: items.length ? Math.round((done / items.length) * 100) : 0 };
  }

  function vaccineRecord(childId, vaccineId) {
    return state.immunizations[childId] ? state.immunizations[childId][vaccineId] : null;
  }

  function vaccineStatus(child, vaccine) {
    const record = vaccineRecord(child.id, vaccine.id);
    if (record) return 'done';
    return ageOn(child.birthDate).totalMonths >= vaccine.ageMonths ? 'missed' : 'upcoming';
  }

  function vaccineCounts(child) {
    const mandatory = VACCINES.filter((v) => !v.optional);
    return {
      done: VACCINES.filter((v) => vaccineStatus(child, v) === 'done').length,
      completed: mandatory.filter((v) => vaccineStatus(child, v) === 'done').length,
      total: mandatory.length,
      missed: mandatory.filter((v) => vaccineStatus(child, v) === 'missed').length,
      upcoming: mandatory.filter((v) => vaccineStatus(child, v) === 'upcoming').length
    };
  }

  function nextVaccine(child) {
    const pending = VACCINES
      .filter((v) => vaccineStatus(child, v) !== 'done')
      .sort((a, b) => Number(Boolean(a.optional)) - Number(Boolean(b.optional)) || a.ageMonths - b.ageMonths);
    return pending[0] || null;
  }

  function deltaFromPrevious(childId, key) {
    const points = measurementsFor(childId, 'asc').filter((m) => m[key] != null);
    if (points.length < 2) return null;
    const latest = points[points.length - 1];
    const previous = points[points.length - 2];
    return { diff: Number(latest[key]) - Number(previous[key]), from: previous.date, latest };
  }

  /* =========================================================
     Toast, modal, konfirmasi
     ========================================================= */

  function toast(message, type = 'success') {
    const root = $('#toastRoot');
    if (!root) return;
    const el = document.createElement('div');
    el.className = `toast${type === 'error' ? ' error' : ''}`;
    el.innerHTML = `${ic(type === 'error' ? 'info' : 'check')}<span>${esc(message)}</span>`;
    root.appendChild(el);
    window.setTimeout(() => {
      el.classList.add('out');
      window.setTimeout(() => el.remove(), 220);
    }, 3300);
  }

  let modalResolve = null;
  let lastFocused = null;

  function handleFormSubmit(event) {
    const form = event.target;
    if (!form) return;
    const formId = form.getAttribute ? form.getAttribute('id') : '';
    if (!formId) return;
    event.preventDefault();
    event.stopPropagation();
    if (formId === 'childForm') handleChildSubmit(form);
    else if (formId === 'measurementForm') handleMeasurementSubmit(form);
    else if (formId === 'journalForm') handleJournalSubmit(form);
    else if (formId === 'vaccineForm') handleVaccineSubmit(form);
    else if (formId === 'cloudLoginForm') handleCloudLogin(form);
  }

  function openModal({ kicker = '', title, subtitle = '', body = '', footer = '', size = '' }) {
    closeModal({ restoreFocus: false, silent: true });
    lastFocused = document.activeElement;
    const root = $('#modalRoot');
    root.innerHTML = `
      <div class="modal-layer" data-modal-overlay>
        <section class="modal-panel ${size}" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="modal-head">
            ${kicker ? `<p class="modal-kicker">${esc(kicker)}</p>` : ''}
            <h2 id="modalTitle">${esc(title)}</h2>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
            <button class="icon-btn modal-close" type="button" data-action="closeModal" aria-label="Tutup">${ic('x')}</button>
          </div>
          <div class="modal-body">${body}</div>
          <div class="modal-foot">${footer}</div>
        </section>
      </div>`;
    document.body.classList.add('modal-open');
    const panel = root.querySelector('.modal-panel');
    $$('form', panel).forEach((form) => form.addEventListener('submit', handleFormSubmit));
    window.requestAnimationFrame(() => {
      const focusable = panel.querySelector('input:not([type="hidden"]):not([disabled]), select, textarea, button');
      if (focusable) focusable.focus({ preventScroll: true });
    });
    return panel;
  }

  function closeModal({ restoreFocus = true, silent = false } = {}) {
    const resolve = modalResolve;
    modalResolve = null;
    const root = $('#modalRoot');
    if (root) root.innerHTML = '';
    document.body.classList.remove('modal-open');
    if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus({ preventScroll: true }); } catch (err) { /* noop */ }
    }
    if (resolve && !silent) resolve(false);
  }

  function askConfirm({ title, message, confirmText = 'Lanjutkan', cancelText = 'Batal', danger = false }) {
    return new Promise((resolve) => {
      openModal({
        kicker: 'Konfirmasi',
        title,
        body: `<p class="confirm-copy">${message}</p>`,
        footer: `
          <button class="btn btn-ghost" type="button" data-action="closeModal">${esc(cancelText)}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" type="button" data-action="confirmAction">${esc(confirmText)}</button>`
      });
      modalResolve = resolve;
    });
  }

  function resolveConfirm() {
    const resolve = modalResolve;
    modalResolve = null;
    closeModal({ restoreFocus: false, silent: true });
    if (resolve) resolve(true);
  }

  function clearFormErrors(form) {
    $$('.form-error', form).forEach((el) => el.remove());
    $$('[aria-invalid="true"]', form).forEach((el) => el.removeAttribute('aria-invalid'));
  }

  function showFieldError(form, name, message) {
    const control = form.querySelector(`[name="${name}"]`);
    if (!control) return;
    const wrapper = control.closest('.form-field') || control.closest('.form-grid') || form;
    let error = wrapper.querySelector('.form-error');
    if (!error) {
      error = document.createElement('p');
      error.className = 'form-error';
      wrapper.appendChild(error);
    }
    error.textContent = message;
    if (control.type !== 'radio') {
      const alreadyInvalid = Boolean(form.querySelector('[aria-invalid="true"]'));
      control.setAttribute('aria-invalid', 'true');
      if (!alreadyInvalid) control.focus({ preventScroll: false });
    }
  }

  function validateDateField(form, name, { min = null, max = todayISO() } = {}) {
    const value = String(new FormData(form).get(name) || '');
    if (!value) {
      showFieldError(form, name, 'Tanggal wajib diisi.');
      return false;
    }
    if (!isValidISODate(value)) {
      showFieldError(form, name, 'Format tanggal belum tepat.');
      return false;
    }
    if (min && value < min) {
      showFieldError(form, name, `Tanggal tidak boleh sebelum ${formatDate(min)}.`);
      return false;
    }
    if (max && value > max) {
      showFieldError(form, name, 'Tanggal tidak boleh di masa depan.');
      return false;
    }
    return true;
  }

  /* =========================================================
     Data contoh
     ========================================================= */

  function createDemoState() {
    const today = todayISO();
    const birth = addMonthsISO(today, -28);
    const childId = 'demo-raka';
    const child = { id: childId, name: 'Raka Pratama', sex: 'L', birthDate: birth, color: '#E67655', createdAt: new Date().toISOString() };

    const measurementPlan = [
      { offset: 0, weight: 3.2, height: 50, head: 34, note: 'Hari pertama di rumah.' },
      { offset: 1, weight: 4.3, height: 54.5, head: 36.5, note: 'Kontrol bulan pertama.' },
      { offset: 3, weight: 6.1, height: 60, head: 39, note: 'Mulai banyak bergerak.' },
      { offset: 5, weight: 7.4, height: 64, head: 41, note: '' },
      { offset: 8, weight: 8.6, height: 68.5, head: 43, note: 'Mulai belajar duduk.' },
      { offset: 12, weight: 10.2, height: 75, head: 45.5, note: 'Mulai MPASI.' },
      { offset: 16, weight: 11.4, height: 81, head: 46.8, note: '' },
      { offset: 20, weight: 12.2, height: 85.5, head: 47.5, note: 'Semakin aktif berlari.' },
      { offset: 24, weight: 12.9, height: 89, head: 48, note: '' },
      { offset: 27.3, weight: 13.2, height: 92.5, head: 48.4, note: 'Pengukuran rutin bulan ini.' }
    ];

    const measurements = measurementPlan.map((plan, index) => {
      let date = addMonthsISO(birth, Math.floor(plan.offset));
      if (plan.offset === 27.3) date = daysAgoISO(4);
      if (date > today) date = today;
      return {
        id: `demo-m-${index + 1}`,
        childId,
        date,
        weight: plan.weight,
        height: plan.height,
        head: plan.head,
        note: plan.note,
        createdAt: `${date}T09:00:00.000Z`
      };
    });

    const currentBandId = currentBandForAge(28).id;
    const currentIndex = AGE_BANDS.findIndex((band) => band.id === currentBandId);
    const milestones = {};
    const completedDomains = new Set(['gross', 'fine', 'language']);
    AGE_BANDS.forEach((band, bandIndex) => {
      bandMilestones(band.id).forEach((m) => {
        if (bandIndex < currentIndex || (bandIndex === currentIndex && completedDomains.has(m.domain))) {
          milestones[m.id] = daysAgoISO(Math.max(2, 40 - bandIndex * 4));
        }
      });
    });

    const immunizations = {};
    VACCINES.forEach((v) => {
      if (v.optional || v.id === 'mr2') return;
      let date = addMonthsISO(birth, v.ageMonths);
      if (v.ageMonths === 0) date = birth;
      if (date > today) return;
      immunizations[v.id] = { date, note: v.id === 'bcg' ? 'Sedikit demam sehari setelahnya, sudah membaik.' : '' };
    });

    const journal = [
      { id: 'demo-j-1', childId, date: daysAgoISO(1), category: 'achievement', title: "Raka bilang 'aku sendiri'", note: 'Hari ini ia menolak dibantu memakai sepatu, lalu berhasil memasangnya sendiri—walau terbalik. Kami pura-pura tidak melihat dan memberi tepuk tangan.', createdAt: `${daysAgoISO(1)}T10:20:00.000Z` },
      { id: 'demo-j-2', childId, date: daysAgoISO(4), category: 'health', title: 'Pengukuran rutin bulan ini', note: 'Berat 13,2 kg dan tinggi 92,5 cm. Ia sempat takut timbangan, jadi kami timbang sambil bernyanyi.', createdAt: `${daysAgoISO(4)}T15:00:00.000Z` },
      { id: 'demo-j-3', childId, date: daysAgoISO(7), category: 'activity', title: 'Lari-lari di taman', note: 'Pertama kali berani menuruni bukit kecil sendiri. Pulang dengan sepatu penuh pasir dan cerita panjang.', createdAt: `${daysAgoISO(7)}T08:30:00.000Z` },
      { id: 'demo-j-4', childId, date: daysAgoISO(10), category: 'food', title: 'Makan malam tanpa drama', note: 'Mencoba brokoli tanpa dipaksa. Katanya, "pohon kecil". Kami simpan piringnya sebagai kenang-kenangan kecil.', createdAt: `${daysAgoISO(10)}T12:10:00.000Z` },
      { id: 'demo-j-5', childId, date: daysAgoISO(13), category: 'sleep', title: 'Tidur malam 9 jam', note: 'Rutin mandi, baca buku, lalu lampu tidur. Bangun sekali untuk minum, setelah itu tidur lagi sampai pagi.', createdAt: `${daysAgoISO(13)}T06:15:00.000Z` }
    ];

    return {
      version: 1,
      children: [child],
      measurements,
      milestones: { [childId]: milestones },
      immunizations: { [childId]: immunizations },
      journal,
      activeChildId: childId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /* =========================================================
     Sinkronisasi & tautan lihat-saja (Netlify Functions)
     ========================================================= */

  const API_ROOT = '/api';

  function getShareTokenFromLocation() {
    try {
      return String(new URLSearchParams(location.search).get('share') || '').trim();
    } catch (err) {
      return '';
    }
  }

  function apiError(message, code = '', status = 0) {
    const error = new Error(message || 'Permintaan gagal.');
    error.code = code;
    error.status = status;
    return error;
  }

  async function apiRequest(path, { method = 'GET', body = null } = {}) {
    if (!location.protocol.startsWith('http')) {
      throw apiError('Sinkronisasi hanya tersedia saat aplikasi dibuka lewat Netlify.', 'local', 0);
    }
    let response;
    try {
      response = await fetch(`${API_ROOT}${path}`, {
        method,
        credentials: 'same-origin',
        cache: 'no-store',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (err) {
      throw apiError('Tidak dapat menghubungi server.', 'network', 0);
    }
    let payload = null;
    const text = await response.text();
    const contentType = response.headers.get('content-type') || '';
    if (text) {
      try { payload = JSON.parse(text); } catch (err) { payload = null; }
    }
    if (response.ok && text && !contentType.toLowerCase().includes('application/json')) {
      throw apiError('Fungsi Netlify tidak mengembalikan data. Pastikan situs dideploy dengan folder netlify/functions.', 'backend_missing', 404);
    }
    if (!response.ok) {
      throw apiError(
        payload && (payload.message || payload.error) ? (payload.message || payload.error) : `Permintaan gagal (${response.status}).`,
        payload && payload.error ? payload.error : 'http_error',
        response.status
      );
    }
    return payload || {};
  }

  function cloudFriendlyError(error) {
    const code = error && error.code ? error.code : '';
    const status = error && error.status ? error.status : 0;
    if (code === 'network') return 'Tidak dapat menghubungi server. Periksa koneksi internet.';
    if (code === 'local') return 'Sinkronisasi aktif setelah aplikasi dibuka lewat Netlify, bukan dari berkas lokal.';
    if (code === 'not_configured') return 'Kata sandi keluarga belum diatur di Netlify.';
    if (code === 'invalid_password') return 'Kata sandi keluarga salah.';
    if (code === 'rate_limited') return 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.';
    if (code === 'unauthorized' || status === 401) return 'Sesi berakhir. Silakan masuk kembali.';
    if (code === 'version_conflict') return 'Data telah berubah di perangkat lain.';
    if (code === 'data_too_large') return 'Data keluarga terlalu besar untuk dikirim.';
    if (code === 'share_disabled') return 'Tautan lihat-saja sedang dinonaktifkan.';
    if (code === 'share_not_found') return 'Tautan tidak berlaku atau sudah diganti.';
    if (code === 'share_empty') return 'Belum ada data keluarga untuk dibagikan.';
    if (code === 'backend_missing' || status === 404) return 'Fungsi Netlify belum tersedia. Pastikan situs dideploy melalui Netlify, bukan Netlify Drop.';
    if (status === 429) return 'Terlalu banyak percobaan. Coba lagi nanti.';
    return error && error.message ? error.message : 'Terjadi kesalahan saat menghubungi server.';
  }

  function readCloudMeta() {
    try {
      const raw = localStorage.getItem(CLOUD_META_KEY);
      const value = raw ? JSON.parse(raw) : {};
      return {
        version: Number.isFinite(Number(value.version)) ? Number(value.version) : 0,
        lastSyncAt: value.lastSyncAt || null,
        pending: Boolean(value.pending)
      };
    } catch (err) {
      return { version: 0, lastSyncAt: null, pending: false };
    }
  }

  function saveCloudMeta(patch) {
    const current = readCloudMeta();
    const next = { ...current, ...patch };
    try { localStorage.setItem(CLOUD_META_KEY, JSON.stringify(next)); } catch (err) { /* noop */ }
  }

  function markCloudLocalChange() {
    if (READ_ONLY_MODE || CLOUD.suppressDirty) return;
    const meta = readCloudMeta();
    if (meta.version > 0) saveCloudMeta({ pending: true });
    if (!CLOUD.authenticated) return;
    CLOUD.pending = true;
    if (CLOUD.status !== 'conflict') CLOUD.status = 'pending';
    updateCloudChip();
    scheduleCloudSync();
  }

  function scheduleCloudSync(delay = 1200) {
    if (READ_ONLY_MODE || !CLOUD.authenticated || CLOUD.conflict || !navigator.onLine) return;
    window.clearTimeout(CLOUD.syncTimer);
    CLOUD.syncTimer = window.setTimeout(() => syncNow({ auto: true }), delay);
  }

  function cloudStatusInfo() {
    if (READ_ONLY_MODE) {
      return {
        key: 'share',
        label: 'Lihat saja',
        short: 'Lihat saja',
        tone: 'readonly',
        title: 'Mode lihat saja.',
        description: 'Tautan ini hanya menampilkan data keluarga. Tidak ada perubahan yang bisa dibuat dari halaman ini.'
      };
    }
    if (CLOUD.status === 'local') {
      return {
        key: 'local',
        label: 'Lokal',
        short: 'Lokal',
        tone: 'local',
        title: 'Data masih tersimpan lokal.',
        description: 'Sinkronisasi keluarga aktif setelah aplikasi dipasang di Netlify dengan Functions dan Blobs. Aplikasi tetap bisa dipakai offline seperti biasa.'
      };
    }
    if (CLOUD.status === 'loading') {
      return {
        key: 'loading',
        label: 'Menghubungkan',
        short: 'Menghubungkan',
        tone: 'syncing',
        title: 'Menghubungkan ke Netlify...',
        description: 'Kami memeriksa sesi dan mengambil data terbaru. Data di perangkat tetap aman.'
      };
    }
    if (CLOUD.status === 'setup') {
      return {
        key: 'setup',
        label: 'Belum diatur',
        short: 'Atur dulu',
        tone: 'pending',
        title: 'Sinkronisasi belum diatur.',
        description: 'Tambahkan TUMBUH_EDIT_PASSWORD dan TUMBUH_SESSION_SECRET di environment variables Netlify, lalu deploy ulang.'
      };
    }
    if (CLOUD.status === 'backend-missing') {
      return {
        key: 'backend-missing',
        label: 'Functions belum aktif',
        short: 'Functions?',
        tone: 'error',
        title: 'Netlify Functions belum tersedia.',
        description: 'Pastikan situs dideploy dari Git atau Netlify CLI sehingga folder netlify/functions ikut terpasang. Netlify Drop hanya mengunggah file statis.'
      };
    }
    if (CLOUD.status === 'signed-out') {
      return {
        key: 'signed-out',
        label: 'Belum masuk',
        short: 'Masuk',
        tone: 'signed-out',
        title: 'Masuk ke akun keluarga.',
        description: 'Satu kata sandi keluarga dipakai untuk semua perangkat yang boleh mengedit. Tautan publik tetap bisa melihat tanpa kata sandi.'
      };
    }
    if (CLOUD.status === 'offline') {
      return {
        key: 'offline',
        label: 'Offline',
        short: 'Offline',
        tone: 'offline',
        title: 'Sedang offline.',
        description: 'Catatan tetap bisa dibuat di perangkat ini. Perubahan akan dikirim otomatis saat koneksi kembali.'
      };
    }
    if (CLOUD.status === 'conflict') {
      return {
        key: 'conflict',
        label: 'Perlu dipilih',
        short: 'Perlu dicek',
        tone: 'conflict',
        title: 'Ada dua versi data.',
        description: 'Data di perangkat ini dan data di Netlify sama-sama berubah. Pilih versi yang ingin dipakai—tidak ada yang diubah sebelum Bunda atau Ayah memilih.'
      };
    }
    if (CLOUD.status === 'error') {
      return {
        key: 'error',
        label: 'Gangguan',
        short: 'Gangguan',
        tone: 'error',
        title: 'Sinkronisasi perlu perhatian.',
        description: CLOUD.error || 'Data tetap tersimpan di perangkat ini.'
      };
    }
    if (CLOUD.status === 'pending') {
      return {
        key: 'pending',
        label: 'Menunggu dikirim',
        short: 'Menunggu',
        tone: 'pending',
        title: 'Perubahan siap dikirim.',
        description: 'Perubahan sudah tersimpan di perangkat ini dan akan dikirim otomatis ke Netlify.'
      };
    }
    if (CLOUD.status === 'syncing') {
      return {
        key: 'syncing',
        label: 'Menyinkronkan',
        short: 'Menyinkronkan',
        tone: 'syncing',
        title: 'Menyinkronkan data keluarga...',
        description: 'Sebentar, kami mengirim catatan terbaru dan memeriksa perubahan dari perangkat lain.'
      };
    }
    return {
      key: 'synced',
      label: 'Tersinkron',
      short: 'Tersinkron',
      tone: 'synced',
      title: 'Data keluarga sudah tersinkron.',
      description: 'Data terbaru tersimpan di Netlify dan siap dibuka dari perangkat lain yang memakai akun keluarga.'
    };
  }

  function updateCloudChip() {
    const chip = $('#syncChip');
    if (!chip) return;
    if (READ_ONLY_MODE) {
      chip.hidden = true;
      return;
    }
    chip.hidden = false;
    const info = cloudStatusInfo();
    chip.className = `sync-chip is-${info.tone}`;
    const label = $('#syncChipText');
    if (label) label.textContent = info.short;
    chip.title = `${info.label} · ${info.title}`;
  }

  function relativeSyncTime(iso) {
    if (!iso) return 'Belum pernah';
    const time = new Date(iso).getTime();
    if (Number.isNaN(time)) return 'Belum pernah';
    const diff = Math.max(0, Date.now() - time);
    if (diff < 45000) return 'Baru saja';
    if (diff < 3600000) return `${Math.round(diff / 60000)} menit lalu`;
    if (diff < 86400000) return `${Math.round(diff / 3600000)} jam lalu`;
    return new Date(time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function hasDemoData(data = state) {
    return Array.isArray(data.children) && data.children.some((child) => child.id === 'demo-raka');
  }

  function isDemoOnlyState(data = state) {
    return hasDemoData(data) && data.children.every((child) => child.id === 'demo-raka');
  }

  function removeDemoData() {
    const demoIds = new Set(state.children.filter((child) => child.id === 'demo-raka').map((child) => child.id));
    if (!demoIds.size) return false;
    state.children = state.children.filter((child) => !demoIds.has(child.id));
    state.measurements = state.measurements.filter((m) => !demoIds.has(m.childId));
    state.journal = state.journal.filter((j) => !demoIds.has(j.childId));
    demoIds.forEach((id) => {
      delete state.milestones[id];
      delete state.immunizations[id];
    });
    if (demoIds.has(state.activeChildId)) state.activeChildId = state.children[0] ? state.children[0].id : null;
    saveState();
    return true;
  }

  function cloudPageSafeToRender() {
    if (document.body.classList.contains('modal-open')) return false;
    const active = document.activeElement;
    if (active && active.closest && active.closest('#mainContent') && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return false;
    return true;
  }

  function refreshCloudUI({ force = false } = {}) {
    updateCloudChip();
    if (ui.view !== 'family') return;
    if (!force && !cloudPageSafeToRender()) return;
    renderApp({ preserveScroll: true, animate: false });
  }

  async function initCloud() {
    if (READ_ONLY_MODE || CLOUD.initialized) return;
    CLOUD.initialized = true;
    if (!location.protocol.startsWith('http')) {
      CLOUD.status = 'local';
      updateCloudChip();
      return;
    }
    CLOUD.status = 'loading';
    updateCloudChip();
    refreshCloudUI({ force: true });
    try {
      const session = await apiRequest('/session');
      if (!session.configured) {
        CLOUD.status = 'setup';
        CLOUD.error = 'Environment variable Netlify belum lengkap.';
        updateCloudChip();
        refreshCloudUI();
        return;
      }
      if (!session.authenticated) {
        CLOUD.status = 'signed-out';
        CLOUD.authenticated = false;
        updateCloudChip();
        refreshCloudUI();
        return;
      }
      CLOUD.authenticated = true;
      await loadCloudData();
      startCloudPolling();
    } catch (error) {
      console.warn('Cloud init gagal:', error);
      CLOUD.authenticated = false;
      if (error.code === 'not_configured') CLOUD.status = 'setup';
      else if (error.code === 'backend_missing' || error.status === 404) CLOUD.status = 'backend-missing';
      else if (!navigator.onLine || error.code === 'network') CLOUD.status = 'offline';
      else CLOUD.status = 'error';
      CLOUD.error = cloudFriendlyError(error);
      updateCloudChip();
      refreshCloudUI({ force: true });
    }
  }

  async function loadCloudData() {
    CLOUD.status = 'loading';
    updateCloudChip();
    refreshCloudUI();
    try {
      const share = await apiRequest('/share').catch(() => null);
      if (share) CLOUD.share = share;
      await syncNow({ auto: true });
      startCloudPolling();
    } catch (error) {
      if (error.status === 401) {
        CLOUD.authenticated = false;
        CLOUD.status = 'signed-out';
        CLOUD.error = '';
      } else {
        CLOUD.status = 'error';
        CLOUD.error = cloudFriendlyError(error);
      }
      updateCloudChip();
      refreshCloudUI({ force: true });
    }
  }

  async function fetchCloudState() {
    const data = await apiRequest('/state');
    return {
      data: data && data.data ? data.data : null,
      version: Number(data && data.version) || 0,
      updatedAt: (data && data.updatedAt) || null
    };
  }

  function cloudHasChildren(data) {
    return Boolean(data && Array.isArray(data.children) && data.children.length);
  }

  function applyRemoteState(remote) {
    CLOUD.suppressDirty = true;
    try {
      state = normalizeState(remote.data || {});
      state.updatedAt = remote.updatedAt || new Date().toISOString();
      saveState({ fromCloud: true });
    } finally {
      CLOUD.suppressDirty = false;
    }
    saveCloudMeta({
      version: remote.version,
      lastSyncAt: remote.updatedAt || new Date().toISOString(),
      pending: false
    });
    CLOUD.pending = false;
    CLOUD.lastSyncAt = remote.updatedAt || new Date().toISOString();
    CLOUD.conflict = null;
    CLOUD.status = 'synced';
    updateCloudChip();
    if (!document.body.classList.contains('modal-open')) {
      renderApp({ preserveScroll: true, animate: false });
    }
  }

  async function pushLocalState(expectedVersion, { auto = false } = {}) {
    const result = await apiRequest('/state', {
      method: 'PUT',
      body: { data: state, baseVersion: expectedVersion }
    });
    const version = Number(result.version) || expectedVersion + 1;
    const updatedAt = result.updatedAt || new Date().toISOString();
    saveCloudMeta({ version, lastSyncAt: updatedAt, pending: false });
    CLOUD.pending = false;
    CLOUD.lastSyncAt = updatedAt;
    CLOUD.conflict = null;
    CLOUD.status = 'synced';
    updateCloudChip();
    if (!auto) toast('Data keluarga berhasil disinkronkan.');
    refreshCloudUI();
    return true;
  }

  async function syncNow({ auto = false } = {}) {
    if (READ_ONLY_MODE || !CLOUD.authenticated) return false;
    if (CLOUD.syncing) return false;
    if (!navigator.onLine) {
      CLOUD.status = 'offline';
      updateCloudChip();
      if (ui.view === 'family' && !auto) refreshCloudUI();
      return false;
    }
    if (auto && document.body.classList.contains('modal-open')) return false;

    CLOUD.syncing = true;
    CLOUD.error = '';
    if (!auto || ui.view === 'family') {
      CLOUD.status = 'syncing';
      updateCloudChip();
      refreshCloudUI();
    }
    try {
      const remote = await fetchCloudState();
      const meta = readCloudMeta();
      const remoteHasData = cloudHasChildren(remote.data);
      const localHasData = state.children.length > 0;

      if (!meta.version) {
        if (remoteHasData && localHasData) {
          if (isDemoOnlyState()) {
            applyRemoteState(remote);
            if (!auto) toast('Data keluarga dimuat. Data contoh tidak diunggah.');
            return true;
          }
          CLOUD.conflict = {
            remote,
            initial: true,
            localChildren: state.children.length,
            remoteChildren: remote.data.children.length
          };
          CLOUD.status = 'conflict';
          updateCloudChip();
          refreshCloudUI({ force: true });
          return false;
        }
        if (remoteHasData && !localHasData) {
          applyRemoteState(remote);
          if (!auto) toast('Data keluarga berhasil dimuat.');
          return true;
        }
        if (hasDemoData()) removeDemoData();
        await pushLocalState(remote.version, { auto });
        return true;
      }

      if (remote.version === meta.version) {
        if (meta.pending) {
          await pushLocalState(remote.version, { auto });
        } else {
          CLOUD.pending = false;
          CLOUD.lastSyncAt = remote.updatedAt;
          saveCloudMeta({ lastSyncAt: remote.updatedAt });
          CLOUD.status = 'synced';
          updateCloudChip();
          if (ui.view === 'family' && !auto) refreshCloudUI({ force: true });
        }
        return true;
      }

      if (remote.version > meta.version) {
        if (meta.pending) {
          CLOUD.conflict = {
            remote,
            initial: false,
            localChildren: state.children.length,
            remoteChildren: remoteHasData ? remote.data.children.length : 0
          };
          CLOUD.status = 'conflict';
          updateCloudChip();
          refreshCloudUI({ force: true });
          return false;
        }
        applyRemoteState(remote);
        if (!auto) toast('Data terbaru dari Netlify dimuat.');
        return true;
      }

      CLOUD.conflict = {
        remote,
        initial: true,
        localChildren: state.children.length,
        remoteChildren: remoteHasData ? remote.data.children.length : 0
      };
      CLOUD.status = 'conflict';
      updateCloudChip();
      refreshCloudUI({ force: true });
      return false;
    } catch (error) {
      console.warn('Sinkronisasi gagal:', error);
      if (error.status === 401) {
        CLOUD.authenticated = false;
        CLOUD.status = 'signed-out';
        CLOUD.error = 'Sesi berakhir. Silakan masuk kembali.';
        CLOUD.pending = false;
      } else if (error.code === 'version_conflict') {
        try {
          const latest = await fetchCloudState();
          CLOUD.conflict = {
            remote: latest,
            initial: false,
            localChildren: state.children.length,
            remoteChildren: cloudHasChildren(latest.data) ? latest.data.children.length : 0
          };
          CLOUD.status = 'conflict';
        } catch (nested) {
          CLOUD.status = 'error';
          CLOUD.error = cloudFriendlyError(nested);
        }
      } else {
        CLOUD.status = navigator.onLine ? 'error' : 'offline';
        CLOUD.error = cloudFriendlyError(error);
        if (!auto) toast(CLOUD.error, 'error');
      }
      updateCloudChip();
      refreshCloudUI();
      return false;
    } finally {
      CLOUD.syncing = false;
      updateCloudChip();
      if (ui.view === 'family') refreshCloudUI();
    }
  }

  async function resolveCloudConflict(useCloud) {
    if (!CLOUD.conflict) return;
    if (useCloud) {
      const remote = CLOUD.conflict.remote;
      applyRemoteState(remote);
      CLOUD.conflict = null;
      toast('Data dari Netlify dipakai di perangkat ini.');
      refreshCloudUI({ force: true });
      return;
    }
    const ok = await askConfirm({
      title: 'Timpa data keluarga?',
      message: `Semua perangkat yang memakai akun keluarga akan menerima <strong>data di perangkat ini</strong> (${state.children.length} profil). Data yang tersimpan di Netlify akan diganti. Tautan lihat-saja juga akan menampilkan data ini.`,
      confirmText: 'Ya, gunakan data ini',
      danger: true
    });
    if (!ok) return;
    try {
      await pushLocalState(CLOUD.conflict.remote.version, { auto: false });
      CLOUD.conflict = null;
      CLOUD.status = 'synced';
      refreshCloudUI({ force: true });
    } catch (error) {
      if (error.code === 'version_conflict') {
        toast('Data berubah lagi. Muat ulang lalu pilih kembali.', 'error');
      } else {
        toast(cloudFriendlyError(error), 'error');
      }
    }
  }

  async function handleCloudLogin(form) {
    clearFormErrors(form);
    const data = new FormData(form);
    const password = String(data.get('password') || '');
    if (password.length < 1) {
      showFieldError(form, 'password', 'Masukkan kata sandi keluarga.');
      return;
    }
    const submit = form.querySelector('[type="submit"]');
    if (submit) { submit.disabled = true; submit.textContent = 'Memeriksa...'; }
    CLOUD.authMessage = '';
    try {
      await apiRequest('/login', { method: 'POST', body: { password } });
      CLOUD.authenticated = true;
      CLOUD.status = 'loading';
      updateCloudChip();
      await loadCloudData();
      updateCloudChip();
      refreshCloudUI({ force: true });
      toast('Berhasil masuk ke akun keluarga.');
    } catch (error) {
      CLOUD.authMessage = cloudFriendlyError(error);
      if (error.code === 'not_configured') CLOUD.status = 'setup';
      const box = form.querySelector('.cloud-inline-error');
      if (box) { box.textContent = CLOUD.authMessage; box.hidden = false; }
      else toast(CLOUD.authMessage, 'error');
      updateCloudChip();
      refreshCloudUI();
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = 'Masuk'; }
    }
  }

  async function signOutCloud() {
    const ok = await askConfirm({
      title: 'Keluar dari akun keluarga?',
      message: 'Data yang sudah tersimpan di perangkat ini tetap ada. Perangkat ini tidak akan menerima pembaruan sampai masuk kembali.',
      confirmText: 'Keluar dari akun'
    });
    if (!ok) return;
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout gagal:', error);
    }
    CLOUD.authenticated = false;
    CLOUD.status = 'signed-out';
    CLOUD.share = null;
    CLOUD.conflict = null;
    CLOUD.pending = false;
    CLOUD.authMessage = '';
    clearInterval(CLOUD.pollTimer);
    updateCloudChip();
    refreshCloudUI({ force: true });
    toast('Berhasil keluar dari akun.');
  }

  async function loadShareInfo() {
    if (!CLOUD.authenticated) return;
    try {
      const share = await apiRequest('/share');
      CLOUD.share = share;
    } catch (error) {
      CLOUD.share = null;
      console.warn('Info tautan gagal dimuat:', error);
    }
  }

  function cloudShareUrl() {
    if (!CLOUD.share || !CLOUD.share.token) return '';
    const url = new URL(location.origin + location.pathname);
    url.search = '';
    url.hash = '';
    url.searchParams.set('share', CLOUD.share.token);
    return url.toString();
  }

  async function copyShareLink() {
    if (!CLOUD.share || !CLOUD.share.enabled) { toast('Aktifkan tautan lihat-saja terlebih dahulu.', 'error'); return; }
    const url = cloudShareUrl();
    if (!url) { toast('Tautan belum siap. Coba muat ulang.', 'error'); return; }
    try {
      await navigator.clipboard.writeText(url);
      toast('Tautan lihat-saja disalin.');
    } catch (err) {
      window.prompt('Salin tautan lihat-saja:', url);
    }
  }

  function openShareLink() {
    if (!CLOUD.share || !CLOUD.share.enabled) { toast('Aktifkan tautan lihat-saja terlebih dahulu.', 'error'); return; }
    const url = cloudShareUrl();
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function toggleShareLink() {
    if (!CLOUD.authenticated || CLOUD.shareBusy) return;
    if (!CLOUD.share) await loadShareInfo();
    if (!CLOUD.share) { toast('Tautan belum siap.', 'error'); return; }
    const enable = !CLOUD.share.enabled;
    if (!enable) {
      const ok = await askConfirm({
        title: 'Nonaktifkan tautan lihat-saja?',
        message: 'Siapa pun yang memegang tautan akan langsung kehilangan akses. Tautan bisa diaktifkan kembali tanpa membuat alamat baru.',
        confirmText: 'Nonaktifkan tautan',
        danger: true
      });
      if (!ok) return;
    }
    CLOUD.shareBusy = true;
    try {
      const share = await apiRequest('/share', { method: 'POST', body: { action: enable ? 'enable' : 'disable' } });
      CLOUD.share = share;
      toast(enable ? 'Tautan lihat-saja diaktifkan.' : 'Tautan lihat-saja dinonaktifkan.');
      refreshCloudUI({ force: true });
    } catch (error) {
      toast(cloudFriendlyError(error), 'error');
    } finally {
      CLOUD.shareBusy = false;
    }
  }

  async function rotateShareLink() {
    if (!CLOUD.authenticated || CLOUD.shareBusy) return;
    const ok = await askConfirm({
      title: 'Buat tautan lihat-saja baru?',
      message: 'Tautan lama akan langsung berhenti bekerja. Bagikan tautan baru hanya kepada orang yang memang boleh melihat data keluarga.',
      confirmText: 'Buat tautan baru',
      danger: false
    });
    if (!ok) return;
    CLOUD.shareBusy = true;
    try {
      const share = await apiRequest('/share', { method: 'POST', body: { action: 'rotate' } });
      CLOUD.share = share;
      toast('Tautan baru dibuat. Tautan lama tidak berlaku.');
      refreshCloudUI({ force: true });
    } catch (error) {
      toast(cloudFriendlyError(error), 'error');
    } finally {
      CLOUD.shareBusy = false;
    }
  }

  function startCloudPolling() {
    window.clearInterval(CLOUD.pollTimer);
    CLOUD.pollTimer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (!navigator.onLine) return;
      if (!CLOUD.authenticated || CLOUD.conflict || CLOUD.syncing) return;
      if (document.body.classList.contains('modal-open')) return;
      syncNow({ auto: true });
    }, 20000);
  }

  /* ------------------------- mode lihat-saja ------------------------- */

  function setReadonlyBanner(updatedAt) {
    const banner = $('#readonlyBanner');
    if (!banner) return;
    banner.hidden = false;
    const updated = $('#readonlyUpdated');
    if (updated) updated.textContent = updatedAt ? `Diperbarui ${relativeSyncTime(updatedAt)}` : 'Data keluarga';
    const exit = $('#readonlyExit');
    if (exit) exit.href = location.pathname;
  }

  function setShareShellLoading(loading) {
    document.body.classList.toggle('share-loading', Boolean(loading));
    const switchWrap = $('#profileSwitchWrap');
    if (switchWrap) switchWrap.classList.toggle('is-hidden', Boolean(loading));
    const banner = $('#readonlyBanner');
    if (banner && loading) banner.hidden = true;
  }

  function renderShareLoading() {
    return `
      <div class="share-state">
        <div class="share-state-card card">
          <span class="share-state-icon">${ic('cloud')}</span>
          <p class="eyebrow">Tumbuh · lihat saja</p>
          <h1>Memuat cerita keluarga...</h1>
          <p>Kami mengambil data terbaru dari Netlify. Halaman ini tidak dapat mengubah apa pun.</p>
          <div class="share-loader"><span></span><span></span><span></span></div>
        </div>
      </div>`;
  }

  function renderShareError() {
    return `
      <div class="share-state">
        <div class="share-state-card card">
          <span class="share-state-icon error">${ic('cloud-off')}</span>
          <p class="eyebrow">Tautan lihat-saja</p>
          <h1>Tautan tidak dapat dibuka.</h1>
          <p>${esc(SHARE_ERROR || 'Tautan mungkin sudah diganti, dinonaktifkan, atau tidak lengkap.')}</p>
          <button class="btn btn-primary" type="button" data-action="retryShare">${ic('refresh')} Coba lagi</button>
        </div>
      </div>`;
  }

  function renderReadonlyBlocked() {
    return `
      <div class="share-state">
        <div class="share-state-card card">
          <span class="share-state-icon">${ic('lock')}</span>
          <p class="eyebrow">Mode lihat saja</p>
          <h1>Halaman pengaturan tidak tersedia.</h1>
          <p>Tautan ini hanya untuk melihat data keluarga. Untuk mengedit atau mengatur sinkronisasi, masuk memakai akun keluarga di halaman utama.</p>
          <a class="btn btn-soft" href="#dashboard">${ic('dashboard')} Kembali ke ringkasan</a>
        </div>
      </div>`;
  }

  async function initShareView() {
    document.body.classList.add('readonly');
    document.body.classList.add('share-loading');
    CLOUD.status = 'share';
    updateCloudChip();
    state = defaultState();
    SHARE_LOADING = true;
    SHARE_ERROR = '';
    setShareShellLoading(true);
    renderApp({ animate: false });
    try {
      const payload = await apiRequest(`/shared?token=${encodeURIComponent(SHARE_TOKEN)}`);
      if (!payload || !payload.data) throw apiError('Belum ada data untuk dibagikan.', 'share_empty', 404);
      const normalized = normalizeState(payload.data);
      if (!normalized.children.length) throw apiError('Belum ada profil anak pada data yang dibagikan.', 'share_empty', 404);
      state = normalized;
      SHARE_UPDATED_AT = payload.updatedAt || null;
      SHARE_LOADING = false;
      setShareShellLoading(false);
      setReadonlyBanner(SHARE_UPDATED_AT);
      renderApp({ animate: false });
      document.title = 'Lihat saja · Tumbuh';
      startShareRefresh();
    } catch (error) {
      SHARE_LOADING = false;
      SHARE_ERROR = cloudFriendlyError(error);
      setShareShellLoading(false);
      const switchWrap = $('#profileSwitchWrap');
      if (switchWrap) switchWrap.classList.add('is-hidden');
      renderApp({ animate: false });
    }
  }

  async function refreshShareData() {
    if (!READ_ONLY_MODE || SHARE_LOADING || SHARE_ERROR) return;
    if (document.visibilityState !== 'visible') return;
    if (!navigator.onLine) return;
    if (document.body.classList.contains('modal-open')) return;
    try {
      const payload = await apiRequest(`/shared?token=${encodeURIComponent(SHARE_TOKEN)}`);
      if (!payload || !payload.data) throw apiError('Tautan tidak berlaku.', 'share_not_found', 404);
      if (payload.updatedAt && payload.updatedAt === SHARE_UPDATED_AT) return;
      const normalized = normalizeState(payload.data);
      if (!normalized.children.length) throw apiError('Data tidak tersedia.', 'share_empty', 404);
      state = normalized;
      SHARE_UPDATED_AT = payload.updatedAt || null;
      setReadonlyBanner(SHARE_UPDATED_AT);
      if (cloudPageSafeToRender()) renderApp({ preserveScroll: true, animate: false });
    } catch (error) {
      SHARE_ERROR = cloudFriendlyError(error);
      setShareShellLoading(false);
      const banner = $('#readonlyBanner');
      if (banner) banner.hidden = true;
      const switchWrap = $('#profileSwitchWrap');
      if (switchWrap) switchWrap.classList.add('is-hidden');
      renderApp({ animate: false });
    }
  }

  function startShareRefresh() {
    window.clearInterval(SHARE_REFRESH_TIMER);
    SHARE_REFRESH_TIMER = window.setInterval(refreshShareData, 30000);
  }

  /* =========================================================
     Potongan tampilan & grafik
     ========================================================= */

  function avatarHTML(child, size = '') {
    if (!child) return `<span class="avatar ${size}" style="--avatar:#8a9991">T</span>`;
    return `<span class="avatar ${size}" style="--avatar:${esc(child.color)}">${esc(initials(child.name))}</span>`;
  }

  function chartEmptyMarkup(metric, context = 'dashboard') {
    const m = METRICS[metric] || METRICS.weight;
    return `
      <div class="chart-empty">
        <div class="empty-inline">
          <span class="empty-icon">${ic('chart')}</span>
          <strong>Belum ada data ${esc(m.label.toLowerCase())}</strong>
          <p>${context === 'growth' ? 'Catat pengukuran pertama untuk mulai melihat perjalanan Si Kecil.' : 'Satu catatan kecil hari ini sudah berarti.'}</p>
          <button class="btn btn-soft btn-sm" type="button" data-action="addMeasurement" style="margin-top:12px">${ic('plus')} Catat pengukuran</button>
        </div>
      </div>`;
  }

  function niceStep(value) {
    const safe = Math.max(Number(value) || 0.1, 0.0001);
    const exponent = Math.floor(Math.log10(safe));
    const fraction = safe / Math.pow(10, exponent);
    let nice;
    if (fraction <= 1) nice = 1;
    else if (fraction <= 2) nice = 2;
    else if (fraction <= 2.5) nice = 2.5;
    else if (fraction <= 5) nice = 5;
    else nice = 10;
    return nice * Math.pow(10, exponent);
  }

  function niceScale(min, max, count = 4) {
    const range = Math.max(max - min, 0.1);
    const step = niceStep(range / Math.max(2, count - 1));
    let low = Math.floor((min - range * 0.08) / step) * step;
    let high = Math.ceil((max + range * 0.08) / step) * step;
    if (low < 0) low = 0;
    if (high <= low) high = low + step * 2;
    const ticks = [];
    for (let value = low; value <= high + step / 2; value += step) {
      ticks.push(Number(value.toFixed(6)));
    }
    return { min: low, max: high, ticks };
  }

  function smoothPath(points) {
    if (!points.length) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      path += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  }

  function buildChartSVG(points, { width, height, color, unit, metric, compact = false }) {
    const padding = {
      top: 17,
      right: compact ? 12 : 18,
      bottom: 29,
      left: compact ? 34 : 43
    };
    const plotW = Math.max(30, width - padding.left - padding.right);
    const plotH = Math.max(40, height - padding.top - padding.bottom);
    const times = points.map((p) => parseISO(p.date).getTime());
    const values = points.map((p) => Number(p.value));
    const minX = Math.min(...times);
    const maxX = Math.max(...times);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const tickCount = compact ? 3 : 4;
    const singlePad = unit === 'kg' ? 1.2 : 4;
    const scale = (rawMax - rawMin) < singlePad
      ? niceScale(rawMin - singlePad, rawMax + singlePad, tickCount)
      : niceScale(rawMin, rawMax, tickCount);
    const yMin = scale.min;
    const yMax = scale.max;
    const ticks = scale.ticks;

    const xFor = (time) => {
      if (maxX === minX) return padding.left + plotW / 2;
      return padding.left + ((time - minX) / (maxX - minX)) * plotW;
    };
    const yFor = (value) => padding.top + (1 - (value - yMin) / (yMax - yMin)) * plotH;
    const coords = points.map((p, i) => ({ x: xFor(times[i]), y: yFor(Number(p.value)), date: p.date, value: Number(p.value) }));

    const tickDecimals = ticks.some((tick) => Math.abs(tick - Math.round(tick)) > 0.001) ? 1 : 0;
    const tickMarkup = ticks.map((tick) => {
      const y = yFor(tick);
      return `
        <line class="chart-grid-line" x1="${padding.left}" y1="${y.toFixed(1)}" x2="${(width - padding.right).toFixed(1)}" y2="${y.toFixed(1)}"/>
        <text class="chart-axis-text" x="${padding.left - 7}" y="${(y + 3).toFixed(1)}" text-anchor="end">${formatNumber(tick, tickDecimals)}</text>`;
    }).join('');

    const maxLabels = width < 460 ? 3 : 4;
    const labelIndices = [];
    if (points.length <= maxLabels) {
      points.forEach((_, i) => labelIndices.push(i));
    } else {
      for (let i = 0; i < maxLabels; i += 1) labelIndices.push(Math.round((i * (points.length - 1)) / (maxLabels - 1)));
    }
    const uniqueLabelIndices = [...new Set(labelIndices)];
    const spansYears = new Date(maxX).getFullYear() !== new Date(minX).getFullYear();
    const xLabels = uniqueLabelIndices.map((index, position) => {
      const d = parseISO(points[index].date);
      const label = d.toLocaleDateString('id-ID', {
        day: compact ? undefined : 'numeric',
        month: 'short',
        year: spansYears ? '2-digit' : undefined
      });
      const x = coords[index].x;
      const anchor = position === 0 ? 'start' : (position === uniqueLabelIndices.length - 1 ? 'end' : 'middle');
      return `<text class="chart-axis-text" x="${x.toFixed(1)}" y="${height - 7}" text-anchor="${anchor}">${esc(label)}</text>`;
    }).join('');

    const path = smoothPath(coords);
    const areaPath = coords.length > 1
      ? `${path} L ${coords[coords.length - 1].x} ${(height - padding.bottom).toFixed(1)} L ${coords[0].x} ${(height - padding.bottom).toFixed(1)} Z`
      : '';
    const gradientId = `chartGrad-${Math.random().toString(36).slice(2, 8)}`;
    const latest = coords[coords.length - 1];
    const dotMarkup = coords.map((point) => `
      <g class="chart-point" tabindex="0" role="img" aria-label="${esc(formatDate(point.date, { year: 'numeric' }))}, ${formatNumber(point.value)} ${unit}"
         data-date="${esc(point.date)}" data-value="${point.value}" data-x="${point.x}" data-y="${point.y}">
        <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="10" fill="transparent"/>
        <circle class="chart-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.8" fill="${color}"/>
      </g>`).join('');

    const svg = `
      <svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Grafik ${esc(METRICS[metric].label)}">
        <defs>
          <linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity=".19"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${tickMarkup}
        <line class="chart-axis-line" x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}"/>
        ${areaPath ? `<path d="${areaPath}" fill="url(#${gradientId})"/>` : ''}
        ${coords.length > 1 ? `<path class="chart-line" d="${path}" stroke="${color}"/>` : ''}
        ${coords.length > 1 ? `<circle cx="${latest.x.toFixed(1)}" cy="${latest.y.toFixed(1)}" r="8" fill="${color}" opacity=".12"/>` : ''}
        ${dotMarkup}
        ${xLabels}
      </svg>
      <div class="chart-tip" hidden></div>`;
    return svg;
  }

  function hydrateCharts() {
    $$('[data-chart]').forEach((element) => {
      const child = activeChild();
      if (!child) {
        element.innerHTML = chartEmptyMarkup(ui.metric);
        return;
      }
      const metric = element.dataset.metric || ui.metric;
      const context = element.dataset.context || 'dashboard';
      const points = measurementsFor(child.id, 'asc')
        .filter((m) => m[metric] != null)
        .map((m) => ({ date: m.date, value: Number(m[metric]) }));
      if (!points.length) {
        element.innerHTML = chartEmptyMarkup(metric, context);
        return;
      }
      const width = Math.max(250, Math.round(element.clientWidth || 620));
      const fallbackHeight = context === 'growth' ? 320 : 235;
      const height = Math.max(190, Math.round(element.clientHeight || fallbackHeight));
      element.innerHTML = buildChartSVG(points, {
        width,
        height,
        color: METRICS[metric].color,
        unit: METRICS[metric].unit,
        metric,
        compact: width < 460
      });
      bindChartTips(element, width, height);
    });
  }

  function bindChartTips(element, width, height) {
    const tip = element.querySelector('.chart-tip');
    if (!tip) return;
    const show = (point) => {
      const date = point.dataset.date;
      const value = Number(point.dataset.value);
      const metric = element.dataset.metric || ui.metric;
      tip.innerHTML = `<small>${esc(formatDate(date, { year: 'numeric' }))}</small><strong>${formatNumber(value)} <span>${esc(METRICS[metric].unit)}</span></strong>`;
      const x = Number(point.dataset.x);
      const y = Number(point.dataset.y);
      tip.style.left = `${clamp((x / width) * 100, 8, 92)}%`;
      tip.style.top = `${clamp((y / height) * 100, 10, 92)}%`;
      tip.hidden = false;
    };
    $$('.chart-point', element).forEach((point) => {
      point.addEventListener('mouseenter', () => show(point));
      point.addEventListener('focus', () => show(point));
      point.addEventListener('click', () => show(point));
      point.addEventListener('mouseleave', () => { tip.hidden = true; });
      point.addEventListener('blur', () => { tip.hidden = true; });
    });
  }

  /* =========================================================
     Halaman: Ringkasan
     ========================================================= */

  function focusMilestoneFor(child) {
    const band = currentBand(child);
    let item = bandMilestones(band.id).find((m) => !milestoneDate(child.id, m.id));
    if (item) return { item, band };
    const index = AGE_BANDS.findIndex((b) => b.id === band.id);
    const nextBand = AGE_BANDS[index + 1];
    if (nextBand) {
      item = bandMilestones(nextBand.id).find((m) => !milestoneDate(child.id, m.id));
      if (item) return { item, band: nextBand };
    }
    return { item: null, band };
  }

  function renderDashboard(child) {
    const age = ageOn(child.birthDate);
    const latest = latestMeasurement(child.id);
    const band = currentBand(child);
    const progress = bandProgress(child, band.id);
    const focus = focusMilestoneFor(child);
    const next = nextVaccine(child);
    const vax = vaccineCounts(child);
    const journals = journalFor(child.id).slice(0, 3);
    const weightDelta = deltaFromPrevious(child.id, 'weight');
    const heightDelta = deltaFromPrevious(child.id, 'height');
    const headDelta = deltaFromPrevious(child.id, 'head');
    const name = child.name.split(/\s+/)[0];

    const stat = (key, delta) => {
      const metric = METRICS[key];
      const value = latest ? latest[key] : null;
      const deltaText = value == null
        ? 'Belum ada data'
        : (delta ? `${formatDelta(delta.diff, metric.unit)} dari ${formatDate(delta.from)}` : 'Pengukuran pertama');
      return `
        <div class="hero-stat">
          <div class="hero-stat-label">${ic(metric.icon)} ${esc(metric.short)}</div>
          <div class="hero-stat-value">${value == null ? '—' : formatNumber(value)}<small>${esc(metric.unit)}</small></div>
          <div class="hero-stat-delta ${delta ? '' : 'neutral'}">${esc(deltaText)}</div>
        </div>`;
    };

    const domainMarkup = DOMAIN_KEYS.map((key) => {
      const item = bandMilestones(band.id).find((m) => m.domain === key);
      const done = item ? Boolean(milestoneDate(child.id, item.id)) : false;
      const domain = DOMAINS[key];
      return `
        <div class="domain-bar">
          <div class="domain-bar-label">
            <span><i style="color:${domain.color}"></i>${esc(domain.label)}</span>
            <strong>${done ? 'Selesai' : 'Belum'}</strong>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${done ? 100 : 0}%;background:${domain.color}"></div></div>
        </div>`;
    }).join('');

    const focusMarkup = focus.item ? `
      <div class="focus-milestone">
        <span class="focus-milestone-icon" style="background:${DOMAINS[focus.item.domain].tint};color:${DOMAINS[focus.item.domain].color}">${ic(DOMAINS[focus.item.domain].icon)}</span>
        <span class="focus-milestone-copy">
          <small>${esc(DOMAINS[focus.item.domain].label)} · ${esc(focus.band.label)}</small>
          <strong>${esc(focus.item.title)}</strong>
        </span>
        <button class="focus-check" type="button" data-action="toggleMilestone" data-id="${esc(focus.item.id)}" aria-label="Tandai milestone selesai" aria-pressed="false">${ic('check')}</button>
      </div>` : `
      <div class="focus-milestone">
        <span class="focus-milestone-icon" style="background:var(--forest-soft);color:var(--forest)">${ic('award')}</span>
        <span class="focus-milestone-copy"><small>Semua tahap</small><strong>Semua checklist milestone sudah ditandai. Luar biasa!</strong></span>
      </div>`;

    const vaccineMarkup = next ? `
      <div class="focus-vax">
        <span class="focus-vax-mark">${ic('shield')}</span>
        <span class="focus-vax-copy">
          <strong>${esc(next.name)}</strong>
          <small>${vaccineStatus(child, next) === 'missed' ? `Belum tercatat · jadwal ${next.ageLabel}` : `Jadwal usia ${next.ageLabel}`}${next.optional ? ' · opsional' : ''}</small>
        </span>
        <a class="text-link muted" href="#immunizations">Jadwal ${ic('arrow-right')}</a>
      </div>` : `
      <div class="focus-vax">
        <span class="focus-vax-mark" style="background:var(--forest-soft);color:var(--forest)">${ic('check')}</span>
        <span class="focus-vax-copy"><strong>Semua jadwal dasar tercatat</strong><small>Terus lengkapi catatan bila ada imunisasi tambahan.</small></span>
      </div>`;

    return `
      <div class="view-head">
        <div>
          <p class="eyebrow">Ringkasan hari ini</p>
          <h1>Mari lihat cerita ${esc(name)} hari ini.</h1>
          <p class="view-sub">${latest ? 'Setiap catatan kecil membantu kita memahami tumbuh kembangnya.' : 'Mulai dari satu pengukuran kecil, lalu lihat bagaimana ceritanya berkembang.'}</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-ghost" type="button" data-action="addJournal">${ic('journal')} Tulis jurnal</button>
          <button class="btn btn-primary" type="button" data-action="addMeasurement">${ic('plus')} Catat pengukuran</button>
        </div>
      </div>

      <div class="hero-row">
        <section class="child-hero" aria-label="Profil anak">
          <svg class="hero-art" viewBox="0 0 160 120" aria-hidden="true">
            <circle cx="117" cy="32" r="21"/>
            <circle cx="117" cy="32" r="30" stroke-dasharray="2 5"/>
            <path d="M13 106c18-3 31-13 38-30 5-12 4-27 1-43"/>
            <path d="M51 53c-10 0-18-6-20-16 10 0 18 6 20 16Z" class="filled"/>
            <path d="M52 63c11-1 19-8 21-18-11 0-19 8-21 18Z"/>
            <path d="M121 104h27"/>
            <circle cx="33" cy="98" r="2" class="filled"/>
          </svg>
          <div class="hero-top">
            <span class="hero-avatar-ring">${avatarHTML(child, 'avatar-lg hero-avatar')}</span>
            <div class="hero-identity">
              <span class="hero-kicker">${ic('sparkles')} Profil aktif</span>
              <h2 class="hero-name">${esc(child.name)}</h2>
              <div class="hero-meta">
                <span>${ic('baby')} ${esc(formatAge(child.birthDate))}</span>
                <span class="sep"></span>
                <span>${ic('calendar')} Lahir ${esc(formatDateLong(child.birthDate))}</span>
              </div>
            </div>
          </div>
          <div class="hero-stats">
            ${stat('weight', weightDelta)}
            ${stat('height', heightDelta)}
            ${stat('head', headDelta)}
          </div>
        </section>

        <aside class="card focus-card">
          <div class="focus-top">
            <span class="pill green"><span class="dot"></span> Fokus hari ini</span>
            <span class="pill">${esc(band.label)}</span>
          </div>
          <div>
            <h2 class="focus-title">Satu langkah kecil untuk ${esc(name)}.</h2>
          </div>
          ${focusMarkup}
          <div class="focus-divider"></div>
          <div class="focus-vax-wrap">
            <div class="focus-label"><span>Imunisasi berikutnya</span><span>${vax.completed}/${vax.total}</span></div>
            ${vaccineMarkup}
          </div>
          <div class="focus-footer">
            <span class="focus-footnote">${progress.done} dari ${progress.total} milestone usia ini</span>
            <a class="text-link" href="#milestones">Lihat checklist ${ic('arrow-right')}</a>
          </div>
        </aside>
      </div>

      <div class="dash-grid">
        <section class="card chart-card">
          <div class="chart-head">
            <div>
              <h2 class="card-title">Jejak pertumbuhan</h2>
              <p class="card-sub">Tren dari catatan pengukuran ${esc(name)}.</p>
            </div>
            <div class="segmented" role="group" aria-label="Pilih data pertumbuhan">
              ${Object.entries(METRICS).map(([key, metric]) => `<button type="button" data-action="setMetric" data-metric="${key}" class="${ui.metric === key ? 'active' : ''}">${esc(metric.short)}</button>`).join('')}
            </div>
          </div>
          <div class="chart-wrap" data-chart data-context="dashboard" data-metric="${esc(ui.metric)}"></div>
          <div class="chart-foot">
            <p>${latest ? `Pengukuran terakhir ${esc(formatDate(latest.date))}` : 'Belum ada pengukuran tercatat'}</p>
            <a class="text-link muted" href="#growth">Semua catatan ${ic('arrow-right')}</a>
          </div>
        </section>

        <section class="card milestone-card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Peta milestone</h2>
              <p class="card-sub">Fokus usia ${esc(band.label)}</p>
            </div>
            <span class="pill lilac">${ic('flag')} ${progress.done}/${progress.total}</span>
          </div>
          <div class="ring-block">
            <div class="progress-ring" style="--value:${progress.percent};--ring-color:var(--forest)">
              <div class="ring-inner"><strong>${progress.percent}%</strong><small>selesai</small></div>
            </div>
            <div class="ring-copy">
              <strong>${progress.percent >= 100 ? 'Tahap ini tuntas!' : 'Sedang bertumbuh'}</strong>
              <p>${progress.percent >= 100 ? 'Lanjutkan ke tahap berikutnya saat siap.' : `Masih ada ${progress.total - progress.done} hal yang bisa distimulasi bersama.`}</p>
            </div>
          </div>
          <div class="domain-bars">${domainMarkup}</div>
          <a class="text-link" href="#milestones">Buka checklist lengkap ${ic('arrow-right')}</a>
        </section>

        <section class="card journal-card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Jurnal kecil</h2>
              <p class="card-sub">Momen yang sayang untuk dilupakan.</p>
            </div>
            <a class="text-link muted" href="#journal">Lihat semua ${ic('arrow-right')}</a>
          </div>
          ${journals.length ? `
            <div class="journal-preview">
              ${journals.map((entry) => {
                const category = CATEGORIES[entry.category] || CATEGORIES.note;
                return `
                  <div class="preview-entry">
                    <span class="entry-icon ${category.tone}">${ic(category.icon)}</span>
                    <span class="preview-copy"><strong>${esc(entry.title)}</strong><small>${esc(entry.note || category.label)}</small></span>
                    <span class="preview-date">${esc(formatDate(entry.date, { year: undefined }))}</span>
                  </div>`;
              }).join('')}
            </div>` : `
            <div class="empty-inline" style="min-height:150px">
              <span class="empty-icon">${ic('journal')}</span>
              <strong>Belum ada cerita hari ini</strong>
              <p>Hal kecil yang ia lakukan hari ini layak dicatat.</p>
            </div>`}
          <button class="journal-prompt" type="button" data-action="addJournal">${ic('plus')} Apa hal baru yang dilakukan ${esc(name)} hari ini?</button>
        </section>

        <section class="card vax-card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Imunisasi</h2>
              <p class="card-sub">Rekap jadwal dasar ${esc(name)}.</p>
            </div>
            <span class="pill green">${ic('shield')} ${vax.completed}/${vax.total}</span>
          </div>
          <div class="vax-progress-head">
            <strong>${Math.round((vax.completed / vax.total) * 100)}%</strong>
            <span>${vax.missed ? `${vax.missed} belum tercatat` : 'Semua jadwal dasar lengkap'}</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${Math.round((vax.completed / vax.total) * 100)}%"></div></div>
          <div class="vax-mini-list">
            ${VACCINES.filter((v) => vaccineStatus(child, v) !== 'done').sort((a, b) => Number(Boolean(a.optional)) - Number(Boolean(b.optional)) || a.ageMonths - b.ageMonths).slice(0, 3).map((v) => {
              const status = vaccineStatus(child, v);
              return `
                <div class="vax-mini">
                  <span class="vax-mini-status ${status === 'missed' ? 'missed' : ''}"></span>
                  <span class="vax-mini-copy"><strong>${esc(v.name)}${v.optional ? ' · opsional' : ''}</strong><small>Jadwal usia ${esc(v.ageLabel)}</small></span>
                  <span class="pill ${v.optional ? 'gold' : (status === 'missed' ? 'coral' : 'gold')}">${v.optional ? 'Opsional' : (status === 'missed' ? 'Belum' : 'Nanti')}</span>
                </div>`;
            }).join('') || `
              <div class="vax-mini">
                <span class="vax-mini-status done"></span>
                <span class="vax-mini-copy"><strong>Semua jadwal dasar tercatat</strong><small>Terus simpan catatan imunisasi tambahan.</small></span>
              </div>`}
          </div>
          <div class="vax-footnote">${ic('info')} Ikuti buku KIA dan anjuran dokter atau posyandu setempat.</div>
          <a class="text-link" href="#immunizations" style="margin-top:auto;padding-top:11px">Buka jadwal imunisasi ${ic('arrow-right')}</a>
        </section>
      </div>`;
  }

  /* =========================================================
     Halaman: Selamat datang
     ========================================================= */

  function welcomeArtwork() {
    return `
      <svg viewBox="0 0 520 430" role="img" aria-label="Ilustrasi taman tumbuh dan catatan pertumbuhan anak">
        <defs>
          <linearGradient id="welcomeArch" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#e3edd9"/>
            <stop offset="100%" stop-color="#cfe1d2"/>
          </linearGradient>
          <linearGradient id="welcomeFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f4ecdc"/>
            <stop offset="100%" stop-color="#e9deca"/>
          </linearGradient>
        </defs>
        <circle cx="281" cy="214" r="188" fill="#f0e7d8"/>
        <circle cx="281" cy="214" r="206" fill="none" stroke="#d8ccb9" stroke-width="1.1" stroke-dasharray="2 8"/>
        <path d="M119 367V202c0-82 68-148 151-148s151 66 151 148v165Z" fill="url(#welcomeArch)"/>
        <path d="M141 367V204c0-66 56-120 125-120s125 54 125 120v163Z" fill="#faf5ea"/>
        <circle cx="408" cy="87" r="43" fill="#f2cf7b"/>
        <circle cx="408" cy="87" r="54" fill="none" stroke="#e9c165" stroke-width="1" stroke-dasharray="2 6" opacity=".7"/>
        <ellipse cx="281" cy="385" rx="186" ry="27" fill="#e9dfce"/>
        <path d="M154 378c36-20 91-30 142-30 48 0 98 9 128 30" fill="url(#welcomeFloor)"/>
        <path d="M234 368c-1-40-6-72-5-108 1-27 12-49 34-67" fill="none" stroke="#2e6b57" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M262 215c-27-2-45-18-49-44 27-2 47 17 49 44Z" fill="#e67655"/>
        <path d="M258 247c26-2 46-19 50-46-28-2-49 18-50 46Z" fill="#9ebc73"/>
        <path d="M259 274c-23-1-40-14-44-36 23-1 41 15 44 36Z" fill="#cfe0b2"/>
        <path d="M265 185c-1-15 2-28 10-40" fill="none" stroke="#2e6b57" stroke-width="2" stroke-linecap="round"/>
        <circle cx="277" cy="143" r="9" fill="#f2cf7b"/>
        <circle cx="277" cy="143" r="14" fill="none" stroke="#d9b35c" stroke-width="1"/>
        <rect x="175" y="314" width="35" height="35" rx="6" fill="#e67655" transform="rotate(-5 192 331)"/>
        <rect x="207" y="329" width="27" height="27" rx="5" fill="#d9a441" transform="rotate(4 220 342)"/>
        <rect x="344" y="316" width="42" height="42" rx="7" fill="#cfe0b2" transform="rotate(3 365 337)"/>
        <path d="M344 330h42" stroke="#b5cc95" stroke-width="1"/>
        <circle cx="365" cy="305" r="17" fill="#e67655" opacity=".85"/>
        <path d="M346 349c8-6 15-6 23 0" stroke="#b5cc95" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M163 143c7-8 16-12 27-12 17 0 31 14 31 31" fill="none" stroke="#2e6b57" stroke-width="1.3" stroke-dasharray="2 5" opacity=".55"/>
        <circle cx="165" cy="143" r="3" fill="#2e6b57" opacity=".55"/>
        <circle cx="221" cy="162" r="3" fill="#e67655" opacity=".75"/>
        <path d="M128 93h.01M455 260h.01M112 285h.01M446 185h.01" stroke="#b6a78f" stroke-width="3" stroke-linecap="round"/>
        <path d="M96 236c13-9 26-8 38 2" stroke="#d8ccb9" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="float-card float-one">
        <span class="float-icon" style="background:var(--forest-soft);color:var(--forest)">${ic('trend-up')}</span>
        <span><strong>Tinggi +4 cm</strong><small>dalam 3 bulan</small></span>
      </div>
      <div class="float-card float-two">
        <span class="float-icon" style="background:var(--gold-soft);color:#926915">${ic('star')}</span>
        <span><strong>Milestone baru</strong><small>kalimat tiga kata</small></span>
      </div>`;
  }

  function renderWelcome() {
    return `
      <section class="welcome">
        <div class="welcome-copy">
          <p class="eyebrow">Selamat datang di tumbuh</p>
          <h1>Tumbuh besar, satu <em>catatan kecil</em> setiap hari.</h1>
          <p class="welcome-lede">Simpan cerita pertumbuhan, milestone, imunisasi, dan momen berharga Si Kecil dalam satu tempat yang tenang. Tanpa akun, tanpa terburu-buru.</p>
          <div class="welcome-actions">
            <button class="btn btn-primary btn-lg" type="button" data-action="addChild">${ic('plus')} Mulai buat profil anak</button>
            <button class="btn btn-ghost btn-lg" type="button" data-action="loadDemo">${ic('sparkles')} Lihat dengan data contoh</button>
          </div>
          <p class="welcome-small">${ic('lock')} Data tersimpan privat di perangkat ini. Bisa diekspor kapan saja.</p>
        </div>
        <div class="welcome-art">${welcomeArtwork()}</div>
      </section>
      <div class="welcome-features">
        <article class="card feature-card">
          <span class="feature-icon" style="--tint:var(--coral-soft);--color:var(--coral-deep)">${ic('chart')}</span>
          <div><strong>Lihat pola pertumbuhan</strong><p>Grafik berat, tinggi, dan lingkar kepala yang mudah dibaca.</p></div>
        </article>
        <article class="card feature-card">
          <span class="feature-icon" style="--tint:var(--forest-soft);--color:var(--forest)">${ic('flag')}</span>
          <div><strong>Pantau tiap tahap</strong><p>Checklist milestone 0–6 tahun dengan ide stimulasi praktis.</p></div>
        </article>
        <article class="card feature-card">
          <span class="feature-icon" style="--tint:var(--gold-soft);--color:#926915">${ic('journal')}</span>
          <div><strong>Simpan momen kecil</strong><p>Jurnal singkat untuk cerita yang ingin selalu diingat.</p></div>
        </article>
      </div>`;
  }

  /* =========================================================
     Halaman: Tumbuh kembang
     ========================================================= */

  function renderGrowth(child) {
    const measurements = measurementsFor(child.id, 'desc');
    const latest = measurements[0] || null;
    const name = child.name.split(/\s+/)[0];
    const weightDelta = deltaFromPrevious(child.id, 'weight');
    const heightDelta = deltaFromPrevious(child.id, 'height');
    const headDelta = deltaFromPrevious(child.id, 'head');
    const metric = METRICS[ui.metric];

    const metricTile = (key, delta) => {
      const m = METRICS[key];
      const value = latest ? latest[key] : null;
      let note = 'Belum ada data';
      if (value != null && delta) note = `<b>${esc(formatDelta(delta.diff, m.unit))}</b> sejak ${esc(formatDate(delta.from))}`;
      else if (value != null) note = 'Pengukuran pertama';
      return `
        <article class="metric-tile" style="--tint:${m.tint}">
          <div class="metric-tile-label">${ic(m.icon)} ${esc(m.label)}</div>
          <div class="metric-tile-value">${value == null ? '—' : formatNumber(value)}<small>${esc(m.unit)}</small></div>
          <div class="metric-tile-note">${note}</div>
        </article>`;
    };

    const earliest = measurements[measurements.length - 1] || null;
    const firstWeight = earliest && earliest.weight != null ? earliest.weight : null;
    const lastWeight = latest && latest.weight != null ? latest.weight : null;
    const firstHeight = earliest && earliest.height != null ? earliest.height : null;
    const lastHeight = latest && latest.height != null ? latest.height : null;
    const gainWeight = firstWeight != null && lastWeight != null ? lastWeight - firstWeight : null;
    const gainHeight = firstHeight != null && lastHeight != null ? lastHeight - firstHeight : null;
    const insightText = measurements.length > 1
      ? `Sejak ${formatDate(earliest.date)}, berat ${name} bertambah ${gainWeight == null ? '—' : `${formatNumber(gainWeight)} kg`} dan tinggi ${gainHeight == null ? '—' : `${formatNumber(gainHeight)} cm`}. Setiap anak punya lajunya sendiri.`
      : `Catatan pertama sudah tersimpan. Tambahkan pengukuran berikutnya untuk melihat bagaimana ${name} bertumbuh dari waktu ke waktu.`;

    return `
      <div class="view-head">
        <div>
          <p class="eyebrow">Tumbuh kembang</p>
          <h1>Perjalanan fisik ${esc(name)}.</h1>
          <p class="view-sub">Catat berat, tinggi, dan lingkar kepala secara rutin. Fokus pada pola, bukan angka sempurna.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" type="button" data-action="addMeasurement">${ic('plus')} Tambah pengukuran</button>
        </div>
      </div>

      <div class="metric-strip">
        ${metricTile('weight', weightDelta)}
        ${metricTile('height', heightDelta)}
        ${metricTile('head', headDelta)}
        <article class="metric-tile" style="--tint:var(--surface-2)">
          <div class="metric-tile-label">${ic('file')} Total catatan</div>
          <div class="metric-tile-value">${measurements.length}<small>kali</small></div>
          <div class="metric-tile-note">${latest ? `Terakhir ${esc(formatDate(latest.date))}` : 'Mulai catat hari ini'}</div>
        </article>
      </div>

      <div class="growth-layout">
        <section class="card growth-main">
          <div class="growth-chart-head">
            <div>
              <h2 class="card-title">Kurva ${esc(metric.label.toLowerCase())}</h2>
              <p class="card-sub">${measurements.length ? `${measurements.length} pengukuran tercatat` : 'Belum ada pengukuran'} · ${esc(name)}</p>
            </div>
            <div class="segmented" role="group" aria-label="Pilih data pertumbuhan">
              ${Object.entries(METRICS).map(([key, item]) => `<button type="button" data-action="setMetric" data-metric="${key}" class="${ui.metric === key ? 'active' : ''}">${esc(item.short)}</button>`).join('')}
            </div>
          </div>
          <div class="growth-chart-area">
            <div class="chart-wrap" data-chart data-context="growth" data-metric="${esc(ui.metric)}"></div>
          </div>
          <div class="growth-note">${ic('info')} Grafik ini menampilkan tren pengukuran ${esc(name)} sendiri, bukan kurva standar WHO. Untuk menilai pertumbuhan, diskusikan dengan dokter atau posyandu.</div>
        </section>

        <aside class="growth-aside">
          <section class="card insight-card">
            <p class="eyebrow">Yang terlihat</p>
            <h3>${measurements.length ? `${esc(name)}, terus bertumbuh.` : 'Awal yang baik.'}</h3>
            <p>${esc(insightText)}</p>
            <div class="insight-meta">
              <div><small>Sejak</small><strong>${earliest ? esc(formatDate(earliest.date, { year: undefined })) : '—'}</strong></div>
              <div><small>Pengukuran</small><strong>${measurements.length} catatan</strong></div>
            </div>
          </section>
          <section class="card quick-measure">
            <h3>Ukur dengan cara konsisten</h3>
            <p>Timbang di waktu yang sama, dengan pakaian ringan. Untuk bayi, ukur panjang berbaring; untuk anak yang sudah berdiri, ukur tinggi berdiri.</p>
            <button class="btn btn-soft btn-sm" type="button" data-action="addMeasurement">${ic('plus')} Catat sekarang</button>
          </section>
        </aside>
      </div>

      <section class="card table-card">
        <div class="table-head">
          <h2>Riwayat pengukuran</h2>
          <span class="pill">${measurements.length} catatan</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th scope="col">Tanggal</th>
                <th scope="col">Berat</th>
                <th scope="col">Tinggi</th>
                <th scope="col">Lingkar kepala</th>
                <th scope="col">Catatan</th>
                <th scope="col" aria-label="Aksi"></th>
              </tr>
            </thead>
            <tbody>
              ${measurements.length ? measurements.map((m) => `
                <tr>
                  <td class="date-cell">${esc(formatDate(m.date))}</td>
                  <td class="num">${m.weight == null ? '—' : `${formatNumber(m.weight)}<small>kg</small>`}</td>
                  <td class="num">${m.height == null ? '—' : `${formatNumber(m.height)}<small>cm</small>`}</td>
                  <td class="num">${m.head == null ? '—' : `${formatNumber(m.head)}<small>cm</small>`}</td>
                  <td class="note-cell">${m.note ? esc(m.note) : '<span style="color:var(--muted-2)">—</span>'}</td>
                  <td class="actions-cell">
                    <button class="icon-btn sm" type="button" data-action="editMeasurement" data-id="${esc(m.id)}" aria-label="Ubah pengukuran ${esc(formatDate(m.date))}">${ic('edit')}</button>
                    <button class="icon-btn sm danger" type="button" data-action="deleteMeasurement" data-id="${esc(m.id)}" aria-label="Hapus pengukuran ${esc(formatDate(m.date))}">${ic('trash')}</button>
                  </td>
                </tr>`).join('') : `
                <tr><td colspan="6"><div class="table-empty">Belum ada pengukuran. Saatnya mencatat yang pertama.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      </section>`;
  }

  /* =========================================================
     Halaman: Milestone
     ========================================================= */

  function milestoneItemMarkup(child, milestone) {
    const doneAt = milestoneDate(child.id, milestone.id);
    const inner = `
      <span class="milestone-check">${ic('check')}</span>
      <span class="milestone-copy">
        <strong>${esc(milestone.title)}</strong>
        <small>${doneAt ? `Tercatat ${formatDate(doneAt)} · ` : ''}${esc(milestone.tip)}</small>
      </span>`;
    if (READ_ONLY_MODE) {
      return `<div class="milestone-item is-static ${doneAt ? 'is-done' : ''}" aria-label="${esc(milestone.title)} — ${doneAt ? 'selesai' : 'belum ditandai'}">${inner}</div>`;
    }
    return `
      <button class="milestone-item ${doneAt ? 'is-done' : ''}" type="button" data-action="toggleMilestone" data-id="${esc(milestone.id)}" aria-pressed="${doneAt ? 'true' : 'false'}">
        ${inner}
      </button>`;
  }

  function renderMilestones(child) {
    const band = currentBand(child);
    const progress = bandProgress(child, band.id);
    const name = child.name.split(/\s+/)[0];
    const bandItems = bandMilestones(band.id);

    const domainCounts = DOMAIN_KEYS.map((key) => {
      const item = bandItems.find((m) => m.domain === key);
      const done = item && milestoneDate(child.id, item.id) ? 1 : 0;
      return { key, done, total: item ? 1 : 0 };
    });

    const focusCards = DOMAIN_KEYS.map((key) => {
      const domain = DOMAINS[key];
      const item = bandItems.find((m) => m.domain === key);
      if (!item) return '';
      return `
        <article class="card domain-card">
          <div class="domain-head">
            <span class="domain-icon" style="--domain-tint:${domain.tint};--domain-color:${domain.color}">${ic(domain.icon)}</span>
            <h3>${esc(domain.label)}</h3>
            <span class="domain-count">${milestoneDate(child.id, item.id) ? 'selesai' : 'fokus'}</span>
          </div>
          ${milestoneItemMarkup(child, item)}
        </article>`;
    }).join('');

    const allStages = AGE_BANDS.map((stage) => {
      const stageProgress = bandProgress(child, stage.id);
      const isCurrent = stage.id === band.id;
      return `
        <details class="stage-details ${isCurrent ? 'is-current' : ''}" ${isCurrent ? 'open' : ''}>
          <summary>
            <span class="stage-badge">${esc(stage.label)}</span>
            <strong>${isCurrent ? 'Tahap usia sekarang' : 'Tahap perkembangan'}</strong>
            <small>${stageProgress.done}/${stageProgress.total} selesai</small>
            ${ic('chevron-down', 'stage-chevron')}
          </summary>
          <div class="stage-body">
            ${DOMAIN_KEYS.map((key) => {
              const item = stage.id ? MILESTONES.find((m) => m.band === stage.id && m.domain === key) : null;
              if (!item) return '';
              return `
                <div class="stage-domain-label">${esc(DOMAINS[key].label)}</div>
                ${milestoneItemMarkup(child, item)}`;
            }).join('')}
          </div>
        </details>`;
    }).join('');

    return `
      <div class="view-head">
        <div>
          <p class="eyebrow">Milestone</p>
          <h1>Setiap tahap punya waktunya.</h1>
          <p class="view-sub">Checklist ini adalah panduan stimulasi, bukan ujian. Ikuti tempo ${esc(name)}, rayakan kemajuan kecilnya.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-ghost" type="button" data-action="addJournal">${ic('journal')} Catat pencapaian</button>
        </div>
      </div>

      <section class="milestone-summary">
        <div>
          <p class="eyebrow">Fokus usia ${esc(band.label)}</p>
          <h2>${progress.percent >= 100 ? `${esc(name)} sudah melewati tahap ini!` : `Yang sedang ${esc(name)} jelajahi.`}</h2>
          <p>${progress.done} dari ${progress.total} milestone pada tahap ini sudah ditandai. Tandai saat ${esc(name)} menunjukkan kemampuannya—tidak perlu terburu-buru.</p>
        </div>
        <div class="summary-ring-wrap">
          <div class="progress-ring summary-ring" style="--value:${progress.percent};--ring-color:var(--forest)">
            <div class="ring-inner"><strong>${progress.percent}%</strong><small>selesai</small></div>
          </div>
          <div class="summary-list">
            ${domainCounts.map(({ key, done, total }) => `
              <div class="summary-list-item">
                <i style="background:${DOMAINS[key].color}"></i>
                <span>${esc(DOMAINS[key].label)}</span>
                <strong>${done}/${total}</strong>
              </div>`).join('')}
          </div>
        </div>
      </section>

      <div class="milestone-toolbar">
        <div>
          <h2>${ui.milestoneMode === 'focus' ? 'Lima area perkembangan' : 'Semua tahap 0–6 tahun'}</h2>
          <p>${ui.milestoneMode === 'focus' ? 'Fokus pada usia sekarang, satu langkah kecil setiap hari.' : 'Lihat perjalanan lengkap dan tandai milestone yang sudah dilalui.'}</p>
        </div>
        <div class="tab-switch" role="tablist" aria-label="Tampilan milestone">
          <button type="button" role="tab" data-action="setMilestoneMode" data-mode="focus" class="${ui.milestoneMode === 'focus' ? 'active' : ''}" aria-selected="${ui.milestoneMode === 'focus'}">Fokus usia</button>
          <button type="button" role="tab" data-action="setMilestoneMode" data-mode="all" class="${ui.milestoneMode === 'all' ? 'active' : ''}" aria-selected="${ui.milestoneMode === 'all'}">Semua tahap</button>
        </div>
      </div>

      ${ui.milestoneMode === 'focus' ? `
        <div class="domain-grid">
          ${focusCards}
          <article class="card domain-card journal-domain-card">
            <span class="feature-icon" style="--tint:var(--coral-soft);--color:var(--coral-deep)">${ic('journal')}</span>
            <div>
              <h3>Ada cerita baru?</h3>
              <p>Pencapaian tidak selalu ada di daftar. Simpan momen kecil ${esc(name)} hari ini.</p>
            </div>
            <button class="text-link" type="button" data-action="addJournal">Tulis jurnal ${ic('arrow-right')}</button>
          </article>
        </div>` : `
        <div class="stage-stack">${allStages}</div>`}

      <div class="milestone-note">${ic('info')} Perkembangan setiap anak berbeda. Jika Bunda atau Ayah merasa ada yang perlu didiskusikan, konsultasikan dengan dokter anak, bidan, atau posyandu—tidak perlu menunggu sampai semua checklist tercentang.</div>`;
  }

  /* =========================================================
     Halaman: Imunisasi
     ========================================================= */

  function vaccineGroupsMarkup(child) {
    let list = VACCINES.slice().sort((a, b) => a.ageMonths - b.ageMonths);
    if (ui.immFilter === 'done') list = list.filter((v) => vaccineStatus(child, v) === 'done');
    if (ui.immFilter === 'upcoming') list = list.filter((v) => vaccineStatus(child, v) === 'upcoming');
    if (ui.immFilter === 'missed') list = list.filter((v) => vaccineStatus(child, v) === 'missed');
    if (!list.length) {
      return `<div class="card empty-inline" style="min-height:210px">
        <span class="empty-icon">${ic('shield')}</span>
        <strong>Tidak ada jadwal pada filter ini</strong>
        <p>Coba pilih filter lain untuk melihat seluruh jadwal imunisasi.</p>
      </div>`;
    }

    const groups = [];
    list.forEach((vaccine) => {
      let group = groups.find((g) => g.name === vaccine.group);
      if (!group) {
        group = { name: vaccine.group, items: [] };
        groups.push(group);
      }
      group.items.push(vaccine);
    });

    return groups.map((group) => {
      const all = group.items;
      const done = all.filter((v) => vaccineStatus(child, v) === 'done').length;
      return `
        <section class="card vax-group">
          <div class="vax-group-head">
            <span class="stage-badge">${esc(group.name)}</span>
            <h3>${group.name === 'Saat lahir' ? 'Langkah pertama' : `Usia ${group.name}`}</h3>
            <small>${done}/${all.length} tercatat</small>
          </div>
          ${all.map((vaccine) => {
            const status = vaccineStatus(child, vaccine);
            const record = vaccineRecord(child.id, vaccine.id);
            return `
              <div class="vax-row ${status === 'done' ? 'is-done' : ''} ${status === 'missed' ? 'is-missed' : ''}">
                <span class="vax-check">${status === 'done' ? ic('check') : (status === 'missed' ? ic('info') : '')}</span>
                <div class="vax-copy">
                  <strong>${esc(vaccine.name)} ${vaccine.optional ? '<span class="pill gold">Opsional</span>' : ''}</strong>
                  <small>${esc(vaccine.protects)}${record ? ` · dicatat ${esc(formatDate(record.date))}` : (vaccine.note ? ` · ${esc(vaccine.note)}` : '')}</small>
                </div>
                <div class="vax-age"><strong>${esc(vaccine.ageLabel)}</strong>Jadwal</div>
                <div class="vax-action">
                  ${status === 'done'
                    ? `<button class="btn btn-ghost btn-sm" type="button" data-action="editVaccine" data-id="${esc(vaccine.id)}" aria-label="Ubah catatan ${esc(vaccine.name)}">${ic('edit')} <span>Ubah</span></button>`
                    : `<button class="btn ${status === 'missed' ? 'btn-coral' : 'btn-soft'} btn-sm" type="button" data-action="markVaccine" data-id="${esc(vaccine.id)}" aria-label="Catat ${esc(vaccine.name)}">${ic('plus')} <span>Catat</span></button>`}
                </div>
              </div>`;
          }).join('')}
        </section>`;
    }).join('');
  }

  function renderImmunizations(child) {
    const counts = vaccineCounts(child);
    const name = child.name.split(/\s+/)[0];
    return `
      <div class="view-head">
        <div>
          <p class="eyebrow">Imunisasi</p>
          <h1>Perlindungan, selangkah demi selangkah.</h1>
          <p class="view-sub">Catat imunisasi ${esc(name)} agar jadwalnya tidak terlewat. Selalu ikuti anjuran tenaga kesehatan.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" type="button" data-action="markNextVaccine">${ic('shield')} Catat imunisasi</button>
        </div>
      </div>

      <section class="vax-hero">
        <div>
          <h2>${counts.missed ? `${counts.missed} jadwal perlu dilengkapi.` : 'Jadwal dasar sudah lengkap.'}</h2>
          <p>${counts.missed ? 'Beberapa jadwal sudah lewat dan belum tercatat. Jika sudah diberikan, lengkapi tanggalnya. Jika belum, diskusikan jadwal susulan dengan tenaga kesehatan.' : 'Semua jadwal imunisasi dasar tercatat. Jangan lupa simpan buku KIA dan catat imunisasi tambahan bila ada.'}</p>
        </div>
        <div class="vax-hero-stats">
          <div class="vax-stat done"><strong>${counts.completed}</strong><small>tercatat</small></div>
          <div class="vax-stat missed"><strong>${counts.missed}</strong><small>belum</small></div>
          <div class="vax-stat"><strong>${counts.upcoming}</strong><small>nanti</small></div>
        </div>
      </section>

      <div class="vax-toolbar">
        <div>
          <h2>Jadwal imunisasi dasar</h2>
          <p>Urutan umum 0–18 bulan · ${counts.completed}/${counts.total} tercatat</p>
        </div>
        <div class="filter-chips" role="group" aria-label="Filter imunisasi">
          <button type="button" class="filter-chip ${ui.immFilter === 'all' ? 'active' : ''}" data-action="setImmFilter" data-filter="all">Semua</button>
          <button type="button" class="filter-chip ${ui.immFilter === 'upcoming' ? 'active' : ''}" data-action="setImmFilter" data-filter="upcoming">Akan datang</button>
          <button type="button" class="filter-chip ${ui.immFilter === 'missed' ? 'active' : ''}" data-action="setImmFilter" data-filter="missed">Belum tercatat</button>
          <button type="button" class="filter-chip ${ui.immFilter === 'done' ? 'active' : ''}" data-action="setImmFilter" data-filter="done">Selesai</button>
        </div>
      </div>

      <div class="vax-groups">${vaccineGroupsMarkup(child)}</div>
      <div class="milestone-note">${ic('info')} Jadwal di atas adalah panduan umum imunisasi dasar. Ketersediaan jenis vaksin dan jadwal dapat berbeda menurut wilayah. Ikuti buku KIA serta rekomendasi dokter, bidan, atau posyandu setempat.</div>`;
  }

  /* =========================================================
     Halaman: Jurnal
     ========================================================= */

  function journalResultsHTML(child) {
    const query = ui.journalQuery.trim().toLowerCase();
    let entries = journalFor(child.id);
    if (ui.journalFilter !== 'all') entries = entries.filter((j) => j.category === ui.journalFilter);
    if (query) {
      entries = entries.filter((j) => `${j.title} ${j.note} ${CATEGORIES[j.category] ? CATEGORIES[j.category].label : ''}`.toLowerCase().includes(query));
    }
    if (!entries.length) {
      const hasFilter = ui.journalFilter !== 'all' || query;
      return `<div class="card empty-inline journal-empty" style="min-height:260px">
        <span class="empty-icon">${ic(hasFilter ? 'search' : 'journal')}</span>
        <strong>${hasFilter ? 'Belum ada cerita yang cocok' : 'Halaman cerita masih kosong'}</strong>
        <p>${hasFilter ? 'Coba kata kunci atau kategori lain.' : `Momen kecil ${esc(child.name.split(/\s+/)[0])} hari ini layak untuk disimpan.`}</p>
        ${hasFilter ? '' : `<button class="btn btn-soft btn-sm" type="button" data-action="addJournal" style="margin-top:12px">${ic('plus')} Tulis cerita pertama</button>`}
      </div>`;
    }

    const groups = [];
    entries.forEach((entry) => {
      const key = entry.date.slice(0, 7);
      let group = groups.find((g) => g.key === key);
      if (!group) {
        group = { key, label: formatMonth(`${key}-01`), entries: [] };
        groups.push(group);
      }
      group.entries.push(entry);
    });

    return groups.map((group) => `
      <section class="journal-month">
        <div class="journal-month-head">
          <h2>${esc(group.label)}</h2>
          <span></span>
          <small>${group.entries.length} cerita</small>
        </div>
        <div class="journal-grid">
          ${group.entries.map((entry) => {
            const category = CATEGORIES[entry.category] || CATEGORIES.note;
            return `
              <article class="journal-entry">
                <div class="entry-top">
                  <span class="pill ${category.pill}">${ic(category.icon)} ${esc(category.label)}</span>
                  <span class="entry-date">${esc(formatDate(entry.date, { year: undefined }))}</span>
                  <span class="entry-actions">
                    <button class="icon-btn sm" type="button" data-action="editJournal" data-id="${esc(entry.id)}" aria-label="Ubah catatan ${esc(entry.title)}">${ic('edit')}</button>
                    <button class="icon-btn sm danger" type="button" data-action="deleteJournal" data-id="${esc(entry.id)}" aria-label="Hapus catatan ${esc(entry.title)}">${ic('trash')}</button>
                  </span>
                </div>
                <h3>${esc(entry.title)}</h3>
                <p>${esc(entry.note || 'Tanpa catatan tambahan.')}</p>
                <div class="entry-bottom">${ic('baby')} Untuk ${esc(child.name.split(/\s+/)[0])} · ${esc(formatDate(entry.date, { year: 'numeric' }))}</div>
              </article>`;
          }).join('')}
        </div>
      </section>`).join('');
  }

  function renderJournal(child) {
    const name = child.name.split(/\s+/)[0];
    const total = journalFor(child.id).length;
    return `
      <div class="view-head">
        <div>
          <p class="eyebrow">Jurnal kecil</p>
          <h1>Cerita yang ingin diingat.</h1>
          <p class="view-sub">Kalimat pertama, tawa hari ini, atau malam yang panjang. Semua layak menjadi kenangan.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" type="button" data-action="addJournal">${ic('plus')} Tulis jurnal</button>
        </div>
      </div>

      <section class="journal-feature">
        <div class="journal-feature-copy">
          <span class="journal-feature-icon">${ic('sparkles')}</span>
          <div>
            <strong>Apa hal baru yang dilakukan ${esc(name)} hari ini?</strong>
            <p>Satu paragraf kecil sudah cukup. ${total ? `${total} cerita sudah tersimpan.` : 'Mulai dari momen paling sederhana.'}</p>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" type="button" data-action="addJournal">${ic('plus')} Tambah cerita</button>
      </section>

      <div class="journal-toolbar">
        <div class="filter-chips" role="group" aria-label="Filter jurnal">
          <button type="button" class="filter-chip ${ui.journalFilter === 'all' ? 'active' : ''}" data-action="setJournalFilter" data-filter="all">Semua</button>
          ${Object.entries(CATEGORIES).map(([key, category]) => `<button type="button" class="filter-chip ${ui.journalFilter === key ? 'active' : ''}" data-action="setJournalFilter" data-filter="${key}">${esc(category.label)}</button>`).join('')}
        </div>
        <label class="search-box">
          <span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Cari jurnal</span>
          ${ic('search')}
          <input type="search" id="journalSearch" placeholder="Cari cerita..." value="${esc(ui.journalQuery)}" autocomplete="off" />
        </label>
      </div>

      <div id="journalResults">${journalResultsHTML(child)}</div>`;
  }

  /* =========================================================
     Halaman: Pengaturan
     ========================================================= */

  function renderSettings() {
    const bytes = new Blob([JSON.stringify(state)]).size;
    const kb = Math.max(1, Math.round(bytes / 1024));
    const maxKb = 5 * 1024;
    const percent = clamp((kb / maxKb) * 100, 1, 100);
    const active = activeChild();
    return `
      <div class="view-head">
        <div>
          <p class="eyebrow">Pengaturan</p>
          <h1>Profil &amp; data keluarga.</h1>
          <p class="view-sub">Kelola profil anak, cadangkan data, atau atur sinkronisasi keluarga lewat Netlify.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" type="button" data-action="addChild">${ic('plus')} Tambah profil anak</button>
        </div>
      </div>

      <div class="settings-grid">
        <div>
          <section class="card settings-section">
            <div class="settings-title-row">
              <div><h2>Profil anak</h2><p>${state.children.length} profil terdaftar di perangkat ini.</p></div>
              <span class="pill">${state.children.length} anak</span>
            </div>
            <div class="profiles-list">
              ${state.children.map((child) => {
                const measurements = state.measurements.filter((m) => m.childId === child.id).length;
                return `
                  <div class="profile-card ${child.id === state.activeChildId ? 'is-active' : ''}">
                    ${avatarHTML(child)}
                    <div class="profile-card-copy">
                      <strong>${esc(child.name)} ${child.id === state.activeChildId ? '<span class="pill green">Aktif</span>' : ''}</strong>
                      <small>${esc(formatAge(child.birthDate))} · lahir ${esc(formatDate(child.birthDate))} · ${measurements} pengukuran</small>
                    </div>
                    <div class="profile-card-actions">
                      <button class="icon-btn sm" type="button" data-action="editChild" data-id="${esc(child.id)}" aria-label="Ubah profil ${esc(child.name)}">${ic('edit')}</button>
                      <button class="icon-btn sm danger" type="button" data-action="deleteChild" data-id="${esc(child.id)}" aria-label="Hapus profil ${esc(child.name)}">${ic('trash')}</button>
                    </div>
                  </div>`;
              }).join('') || ''}
              <button class="add-profile-tile" type="button" data-action="addChild">${ic('plus')} Tambah profil anak baru</button>
            </div>
          </section>

          <section class="card settings-section" style="margin-top:16px">
            <div class="settings-title-row">
              <div><h2>Cadangan &amp; pemulihan</h2><p>Simpan salinan data dalam satu berkas JSON.</p></div>
            </div>
            <div class="data-row">
              <span class="data-row-icon">${ic('cloud')}</span>
              <span class="data-row-copy"><strong>Sinkronisasi keluarga</strong><small>${CLOUD.authenticated ? `Satu akun keluarga · ${cloudStatusInfo().label.toLowerCase()}` : 'Atur akun dan tautan lihat-saja lewat Netlify.'}</small></span>
              <button class="btn btn-ghost btn-sm" type="button" data-action="goView" data-view="family">${ic('arrow-right')} Buka</button>
            </div>
            <div class="data-row">
              <span class="data-row-icon">${ic('download')}</span>
              <span class="data-row-copy"><strong>Ekspor data</strong><small>Semua profil, pengukuran, milestone, imunisasi, dan jurnal.</small></span>
              <button class="btn btn-ghost btn-sm" type="button" data-action="exportData">${ic('download')} Ekspor</button>
            </div>
            <div class="data-row">
              <span class="data-row-icon">${ic('upload')}</span>
              <span class="data-row-copy"><strong>Impor data</strong><small>Ganti data saat ini dengan berkas cadangan Tumbuh.</small></span>
              <button class="btn btn-ghost btn-sm" type="button" data-action="importData">${ic('upload')} Impor</button>
            </div>
            <div class="data-row">
              <span class="data-row-icon">${ic('sparkles')}</span>
              <span class="data-row-copy"><strong>Data contoh</strong><small>${CLOUD.authenticated ? 'Keluar dari akun keluarga untuk mencoba data contoh tanpa mengubah data bersama.' : 'Jelajahi aplikasi dengan profil dan cerita contoh.'}</small></span>
              <button class="btn btn-ghost btn-sm" type="button" data-action="loadDemo" ${CLOUD.authenticated ? 'disabled' : ''}>${ic(CLOUD.authenticated ? 'lock' : 'sparkles')} ${CLOUD.authenticated ? 'Terkunci' : 'Muat'}</button>
            </div>
          </section>
        </div>

        <aside>
          <section class="card settings-section">
            <div class="settings-title-row">
              <div><h2>Data di perangkat</h2><p>Disimpan lokal melalui penyimpanan browser.</p></div>
            </div>
            <div class="storage-meter">
              <div class="storage-meter-label"><span>Pemakaian perkiraan</span><span>${kb} KB / ±5 MB</span></div>
              <div class="progress-track"><div class="progress-fill lime" style="width:${percent}%"></div></div>
            </div>
            <div class="data-row" style="padding-top:8px">
              <span class="data-row-copy"><small>${state.children.length} profil · ${state.measurements.length} pengukuran · ${state.journal.length} cerita jurnal</small></span>
            </div>
            <div class="danger-zone">
              <h3>Mulai dari awal</h3>
              <p>Menghapus semua profil dan catatan dari browser ini. Ekspor cadangan terlebih dahulu bila diperlukan.</p>
              <button class="btn btn-danger btn-sm" type="button" data-action="resetData">${ic('trash')} Hapus semua data</button>
            </div>
          </section>

          <section class="card about-section" style="margin-top:16px">
            <div class="about-mark">
              <span class="brand-mark">${'<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-sprout"></use></svg>'}</span>
              <div><strong>tumbuh</strong><br /><small style="font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">catatan perkembangan</small></div>
            </div>
            <p>Satu tempat tenang untuk mencatat pertumbuhan, milestone, imunisasi, dan cerita kecil anak.</p>
            <p class="disclaimer">Tumbuh bukan alat diagnosis medis. Isi aplikasi bersifat panduan umum dan tidak menggantikan konsultasi dengan dokter, bidan, atau posyandu. Data tersimpan di browser ini; bila sinkronisasi aktif, salinannya juga tersimpan di Netlify Blobs. Menghapus data browser dapat menghapus catatan lokal.</p>
            <div class="version-line"><span>Versi 1.1 · Netlify Sync</span><span>Dibuat untuk Bunda &amp; Ayah</span></div>
          </section>
        </aside>
      </div>`;
  }

  /* =========================================================
     Halaman: Keluarga & sinkronisasi
     ========================================================= */

  function renderCloudSetupGuide(kind) {
    const isLocal = kind === 'local';
    const isBackend = kind === 'backend';
    return `
      <div class="cloud-layout">
        <section class="card cloud-card cloud-setup-card">
          <div class="cloud-card-head">
            <span class="cloud-card-icon">${ic(isBackend ? 'server' : 'cloud')}</span>
            <div>
              <h2>${isLocal ? 'Aktifkan lewat Netlify' : isBackend ? 'Functions belum terpasang' : 'Lengkapi pengaturan Netlify'}</h2>
              <p>${isLocal ? 'Aplikasi ini sedang dibuka dari berkas lokal. Sinkronisasi dan tautan lihat-saja hanya aktif setelah dipasang di Netlify.' : isBackend ? 'Situs statis sudah tampil, tetapi API-nya belum tersedia. Deploy ulang dari Git atau Netlify CLI agar folder functions ikut terbawa.' : 'Dua environment variable diperlukan sebelum akun keluarga bisa dipakai.'}</p>
            </div>
          </div>
          <div class="cloud-setup-list">
            <div class="cloud-setup-step">
              <span>01</span>
              <div><strong>Deploy folder ini ke Netlify</strong><p>GitHub tidak wajib. Jalankan <code class="inline-code">netlify deploy --build --prod</code>, atau hubungkan repo Git agar deploy otomatis. Pastikan folder <code class="inline-code">netlify/functions</code> ikut terunggah.</p></div>
            </div>
            <div class="cloud-setup-step">
              <span>02</span>
              <div><strong>Tambahkan environment variables</strong>
                <p>Di <em>Site configuration → Environment variables</em>, isi dua nilai berikut:</p>
                <div class="cloud-code-block"><code>TUMBUH_EDIT_PASSWORD=...kata sandi keluarga...</code><code>TUMBUH_SESSION_SECRET=...teks acak panjang...</code></div>
                <p class="cloud-hint">Buat secret dengan <code class="inline-code">openssl rand -base64 32</code>. Gunakan kata sandi keluarga yang panjang dan tidak dipakai di tempat lain.</p>
              </div>
            </div>
            <div class="cloud-setup-step">
              <span>03</span>
              <div><strong>Redeploy, lalu masuk</strong><p>Setelah redeploy, muat ulang halaman ini. Masuk dengan kata sandi keluarga, lalu buat tautan lihat-saja dari halaman Keluarga.</p></div>
            </div>
          </div>
        </section>

        <aside class="card cloud-card cloud-side-card">
          <span class="cloud-side-mark">${ic('shield')}</span>
          <h3>Kenapa lewat Netlify?</h3>
          <ul class="cloud-list">
            <li>${ic('check')} Satu akun keluarga untuk semua perangkat yang mengedit.</li>
            <li>${ic('check')} Fungsi dan penyimpanan berjalan di Netlify Functions + Blobs.</li>
            <li>${ic('check')} Tautan publik terpisah dan hanya bisa melihat.</li>
            <li>${ic('check')} Tidak perlu database atau layanan tambahan.</li>
          </ul>
          <div class="cloud-privacy-note">${ic('lock')} Kata sandi tidak disimpan di browser. Sesi memakai cookie HttpOnly yang ditandatangani server.</div>
        </aside>
      </div>`;
  }

  function renderCloudLogin() {
    return `
      <div class="cloud-auth-grid">
        <section class="card cloud-card cloud-login-card">
          <span class="cloud-lock-mark">${ic('lock')}</span>
          <p class="eyebrow">Akun keluarga</p>
          <h2>Masuk untuk mengedit.</h2>
          <p class="cloud-login-lede">Satu kata sandi keluarga dipakai di semua perangkat yang boleh mengubah catatan. Tautan lihat-saja tidak memerlukan kata sandi.</p>
          <form id="cloudLoginForm" novalidate autocomplete="on">
            <div class="form-field">
              <label for="cloudPassword">Kata sandi keluarga</label>
              <input class="input" id="cloudPassword" name="password" type="password" autocomplete="current-password" placeholder="Masukkan kata sandi" required />
            </div>
            <p class="cloud-inline-error" ${CLOUD.authMessage ? '' : 'hidden'}>${esc(CLOUD.authMessage || '')}</p>
            <button class="btn btn-primary btn-block" type="submit">${ic('log-in')} Masuk</button>
          </form>
          <p class="cloud-fineprint">Lupa kata sandi? Ganti <code class="inline-code">TUMBUH_EDIT_PASSWORD</code> dan <code class="inline-code">TUMBUH_SESSION_SECRET</code> di Netlify, lalu redeploy. Mengganti secret akan mengakhiri semua sesi lama.</p>
        </section>

        <aside class="card cloud-card cloud-side-card">
          <span class="cloud-side-mark">${ic('users')}</span>
          <h3>Untuk keluarga, bukan publik.</h3>
          <p class="cloud-side-lede">Catatan pertumbuhan anak adalah cerita pribadi. Hanya perangkat dengan akun keluarga yang dapat mengubahnya.</p>
          <ul class="cloud-list">
            <li>${ic('check')} Edit dari HP, laptop, atau tablet.</li>
            <li>${ic('check')} Tautan lihat-saja bisa dicabut kapan saja.</li>
            <li>${ic('check')} Data tetap bisa dicatat saat offline.</li>
          </ul>
          <div class="cloud-privacy-note">${ic('shield')} Jangan bagikan kata sandi keluarga. Buat tautan lihat-saja untuk anggota yang hanya perlu melihat.</div>
        </aside>
      </div>`;
  }

  function renderCloudLoading() {
    return `
      <div class="card cloud-loading-card">
        <span class="cloud-loading-mark">${ic('cloud')}</span>
        <h2>Memeriksa akun keluarga...</h2>
        <p>Kami menghubungkan perangkat ini ke Netlify. Data lokal tetap aman.</p>
        <div class="share-loader"><span></span><span></span><span></span></div>
      </div>`;
  }

  function renderCloudConflict() {
    if (!CLOUD.conflict) return '';
    const remote = CLOUD.conflict.remote;
    const localCount = CLOUD.conflict.localChildren != null ? CLOUD.conflict.localChildren : state.children.length;
    const remoteCount = CLOUD.conflict.remoteChildren != null ? CLOUD.conflict.remoteChildren : (remote && remote.data && remote.data.children ? remote.data.children.length : 0);
    return `
      <section class="card cloud-conflict">
        <div class="cloud-conflict-head">
          <span class="cloud-conflict-icon">${ic('info')}</span>
          <div>
            <span class="pill coral">Perlu keputusan</span>
            <h2>Data di perangkat dan di Netlify berbeda.</h2>
            <p>Pilih satu versi. Tindakan ini memengaruhi semua perangkat yang memakai akun keluarga dan tautan lihat-saja.</p>
          </div>
        </div>
        <div class="cloud-conflict-compare">
          <div><small>Perangkat ini</small><strong>${localCount} profil</strong><span>${state.measurements.length} pengukuran · ${state.journal.length} cerita</span></div>
          <span class="cloud-vs">vs</span>
          <div><small>Data Netlify</small><strong>${remoteCount} profil</strong><span>Diperbarui ${esc(relativeSyncTime(remote && remote.updatedAt))}</span></div>
        </div>
        <div class="cloud-conflict-actions">
          <button class="btn btn-ghost" type="button" data-action="cloudUseCloud">${ic('cloud-check')} Pakai data Netlify</button>
          <button class="btn btn-danger" type="button" data-action="cloudKeepLocal">${ic('upload')} Timpa dengan data perangkat</button>
        </div>
      </section>`;
  }

  function renderCloudWorkspace() {
    const info = cloudStatusInfo();
    const share = CLOUD.share;
    const url = cloudShareUrl();
    const shareEnabled = Boolean(share && share.enabled);
    return `
      ${renderCloudConflict()}
      <div class="cloud-workspace">
        <section class="card cloud-card cloud-share-card">
          <div class="cloud-card-head">
            <span class="cloud-card-icon coral">${ic('link')}</span>
            <div>
              <h2>Tautan lihat-saja</h2>
              <p>Bagikan ke kakek, nenek, atau anggota keluarga yang cukup melihat. Penerima tautan tidak bisa mengubah data.</p>
            </div>
            <span class="cloud-badge ${shareEnabled ? 'on' : 'off'}"><i></i>${shareEnabled ? 'Aktif' : 'Nonaktif'}</span>
          </div>
          ${url ? `
            <div class="share-link-box">
              <input id="shareLinkInput" type="text" readonly value="${esc(url)}" aria-label="Tautan lihat-saja" />
              <button class="btn btn-soft btn-sm" type="button" data-action="shareCopy" ${shareEnabled ? '' : 'disabled'}>${ic('copy')} Salin</button>
            </div>
            <div class="share-link-actions">
              <button class="btn btn-ghost btn-sm" type="button" data-action="shareOpen" ${shareEnabled ? '' : 'disabled'}>${ic('arrow-up-right')} Buka</button>
              <button class="btn btn-ghost btn-sm" type="button" data-action="shareRotate">${ic('refresh')} Ganti tautan</button>
              <button class="btn ${shareEnabled ? 'btn-ghost' : 'btn-soft'} btn-sm" type="button" data-action="shareToggle">${ic(shareEnabled ? 'cloud-off' : 'cloud-check')} ${shareEnabled ? 'Nonaktifkan' : 'Aktifkan'}</button>
            </div>
            <p class="cloud-fineprint">${shareEnabled ? 'Siapa pun yang memiliki tautan dapat melihat seluruh data keluarga, termasuk jurnal. Bagikan hanya kepada orang yang dipercaya.' : 'Tautan saat ini tidak dapat dibuka. Aktifkan kembali atau buat tautan baru.'}</p>
          ` : `
            <div class="cloud-empty-share">
              <p>Belum ada tautan lihat-saja. Buat satu tautan acak yang bisa dicabut kapan saja.</p>
              <button class="btn btn-soft btn-sm" type="button" data-action="shareRotate">${ic('link')} Buat tautan</button>
            </div>`}
        </section>

        <aside class="cloud-side">
          <section class="card cloud-card cloud-sync-card">
            <div class="cloud-card-head">
              <span class="cloud-card-icon green">${ic('refresh')}</span>
              <div><h2>Status sinkronisasi</h2><p>${esc(info.label)}</p></div>
            </div>
            <div class="cloud-sync-status">
              <span class="cloud-status-dot ${esc(info.tone)}"></span>
              <div><strong>${esc(info.title)}</strong><span>${esc(info.description)}</span></div>
            </div>
            <div class="cloud-meta-grid">
              <div><small>Terakhir sinkron</small><strong>${esc(relativeSyncTime(CLOUD.lastSyncAt))}</strong></div>
              <div><small>Data lokal</small><strong>${state.children.length} profil</strong><span>${state.measurements.length} pengukuran · ${state.journal.length} jurnal</span></div>
            </div>
            <div class="cloud-sync-actions">
              <button class="btn btn-primary btn-sm" type="button" data-action="cloudSync" ${CLOUD.syncing || CLOUD.conflict ? 'disabled' : ''}>${ic('refresh')} Sinkronkan sekarang</button>
            </div>
            <p class="cloud-fineprint">${CLOUD.pending ? 'Ada perubahan lokal yang menunggu dikirim. Sinkronisasi otomatis berjalan setelah ada koneksi.' : 'Perubahan dikirim otomatis setelah disimpan. Pemeriksaan data baru dilakukan setiap 20 detik saat tab aktif.'}</p>
          </section>

          <section class="card cloud-card cloud-account-card">
            <div class="cloud-account-head">${ic('users')} <div><strong>Akun keluarga</strong><span>Satu akun untuk semua editor</span></div></div>
            <p>Perangkat ini masuk sebagai akun keluarga. Siapa pun yang memiliki kata sandi dapat mengedit dan melihat tautan lihat-saja.</p>
            <button class="btn btn-ghost btn-sm" type="button" data-action="cloudLogout">${ic('log-out')} Keluar dari akun</button>
          </section>
        </aside>
      </div>`;
  }

  function renderFamily() {
    const info = cloudStatusInfo();
    let body;
    if (CLOUD.status === 'local') body = renderCloudSetupGuide('local');
    else if (CLOUD.status === 'setup') body = renderCloudSetupGuide('setup');
    else if (CLOUD.status === 'backend-missing') body = renderCloudSetupGuide('backend');
    else if (CLOUD.status === 'loading') body = renderCloudLoading();
    else if (!CLOUD.authenticated) body = renderCloudLogin();
    else body = renderCloudWorkspace();

    return `
      <div class="view-head">
        <div>
          <p class="eyebrow">Keluarga &amp; sinkronisasi</p>
          <h1>Satu akun, satu cerita keluarga.</h1>
          <p class="view-sub">Edit dari perangkat yang masuk dengan akun keluarga. Bagikan tautan lihat-saja tanpa memberi akses edit.</p>
        </div>
        <div class="view-actions">
          ${CLOUD.authenticated ? `<button class="btn btn-primary" type="button" data-action="cloudSync" ${CLOUD.syncing || CLOUD.conflict ? 'disabled' : ''}>${ic('refresh')} Sinkronkan</button>` : ''}
        </div>
      </div>
      <section class="cloud-hero tone-${esc(info.tone)}">
        <div class="cloud-hero-copy">
          <span class="cloud-hero-kicker">${ic('cloud')} Tumbuh Cloud</span>
          <h2>${esc(info.title)}</h2>
          <p>${esc(info.description)}</p>
          <div class="cloud-hero-chips">
            <span>${ic('users')} Satu akun</span>
            <span>${ic('link')} Tautan lihat-saja</span>
            <span>${ic('shield')} Data privat</span>
          </div>
        </div>
        <span class="cloud-status-badge tone-${esc(info.tone)}"><i></i>${esc(info.label)}</span>
      </section>
      ${body}`;
  }

  /* =========================================================
     Kerangka aplikasi
     ========================================================= */

  function profileMenuMarkup(child) {
    if (READ_ONLY_MODE) {
      if (!state.children.length) {
        return `<p class="profile-menu-label">Profil anak</p><p class="cloud-fineprint" style="padding:2px 10px 8px">Belum ada profil.</p>`;
      }
      return `
        <p class="profile-menu-label">Profil anak</p>
        ${state.children.map((item) => `
          <button class="profile-menu-item" type="button" data-action="switchChild" data-id="${esc(item.id)}">
            ${avatarHTML(item, 'avatar-sm')}
            <span class="menu-copy">
              <strong>${esc(item.name)}</strong>
              <small>${esc(formatAgeCompact(item.birthDate))}</small>
            </span>
            ${item.id === (child && child.id) ? ic('check', 'check-icon') : ''}
          </button>`).join('')}`;
    }
    if (!state.children.length) {
      return `
        <p class="profile-menu-label">Profil anak</p>
        <button class="profile-menu-action" type="button" data-action="addChild">${ic('plus')} Tambah profil pertama</button>
        <div class="profile-menu-divider"></div>
        <button class="profile-menu-action" type="button" data-action="goView" data-view="settings">${ic('settings')} Pengaturan &amp; data</button>`;
    }
    return `
      <p class="profile-menu-label">Profil anak</p>
      ${state.children.map((item) => `
        <button class="profile-menu-item" type="button" data-action="switchChild" data-id="${esc(item.id)}">
          ${avatarHTML(item, 'avatar-sm')}
          <span class="menu-copy">
            <strong>${esc(item.name)}</strong>
            <small>${esc(formatAgeCompact(item.birthDate))}</small>
          </span>
          ${item.id === (child && child.id) ? ic('check', 'check-icon') : ''}
        </button>`).join('')}
      <div class="profile-menu-divider"></div>
      <button class="profile-menu-action" type="button" data-action="addChild">${ic('plus')} Tambah profil anak</button>
      <button class="profile-menu-action" type="button" data-action="goView" data-view="settings">${ic('settings')} Kelola profil &amp; data</button>`;
  }

  function updateChrome(child) {
    let effectiveView = ui.view;
    if (!child && !['settings', 'family'].includes(ui.view)) effectiveView = 'dashboard';
    if (READ_ONLY_MODE && ['settings', 'family'].includes(effectiveView)) effectiveView = 'dashboard';
    $$('.nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.nav === effectiveView);
    });
    let crumb;
    if (READ_ONLY_MODE && (SHARE_LOADING || SHARE_ERROR)) crumb = 'Lihat saja';
    else if (!child && !['settings', 'family'].includes(ui.view)) crumb = 'Mulai';
    else crumb = VIEW_META[ui.view] ? VIEW_META[ui.view].crumb : 'Ringkasan';
    $('#pageCrumb').textContent = crumb;
    $('#headerDateText').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const switchAvatar = $('#switchAvatar');
    const switchName = $('#switchName');
    const switchAge = $('#switchAge');
    if (child) {
      switchAvatar.textContent = initials(child.name);
      switchAvatar.style.background = child.color;
      switchName.textContent = child.name;
      switchAge.textContent = formatAge(child.birthDate);
    } else {
      switchAvatar.textContent = 'T';
      switchAvatar.style.background = '#8a9991';
      switchName.textContent = 'Profil anak';
      switchAge.textContent = 'Tambahkan profil';
    }
    $('#profileMenu').innerHTML = profileMenuMarkup(child);
    $('#profileMenu').hidden = !ui.profileOpen;
    $('#profileSwitch').setAttribute('aria-expanded', String(ui.profileOpen));
    $('#profileSwitchWrap').classList.toggle('is-hidden', READ_ONLY_MODE && (SHARE_LOADING || Boolean(SHARE_ERROR) || !child));
    if (READ_ONLY_MODE) {
      $('#syncChip').hidden = true;
    }
    document.title = READ_ONLY_MODE ? 'Lihat saja · Tumbuh' : `${crumb} · Tumbuh`;
  }

  function renderApp({ preserveScroll = false, animate = true } = {}) {
    const scrollY = window.scrollY;
    const child = activeChild();
    updateChrome(child);
    let content;
    if (READ_ONLY_MODE) {
      if (SHARE_LOADING) content = renderShareLoading();
      else if (SHARE_ERROR) content = renderShareError();
      else if (['settings', 'family'].includes(ui.view)) content = renderReadonlyBlocked();
      else if (!child) content = renderShareError();
      else if (ui.view === 'growth') content = renderGrowth(child);
      else if (ui.view === 'milestones') content = renderMilestones(child);
      else if (ui.view === 'immunizations') content = renderImmunizations(child);
      else if (ui.view === 'journal') content = renderJournal(child);
      else content = renderDashboard(child);
    } else if (!child && !['settings', 'family'].includes(ui.view)) content = renderWelcome();
    else if (ui.view === 'growth') content = renderGrowth(child);
    else if (ui.view === 'milestones') content = renderMilestones(child);
    else if (ui.view === 'immunizations') content = renderImmunizations(child);
    else if (ui.view === 'journal') content = renderJournal(child);
    else if (ui.view === 'family') content = renderFamily();
    else if (ui.view === 'settings') content = renderSettings();
    else content = renderDashboard(child);

    $('#mainContent').innerHTML = `<div class="view${animate ? '' : ' no-anim'}">${content}</div>`;
    hydrateCharts();
    if (preserveScroll) window.scrollTo({ top: scrollY, behavior: 'auto' });
  }

  /* =========================================================
     Modal: profil anak
     ========================================================= */

  function openChildModal(childId = null) {
    const editing = childId ? getChild(childId) : null;
    const selectedColor = editing ? editing.color : COLORS[0];
    const selectedSex = editing ? editing.sex : 'L';
    openModal({
      kicker: editing ? 'Profil anak' : 'Mulai dari sini',
      title: editing ? 'Ubah profil anak' : 'Kenalan dulu, yuk.',
      subtitle: editing ? 'Perbarui data dasar anak. Usia dan tahapan akan menyesuaikan.' : 'Cukup nama panggilan dan tanggal lahir untuk mulai mencatat.',
      body: `
        <form id="childForm" novalidate autocomplete="off">
          <input type="hidden" name="id" value="${editing ? esc(editing.id) : ''}" />
          <div class="form-grid">
            <div class="form-field full">
              <label for="childName">Nama panggilan <span>wajib</span></label>
              <input class="input" id="childName" name="name" type="text" maxlength="40" placeholder="Misal: Raka" value="${editing ? esc(editing.name) : ''}" required />
              <p class="form-hint">Nama ini akan tampil di seluruh catatan.</p>
            </div>
            <div class="form-field">
              <span class="field-label">Jenis kelamin <span>wajib</span></span>
              <div class="sex-options">
                <label class="sex-option">
                  <input type="radio" name="sex" value="L" ${selectedSex === 'L' ? 'checked' : ''} />
                  <span>${ic('baby')} Laki-laki</span>
                </label>
                <label class="sex-option">
                  <input type="radio" name="sex" value="P" ${selectedSex === 'P' ? 'checked' : ''} />
                  <span>${ic('heart')} Perempuan</span>
                </label>
              </div>
            </div>
            <div class="form-field">
              <label for="birthDate">Tanggal lahir <span>wajib</span></label>
              <input class="input" id="birthDate" name="birthDate" type="date" max="${todayISO()}" value="${editing ? esc(editing.birthDate) : ''}" required />
            </div>
            <div class="form-field full">
              <span class="field-label">Warna profil <span>pilih favorit</span></span>
              <div class="color-options">
                ${COLORS.map((color, index) => `
                  <label class="color-option" aria-label="Warna ${index + 1}">
                    <input type="radio" name="color" value="${color}" ${selectedColor === color ? 'checked' : ''} />
                    <span style="--swatch:${color}"></span>
                  </label>`).join('')}
              </div>
            </div>
          </div>
        </form>`,
      footer: `
        <button class="btn btn-ghost" type="button" data-action="closeModal">Batal</button>
        <button class="btn btn-primary" type="submit" form="childForm">${editing ? 'Simpan perubahan' : 'Buat profil'}</button>`
    });
  }

  function handleChildSubmit(form) {
    clearFormErrors(form);
    const data = new FormData(form);
    const id = String(data.get('id') || '');
    const name = String(data.get('name') || '').trim().replace(/\s+/g, ' ');
    const sex = String(data.get('sex') || '');
    const birthDate = String(data.get('birthDate') || '');
    const color = String(data.get('color') || COLORS[0]);
    let valid = true;

    if (!name) { showFieldError(form, 'name', 'Nama panggilan wajib diisi.'); valid = false; }
    if (name.length < 2) { showFieldError(form, 'name', 'Gunakan minimal 2 karakter.'); valid = false; }
    if (sex !== 'L' && sex !== 'P') { showFieldError(form, 'sex', 'Pilih jenis kelamin.'); valid = false; }
    if (!birthDate) { showFieldError(form, 'birthDate', 'Tanggal lahir wajib diisi.'); valid = false; }
    else if (!isValidISODate(birthDate)) { showFieldError(form, 'birthDate', 'Format tanggal belum tepat.'); valid = false; }
    else if (birthDate > todayISO()) { showFieldError(form, 'birthDate', 'Tanggal lahir tidak boleh di masa depan.'); valid = false; }
    if (!COLORS.includes(color)) { showFieldError(form, 'color', 'Pilih warna profil.'); valid = false; }
    if (!valid) return;

    if (id) {
      const child = getChild(id);
      if (!child) return;
      child.name = name;
      child.sex = sex;
      child.birthDate = birthDate;
      child.color = color;
      saveState();
      closeModal();
      renderApp();
      toast('Profil berhasil diperbarui.');
    } else {
      const newChild = {
        id: uid(),
        name,
        sex,
        birthDate,
        color,
        createdAt: new Date().toISOString()
      };
      state.children.push(newChild);
      state.activeChildId = newChild.id;
      state.milestones[newChild.id] = {};
      state.immunizations[newChild.id] = {};
      saveState();
      closeModal();
      ui.view = 'dashboard';
      if (location.hash !== '#dashboard') location.hash = '#dashboard';
      else renderApp();
      toast(`Profil ${name} berhasil dibuat.`);
    }
  }

  /* =========================================================
     Modal: pengukuran
     ========================================================= */

  function openMeasurementModal(measurementId = null) {
    const child = activeChild();
    if (!child) { openChildModal(); return; }
    const editing = measurementId ? state.measurements.find((m) => m.id === measurementId) : null;
    openModal({
      kicker: 'Catatan pertumbuhan',
      title: editing ? 'Ubah pengukuran' : 'Catat pengukuran baru',
      subtitle: `Untuk ${esc(child.name)} · ${esc(formatAge(child.birthDate))}`,
      body: `
        <form id="measurementForm" novalidate autocomplete="off">
          <input type="hidden" name="id" value="${editing ? esc(editing.id) : ''}" />
          <div class="form-grid">
            <div class="form-field full">
              <label for="measureDate">Tanggal pengukuran <span>wajib</span></label>
              <input class="input" id="measureDate" name="date" type="date" min="${esc(child.birthDate)}" max="${todayISO()}" value="${editing ? esc(editing.date) : todayISO()}" required />
            </div>
            <div class="form-field">
              <label for="weight">Berat badan</label>
              <div class="input-group">
                <input class="input" id="weight" name="weight" type="number" min="0.5" max="100" step="0.1" inputmode="decimal" placeholder="13,2" value="${editing && editing.weight != null ? esc(editing.weight) : ''}" />
                <span class="input-suffix">kg</span>
              </div>
            </div>
            <div class="form-field">
              <label for="height">Tinggi badan</label>
              <div class="input-group">
                <input class="input" id="height" name="height" type="number" min="20" max="200" step="0.1" inputmode="decimal" placeholder="92,5" value="${editing && editing.height != null ? esc(editing.height) : ''}" />
                <span class="input-suffix">cm</span>
              </div>
            </div>
            <div class="form-field">
              <label for="head">Lingkar kepala <span>opsional</span></label>
              <div class="input-group">
                <input class="input" id="head" name="head" type="number" min="20" max="80" step="0.1" inputmode="decimal" placeholder="48,4" value="${editing && editing.head != null ? esc(editing.head) : ''}" />
                <span class="input-suffix">cm</span>
              </div>
            </div>
            <div class="form-field full">
              <label for="measureNote">Catatan <span>opsional</span></label>
              <textarea class="textarea" id="measureNote" name="note" maxlength="500" placeholder="Misal: ditimbang pagi hari sebelum sarapan.">${editing ? esc(editing.note) : ''}</textarea>
            </div>
          </div>
        </form>`,
      footer: `
        <button class="btn btn-ghost" type="button" data-action="closeModal">Batal</button>
        <button class="btn btn-primary" type="submit" form="measurementForm">${editing ? 'Simpan perubahan' : 'Simpan pengukuran'}</button>`
    });
  }

  function handleMeasurementSubmit(form) {
    clearFormErrors(form);
    const child = activeChild();
    if (!child) return;
    const data = new FormData(form);
    const id = String(data.get('id') || '');
    const date = String(data.get('date') || '');
    const weight = toNullableNumber(data.get('weight'));
    const height = toNullableNumber(data.get('height'));
    const head = toNullableNumber(data.get('head'));
    const note = String(data.get('note') || '').trim();
    let valid = true;

    if (!date) { showFieldError(form, 'date', 'Tanggal pengukuran wajib diisi.'); valid = false; }
    else if (!isValidISODate(date)) { showFieldError(form, 'date', 'Format tanggal belum tepat.'); valid = false; }
    else if (date < child.birthDate) { showFieldError(form, 'date', `Tanggal tidak boleh sebelum ${formatDate(child.birthDate)}.`); valid = false; }
    else if (date > todayISO()) { showFieldError(form, 'date', 'Tanggal tidak boleh di masa depan.'); valid = false; }

    if (weight != null && (weight < 0.5 || weight > 100)) { showFieldError(form, 'weight', 'Berat harus antara 0,5–100 kg.'); valid = false; }
    if (height != null && (height < 20 || height > 200)) { showFieldError(form, 'height', 'Tinggi harus antara 20–200 cm.'); valid = false; }
    if (head != null && (head < 20 || head > 80)) { showFieldError(form, 'head', 'Lingkar kepala harus antara 20–80 cm.'); valid = false; }
    if (weight == null && height == null && head == null) {
      showFieldError(form, 'weight', 'Isi minimal satu hasil pengukuran.');
      valid = false;
    }
    if (!valid) return;

    if (id) {
      const measurement = state.measurements.find((m) => m.id === id);
      if (!measurement) return;
      Object.assign(measurement, { date, weight, height, head, note });
      saveState();
      closeModal();
      renderApp();
      toast('Pengukuran berhasil diperbarui.');
    } else {
      state.measurements.push({
        id: uid(),
        childId: child.id,
        date,
        weight,
        height,
        head,
        note,
        createdAt: new Date().toISOString()
      });
      saveState();
      closeModal();
      renderApp();
      toast('Pengukuran baru tersimpan.');
    }
  }

  /* =========================================================
     Modal: jurnal
     ========================================================= */

  function openJournalModal(entryId = null, presetCategory = 'achievement') {
    const child = activeChild();
    if (!child) { openChildModal(); return; }
    const editing = entryId ? state.journal.find((j) => j.id === entryId) : null;
    const selected = editing ? editing.category : (CATEGORIES[presetCategory] ? presetCategory : 'achievement');
    openModal({
      kicker: 'Jurnal kecil',
      title: editing ? 'Ubah cerita' : 'Simpan cerita hari ini',
      subtitle: `Sebuah catatan kecil untuk ${esc(child.name)}. Tidak perlu sempurna.`,
      body: `
        <form id="journalForm" novalidate autocomplete="off">
          <input type="hidden" name="id" value="${editing ? esc(editing.id) : ''}" />
          <div class="form-grid">
            <div class="form-field">
              <label for="journalDate">Tanggal <span>wajib</span></label>
              <input class="input" id="journalDate" name="date" type="date" min="${esc(child.birthDate)}" max="${todayISO()}" value="${editing ? esc(editing.date) : todayISO()}" required />
            </div>
            <div class="form-field full">
              <span class="field-label">Kategori</span>
              <div class="category-options">
                ${Object.entries(CATEGORIES).map(([key, category]) => `
                  <label class="category-option">
                    <input type="radio" name="category" value="${key}" ${selected === key ? 'checked' : ''} />
                    <span>${ic(category.icon)} ${esc(category.label)}</span>
                  </label>`).join('')}
              </div>
            </div>
            <div class="form-field full">
              <label for="journalTitle">Judul cerita <span>wajib</span></label>
              <input class="input" id="journalTitle" name="title" type="text" maxlength="100" placeholder="Misal: Pertama kali bilang 'terima kasih'" value="${editing ? esc(editing.title) : ''}" required />
            </div>
            <div class="form-field full">
              <label for="journalNote">Ceritanya <span>opsional</span></label>
              <textarea class="textarea" id="journalNote" name="note" maxlength="2000" rows="5" placeholder="Apa yang terjadi? Bagaimana reaksinya? Bagaimana perasaan Bunda atau Ayah?">${editing ? esc(editing.note) : ''}</textarea>
            </div>
          </div>
        </form>`,
      footer: `
        <button class="btn btn-ghost" type="button" data-action="closeModal">Batal</button>
        <button class="btn btn-primary" type="submit" form="journalForm">${editing ? 'Simpan perubahan' : 'Simpan cerita'}</button>`
    });
  }

  function handleJournalSubmit(form) {
    clearFormErrors(form);
    const child = activeChild();
    if (!child) return;
    const data = new FormData(form);
    const id = String(data.get('id') || '');
    const date = String(data.get('date') || '');
    const category = String(data.get('category') || 'achievement');
    const title = String(data.get('title') || '').trim();
    const note = String(data.get('note') || '').trim();
    let valid = true;

    if (!date) { showFieldError(form, 'date', 'Tanggal wajib diisi.'); valid = false; }
    else if (!isValidISODate(date)) { showFieldError(form, 'date', 'Format tanggal belum tepat.'); valid = false; }
    else if (date < child.birthDate) { showFieldError(form, 'date', `Tanggal tidak boleh sebelum ${formatDate(child.birthDate)}.`); valid = false; }
    else if (date > todayISO()) { showFieldError(form, 'date', 'Tanggal tidak boleh di masa depan.'); valid = false; }
    if (!title) { showFieldError(form, 'title', 'Beri judul kecil untuk cerita ini.'); valid = false; }
    if (!CATEGORIES[category]) { showFieldError(form, 'category', 'Pilih kategori cerita.'); valid = false; }
    if (!valid) return;

    if (id) {
      const entry = state.journal.find((j) => j.id === id);
      if (!entry) return;
      Object.assign(entry, { date, category, title, note });
      saveState();
      closeModal();
      ui.journalFilter = 'all';
      ui.journalQuery = '';
      renderApp();
      toast('Cerita berhasil diperbarui.');
    } else {
      state.journal.push({
        id: uid(),
        childId: child.id,
        date,
        category,
        title,
        note,
        createdAt: new Date().toISOString()
      });
      saveState();
      closeModal();
      ui.journalFilter = 'all';
      ui.journalQuery = '';
      renderApp();
      toast('Cerita baru tersimpan.');
    }
  }

  /* =========================================================
     Modal: imunisasi
     ========================================================= */

  function openVaccineModal(vaccineId) {
    const child = activeChild();
    if (!child) { openChildModal(); return; }
    const vaccine = VACCINES.find((v) => v.id === vaccineId);
    if (!vaccine) return;
    const existing = vaccineRecord(child.id, vaccine.id);
    openModal({
      kicker: 'Catatan imunisasi',
      title: vaccine.name,
      subtitle: `${vaccine.protects} · jadwal usia ${vaccine.ageLabel}${vaccine.optional ? ' · opsional' : ''}`,
      body: `
        <form id="vaccineForm" novalidate autocomplete="off">
          <input type="hidden" name="id" value="${esc(vaccine.id)}" />
          <div class="form-grid">
            <div class="form-field full">
              <div class="focus-vax" style="padding:12px 13px;border-radius:13px;background:var(--surface-2);border:1px solid var(--line)">
                <span class="focus-vax-mark">${ic('shield')}</span>
                <span class="focus-vax-copy"><strong>${esc(vaccine.name)}</strong><small>${esc(vaccine.note || `Dijadwalkan pada usia ${vaccine.ageLabel}.`)}</small></span>
              </div>
            </div>
            <div class="form-field full">
              <label for="vaccineDate">Tanggal imunisasi <span>wajib</span></label>
              <input class="input" id="vaccineDate" name="date" type="date" min="${esc(child.birthDate)}" max="${todayISO()}" value="${existing ? esc(existing.date) : todayISO()}" required />
              <p class="form-hint">Isi tanggal saat imunisasi benar-benar diberikan.</p>
            </div>
            <div class="form-field full">
              <label for="vaccineNote">Catatan <span>opsional</span></label>
              <textarea class="textarea" id="vaccineNote" name="note" maxlength="300" placeholder="Misal: diberikan di posyandu, sedikit demam setelahnya.">${existing ? esc(existing.note) : ''}</textarea>
            </div>
          </div>
        </form>`,
      footer: `
        ${existing ? `<button class="btn btn-danger push-left" type="button" data-action="clearVaccine" data-id="${esc(vaccine.id)}">${ic('trash')} Hapus catatan</button>` : ''}
        <button class="btn btn-ghost" type="button" data-action="closeModal">Batal</button>
        <button class="btn btn-primary" type="submit" form="vaccineForm">Simpan catatan</button>`
    });
  }

  function handleVaccineSubmit(form) {
    clearFormErrors(form);
    const child = activeChild();
    if (!child) return;
    const data = new FormData(form);
    const vaccineId = String(data.get('id') || '');
    const vaccine = VACCINES.find((v) => v.id === vaccineId);
    if (!vaccine) return;
    const date = String(data.get('date') || '');
    const note = String(data.get('note') || '').trim();
    let valid = true;

    if (!date) { showFieldError(form, 'date', 'Tanggal imunisasi wajib diisi.'); valid = false; }
    else if (!isValidISODate(date)) { showFieldError(form, 'date', 'Format tanggal belum tepat.'); valid = false; }
    else if (date < child.birthDate) { showFieldError(form, 'date', `Tanggal tidak boleh sebelum ${formatDate(child.birthDate)}.`); valid = false; }
    else if (date > todayISO()) { showFieldError(form, 'date', 'Tanggal tidak boleh di masa depan.'); valid = false; }
    if (!valid) return;

    if (!state.immunizations[child.id]) state.immunizations[child.id] = {};
    state.immunizations[child.id][vaccineId] = { date, note };
    saveState();
    closeModal();
    renderApp();
    toast(`Catatan ${vaccine.name} tersimpan.`);
  }

  /* =========================================================
     Aksi data
     ========================================================= */

  function toggleMilestone(milestoneId) {
    const child = activeChild();
    if (!child) return;
    if (!state.milestones[child.id]) state.milestones[child.id] = {};
    if (state.milestones[child.id][milestoneId]) delete state.milestones[child.id][milestoneId];
    else state.milestones[child.id][milestoneId] = todayISO();
    saveState();
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      renderApp({ animate: false });
      window.scrollTo({ top: scrollY, behavior: 'auto' });
      const nextFocus = document.querySelector(`[data-action="toggleMilestone"][data-id="${milestoneId}"]`);
      if (nextFocus) nextFocus.focus({ preventScroll: true });
    });
  }

  async function deleteMeasurement(measurementId) {
    const measurement = state.measurements.find((m) => m.id === measurementId);
    if (!measurement) return;
    const ok = await askConfirm({
      title: 'Hapus pengukuran ini?',
      message: `Catatan tanggal <strong>${esc(formatDate(measurement.date))}</strong> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`,
      confirmText: 'Hapus pengukuran',
      danger: true
    });
    if (!ok) return;
    state.measurements = state.measurements.filter((m) => m.id !== measurementId);
    saveState();
    renderApp();
    toast('Pengukuran dihapus.');
  }

  async function deleteJournal(entryId) {
    const entry = state.journal.find((j) => j.id === entryId);
    if (!entry) return;
    const ok = await askConfirm({
      title: 'Hapus cerita ini?',
      message: `Cerita <strong>${esc(entry.title)}</strong> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`,
      confirmText: 'Hapus cerita',
      danger: true
    });
    if (!ok) return;
    state.journal = state.journal.filter((j) => j.id !== entryId);
    saveState();
    renderApp();
    toast('Cerita dihapus.');
  }

  async function deleteChild(childId) {
    const child = getChild(childId);
    if (!child) return;
    const ok = await askConfirm({
      title: `Hapus profil ${child.name}?`,
      message: `Seluruh pengukuran, milestone, imunisasi, dan jurnal <strong>${esc(child.name)}</strong> ikut dihapus permanen. Ekspor cadangan terlebih dahulu bila diperlukan.`,
      confirmText: 'Hapus profil',
      danger: true
    });
    if (!ok) return;
    state.children = state.children.filter((c) => c.id !== childId);
    state.measurements = state.measurements.filter((m) => m.childId !== childId);
    state.journal = state.journal.filter((j) => j.childId !== childId);
    delete state.milestones[childId];
    delete state.immunizations[childId];
    if (state.activeChildId === childId) state.activeChildId = state.children[0] ? state.children[0].id : null;
    saveState();
    renderApp();
    toast('Profil anak dihapus.');
  }

  async function clearVaccineRecord(vaccineId) {
    const child = activeChild();
    const vaccine = VACCINES.find((v) => v.id === vaccineId);
    if (!child || !vaccine) return;
    const ok = await askConfirm({
      title: `Hapus catatan ${vaccine.name}?`,
      message: 'Tanggal dan catatan imunisasi ini akan dihapus. Statusnya kembali menjadi belum tercatat.',
      confirmText: 'Hapus catatan',
      danger: true
    });
    if (!ok) return;
    if (state.immunizations[child.id]) delete state.immunizations[child.id][vaccineId];
    saveState();
    closeModal();
    renderApp();
    toast('Catatan imunisasi dihapus.');
  }

  function exportData() {
    const payload = {
      app: 'Tumbuh',
      version: 1,
      exportedAt: new Date().toISOString(),
      ...state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tumbuh-cadangan-${todayISO()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Cadangan data sedang diunduh.');
  }

  async function importDataFile(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const normalized = normalizeState(parsed);
      if (!normalized.children.length) {
        throw new Error('Tidak ada profil anak yang bisa diimpor.');
      }
      const cloudWarning = CLOUD.authenticated
        ? ' Data ini juga akan dikirim ke Netlify dan menggantikan data keluarga di semua perangkat.'
        : '';
      const ok = await askConfirm({
        title: 'Impor data ini?',
        message: `Berkas berisi <strong>${normalized.children.length} profil</strong> dan ${normalized.measurements.length} pengukuran. Data yang ada saat ini akan diganti.${cloudWarning}`,
        confirmText: 'Impor & ganti data',
        danger: true
      });
      if (!ok) return;
      state = normalized;
      saveState();
      ui.view = 'dashboard';
      ui.profileOpen = false;
      if (location.hash !== '#dashboard') location.hash = '#dashboard';
      else renderApp();
      toast('Data berhasil diimpor.');
    } catch (err) {
      console.error(err);
      toast('Berkas tidak valid. Pastikan memilih cadangan Tumbuh.', 'error');
    }
  }

  async function loadDemoData() {
    if (CLOUD.authenticated) {
      toast('Keluar dari akun keluarga sebelum memuat data contoh.', 'error');
      return;
    }
    if (state.children.length) {
      const ok = await askConfirm({
        title: 'Muat data contoh?',
        message: 'Data yang ada saat ini akan diganti dengan profil dan cerita contoh. Ekspor cadangan terlebih dahulu bila diperlukan.',
        confirmText: 'Muat data contoh',
        danger: true
      });
      if (!ok) return;
    }
    state = createDemoState();
    saveState();
    ui.view = 'dashboard';
    ui.profileOpen = false;
    if (location.hash !== '#dashboard') location.hash = '#dashboard';
    else renderApp();
    toast('Data contoh siap dijelajahi.');
  }

  async function resetData() {
    const ok = await askConfirm({
      title: 'Hapus semua data?',
      message: CLOUD.authenticated
        ? 'Semua profil, pengukuran, milestone, imunisasi, dan jurnal akan dihapus dari perangkat ini <strong>dan dari Netlify</strong>. Perangkat lain serta tautan lihat-saja juga akan kehilangan data ini. Tindakan ini tidak bisa dibatalkan.'
        : 'Semua profil anak, pengukuran, milestone, imunisasi, dan jurnal akan dihapus dari perangkat ini. Tindakan ini tidak bisa dibatalkan.',
      confirmText: 'Ya, hapus semua',
      danger: true
    });
    if (!ok) return;
    ui.view = 'dashboard';
    ui.profileOpen = false;
    ui.journalFilter = 'all';
    ui.journalQuery = '';
    if (CLOUD.authenticated) {
      state = defaultState();
      saveCloudMeta({ pending: true });
      CLOUD.pending = true;
      saveState();
      if (location.hash !== '#dashboard') location.hash = '#dashboard';
      else renderApp();
      const synced = await syncNow({ auto: false });
      toast(synced ? 'Data keluarga telah dihapus dari perangkat dan Netlify.' : 'Data lokal dihapus. Sinkronisasi ke Netlify akan dicoba lagi saat online.', synced ? 'success' : 'error');
    } else {
      try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* noop */ }
      state = defaultState();
      if (location.hash !== '#dashboard') location.hash = '#dashboard';
      else renderApp();
      toast('Semua data lokal telah dihapus.');
    }
  }

  function navigate(view) {
    const target = VALID_VIEWS.includes(view) ? view : 'dashboard';
    ui.profileOpen = false;
    if (location.hash !== `#${target}`) location.hash = target;
    else {
      ui.view = target;
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* =========================================================
     Interaksi
     ========================================================= */

  function openSidebar() {
    $('#sidebar').classList.add('is-open');
    $('#sidebarScrim').classList.add('is-open');
  }

  function closeSidebar() {
    $('#sidebar').classList.remove('is-open');
    $('#sidebarScrim').classList.remove('is-open');
  }

  function toggleProfileMenu(force) {
    ui.profileOpen = typeof force === 'boolean' ? force : !ui.profileOpen;
    const menu = $('#profileMenu');
    if (!menu) return;
    menu.hidden = !ui.profileOpen;
    $('#profileSwitch').setAttribute('aria-expanded', String(ui.profileOpen));
  }

  function switchChild(childId) {
    if (!getChild(childId)) return;
    state.activeChildId = childId;
    saveState();
    ui.profileOpen = false;
    renderApp();
    toast(`Beralih ke profil ${getChild(childId).name}.`);
  }

  const READONLY_BLOCKED_ACTIONS = new Set([
    'addChild', 'editChild', 'deleteChild',
    'addMeasurement', 'editMeasurement', 'deleteMeasurement',
    'addJournal', 'editJournal', 'deleteJournal',
    'toggleMilestone', 'markVaccine', 'editVaccine', 'markNextVaccine', 'clearVaccine',
    'exportData', 'importData', 'loadDemo', 'resetData',
    'cloudUseCloud', 'cloudKeepLocal', 'shareRotate', 'shareToggle'
  ]);

  document.addEventListener('click', (event) => {
    if (event.target.classList && event.target.classList.contains('modal-layer')) {
      closeModal();
      return;
    }
    if (event.target.closest('[data-modal-overlay]') && !event.target.closest('.modal-panel')) {
      closeModal();
      return;
    }

    const navLink = event.target.closest('[data-nav]');
    if (navLink) {
      closeSidebar();
      ui.profileOpen = false;
      const destination = navLink.dataset.nav;
      if (location.hash === `#${destination}`) {
        navigate(destination);
      }
      return;
    }

    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) {
      if (ui.profileOpen && !event.target.closest('#profileSwitchWrap')) toggleProfileMenu(false);
      return;
    }

    const action = actionEl.dataset.action;
    if (!action) return;

    if (READ_ONLY_MODE && READONLY_BLOCKED_ACTIONS.has(action)) {
      event.preventDefault();
      toast('Tautan ini hanya untuk melihat, tidak bisa mengubah data.');
      return;
    }

    if (action === 'toggleProfileMenu') {
      toggleProfileMenu();
      return;
    }

    if (ui.profileOpen && !event.target.closest('#profileSwitchWrap') && action !== 'confirmAction') toggleProfileMenu(false);

    if (action === 'confirmAction') {
      event.preventDefault();
      resolveConfirm();
      return;
    }

    if (action === 'closeModal') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (action === 'openSidebar') { event.preventDefault(); openSidebar(); return; }
    if (action === 'closeSidebar') { event.preventDefault(); closeSidebar(); return; }
    if (action === 'goView') { event.preventDefault(); navigate(actionEl.dataset.view); return; }
    if (action === 'switchChild') { event.preventDefault(); switchChild(actionEl.dataset.id); return; }
    if (action === 'addChild') { event.preventDefault(); toggleProfileMenu(false); openChildModal(); return; }
    if (action === 'editChild') { event.preventDefault(); openChildModal(actionEl.dataset.id); return; }
    if (action === 'deleteChild') { event.preventDefault(); deleteChild(actionEl.dataset.id); return; }
    if (action === 'addMeasurement') { event.preventDefault(); openMeasurementModal(); return; }
    if (action === 'editMeasurement') { event.preventDefault(); openMeasurementModal(actionEl.dataset.id); return; }
    if (action === 'deleteMeasurement') { event.preventDefault(); deleteMeasurement(actionEl.dataset.id); return; }
    if (action === 'addJournal') { event.preventDefault(); openJournalModal(); return; }
    if (action === 'editJournal') { event.preventDefault(); openJournalModal(actionEl.dataset.id); return; }
    if (action === 'deleteJournal') { event.preventDefault(); deleteJournal(actionEl.dataset.id); return; }
    if (action === 'toggleMilestone') { event.preventDefault(); toggleMilestone(actionEl.dataset.id); return; }
    if (action === 'setMetric') {
      event.preventDefault();
      ui.metric = METRICS[actionEl.dataset.metric] ? actionEl.dataset.metric : 'weight';
      renderApp();
      return;
    }
    if (action === 'setMilestoneMode') {
      event.preventDefault();
      ui.milestoneMode = actionEl.dataset.mode === 'all' ? 'all' : 'focus';
      renderApp();
      return;
    }
    if (action === 'setImmFilter') {
      event.preventDefault();
      ui.immFilter = ['all', 'upcoming', 'missed', 'done'].includes(actionEl.dataset.filter) ? actionEl.dataset.filter : 'all';
      renderApp();
      return;
    }
    if (action === 'setJournalFilter') {
      event.preventDefault();
      const nextFilter = actionEl.dataset.filter;
      ui.journalFilter = (nextFilter === 'all' || Boolean(CATEGORIES[nextFilter])) ? nextFilter : 'all';
      renderApp({ preserveScroll: true });
      return;
    }
    if (action === 'markVaccine' || action === 'editVaccine') {
      event.preventDefault();
      openVaccineModal(actionEl.dataset.id);
      return;
    }
    if (action === 'markNextVaccine') {
      event.preventDefault();
      const child = activeChild();
      if (!child) { openChildModal(); return; }
      const next = nextVaccine(child);
      if (next) openVaccineModal(next.id);
      else toast('Semua jadwal imunisasi dasar sudah tercatat.');
      return;
    }
    if (action === 'clearVaccine') { event.preventDefault(); clearVaccineRecord(actionEl.dataset.id); return; }
    if (action === 'exportData') { event.preventDefault(); exportData(); return; }
    if (action === 'importData') {
      event.preventDefault();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json,.json';
      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (file) importDataFile(file);
      });
      input.click();
      return;
    }
    if (action === 'loadDemo') { event.preventDefault(); loadDemoData(); return; }
    if (action === 'resetData') { event.preventDefault(); resetData(); return; }
    if (action === 'cloudSync') { event.preventDefault(); syncNow({ auto: false }); return; }
    if (action === 'cloudLogout') { event.preventDefault(); signOutCloud(); return; }
    if (action === 'shareCopy') { event.preventDefault(); copyShareLink(); return; }
    if (action === 'shareOpen') { event.preventDefault(); openShareLink(); return; }
    if (action === 'shareRotate') { event.preventDefault(); rotateShareLink(); return; }
    if (action === 'shareToggle') { event.preventDefault(); toggleShareLink(); return; }
    if (action === 'cloudUseCloud') { event.preventDefault(); resolveCloudConflict(true); return; }
    if (action === 'cloudKeepLocal') { event.preventDefault(); resolveCloudConflict(false); return; }
    if (action === 'retryShare') {
      event.preventDefault();
      window.clearInterval(SHARE_REFRESH_TIMER);
      SHARE_ERROR = '';
      SHARE_LOADING = true;
      initShareView();
      return;
    }
  });

  document.addEventListener('submit', handleFormSubmit);

  document.addEventListener('input', (event) => {
    if (event.target && event.target.id === 'journalSearch') {
      ui.journalQuery = event.target.value;
      const child = activeChild();
      const results = $('#journalResults');
      if (child && results) results.innerHTML = journalResultsHTML(child);
    }
  });

  document.addEventListener('keydown', (event) => {
    const modal = $('.modal-panel');
    if (event.key === 'Escape') {
      if (modal) { event.preventDefault(); closeModal(); return; }
      if ($('#sidebar').classList.contains('is-open')) { closeSidebar(); return; }
      if (ui.profileOpen) { toggleProfileMenu(false); return; }
    }
    if (event.key === 'Tab' && modal) {
      const focusable = $$('button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href]', modal)
        .filter((el) => el.offsetWidth > 0 || el.offsetHeight > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('hashchange', () => {
    const destination = location.hash.replace('#', '');
    if (VALID_VIEWS.includes(destination)) ui.view = destination;
    else ui.view = 'dashboard';
    ui.profileOpen = false;
    closeSidebar();
    renderApp({ animate: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if ($('[data-chart]')) hydrateCharts();
    }, 160);
  });

  window.addEventListener('offline', () => {
    if (READ_ONLY_MODE) return;
    if (CLOUD.authenticated) {
      CLOUD.status = 'offline';
      updateCloudChip();
      refreshCloudUI();
    }
  });

  window.addEventListener('online', () => {
    if (READ_ONLY_MODE) {
      refreshShareData();
    } else if (CLOUD.authenticated) {
      syncNow({ auto: true });
    } else if (CLOUD.status === 'offline' || CLOUD.status === 'error' || CLOUD.status === 'backend-missing') {
      CLOUD.initialized = false;
      initCloud();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (READ_ONLY_MODE) refreshShareData();
    else if (CLOUD.authenticated && !CLOUD.conflict) syncNow({ auto: true });
  });

  function init() {
    document.body.classList.toggle('readonly', READ_ONLY_MODE);
    const hashView = location.hash.replace('#', '');
    if (VALID_VIEWS.includes(hashView)) ui.view = hashView;
    if (READ_ONLY_MODE) {
      if (!['dashboard', 'growth', 'milestones', 'immunizations', 'journal'].includes(ui.view)) ui.view = 'dashboard';
      initShareView();
      return;
    }
    const params = new URLSearchParams(location.search);
    if (params.get('demo') === '1' && !state.children.length) {
      state = createDemoState();
      saveState();
    }
    renderApp({ animate: false });
    window.scrollTo({ top: 0, behavior: 'auto' });
    initCloud();
  }

  init();
})();
