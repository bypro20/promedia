export type KeyVisibility = 'visible' | 'masked_once' | 'always_masked'

export type PanelKeyHelp = {
  visibility: KeyVisibility
  recommended?: boolean
  steps: string[]
  regenerateHint?: string
  supportEmail?: string
}

/** Panel bazlı API key alma rehberi */
export const PANEL_KEY_HELP: Record<string, PanelKeyHelp> = {
  prm4u: {
    visibility: 'visible',
    recommended: true,
    steps: [
      'prm4u.com → Sign up → Settings → API Key',
      'Key görünür — kopyalayın',
      'ProMedia admin → PRM4U (Toptan) → Test Et → Kaydet',
      'Add Funds ile $10+ bakiye yükleyin (siparişler buradan çekilir)',
    ],
  },
  turkiyeresellers: {
    visibility: 'visible',
    recommended: true,
    steps: [
      'turkiyeresellers.com → Giriş yapın',
      'Hesap / API bölümüne gidin',
      'API key metnini seçip kopyalayın (genelde 32 karakter hex)',
      'Buraya yapıştırıp "Test Et" → "Kaydet"',
    ],
  },
  peakerr: {
    visibility: 'always_masked',
    recommended: true,
    steps: [
      'peakerr.com → Sign in → Account veya API sayfası',
      'Mevcut key yıldızlı — "Generate" / "New API Key" ile yenisini oluşturun',
      'Key yalnızca oluşturulduğu anda görünür — hemen kopyalayın',
      'F12 → Network → Preserve log → newkey isteğinin Response\'una bakın',
      'Olmazsa ticket: peakerr.com/support',
    ],
    regenerateHint: 'Account sayfasında yeni key — oluşturulur oluşturulmaz kopyala',
  },
  medyabayim: {
    visibility: 'always_masked',
    steps: [
      'medyabayim.com → Giriş → API / Hesap ayarları',
      'Key yıldızlı görünüyorsa: "Yeni API Key" veya "Reset" tıklayın',
      '⚠️ Key yalnızca oluşturulduğu anda gösterilir — hemen kopyalayın',
      'Kaçırdıysanız yeni key oluşturun (eskisi iptal olur)',
    ],
    regenerateHint: 'API sayfasında "Generate new key" — oluşturulur oluşturulmaz kopyalayın',
  },
  smmservisim: {
    visibility: 'always_masked',
    steps: [
      'smmservisim.com → Giriş → Account → API',
      'Mevcut key yıldızlı — yeni key oluşturmanız gerekir',
      'F12 → Network → "Preserve log" açık → "New API Key" tıklayın',
      'POST isteğinin Response sekmesine bakın (bazen boş döner)',
      'Response boşsa: destek talebi açın veya yeni key oluştururken ekran görüntüsü alın',
    ],
    regenerateHint: '/account/newkey — key sadece ilk saniyede görünür olabilir',
    supportEmail: 'destek@smmservisim.com',
  },
  sosyaldigital: {
    visibility: 'masked_once',
    steps: [
      'sosyaldigital.com → API bölümü',
      'Yeni key oluştururken açılan kutudan kopyalayın',
      'Sayfayı yenilerseniz key yıldızlanır',
    ],
  },
  bayigram: {
    visibility: 'masked_once',
    steps: [
      'bayigram.com → Hesap → API Key',
      'Reset/New Key → çıkan popup\'tan kopyalayın',
    ],
  },
  smmevi: {
    visibility: 'masked_once',
    steps: [
      'smmevi.net → API ayarları',
      'Yeni key oluştur → anında kopyala',
    ],
  },
  jap: {
    visibility: 'visible',
    recommended: true,
    steps: [
      'justanotherpanel.com → Account → API',
      'Key genelde tam görünür',
    ],
  },
  smmfollows: {
    visibility: 'visible',
    steps: ['smmfollows.com → API — key genelde görünür'],
  },
  worldofsmm: {
    visibility: 'masked_once',
    steps: ['worldofsmm.com → API → yeni key oluştururken kopyala'],
  },
  bulkfollows: {
    visibility: 'visible',
    recommended: true,
    steps: [
      'bulkfollows.com → Sign up → Account → API Key',
      'Key görünür — kopyalayın',
      'ProMedia admin → BulkFollows → Test Et → Kaydet',
      'Add Funds ile $10+ bakiye yükleyin',
    ],
  },
  smmkings: {
    visibility: 'visible',
    recommended: true,
    steps: [
      'smmkings.com → Register → API bölümü',
      'API key kopyala → Test Et → Kaydet',
    ],
  },
  smmraja: {
    visibility: 'visible',
    steps: [
      'smmraja.com → Sign up → API Key',
      'Key genelde tam görünür',
    ],
  },
  growfollows: {
    visibility: 'visible',
    steps: [
      'growfollows.com → Account → API',
      'Key kopyala → Test Et → Kaydet',
    ],
  },
  moresmm: {
    visibility: 'visible',
    steps: [
      'moresmm.com → Kayıt → API Key',
      'Key kopyala → Test Et → Kaydet',
    ],
  },
}

/** Panel sayfasında yapıştırılacak key yakalayıcı (console script) */
export const KEY_CAPTURE_SCRIPT = `(function(){
  if (window.__promediaKeyCapture) { console.log('Zaten aktif'); return; }
  window.__promediaKeyCapture = true;
  const HEX_KEY = /^[a-f0-9]{28,40}$/i;
  const seen = new Set();
  function check(text) {
    if (!text || typeof text !== 'string') return;
    const matches = text.match(/[a-f0-9]{32}/gi) || [];
    for (const m of matches) {
      if (seen.has(m)) continue;
      seen.add(m);
      if (HEX_KEY.test(m)) {
        console.log('%c[ProMedia] Olası API key bulundu:', 'color:#10B981;font-weight:bold', m);
        try { navigator.clipboard.writeText(m); console.log('%cPanoya kopyalandı!', 'color:#7844E4'); } catch(e) {}
      }
    }
  }
  const origFetch = window.fetch;
  window.fetch = function(...args) {
    return origFetch.apply(this, args).then(async (res) => {
      try { check(await res.clone().text()); } catch(e) {}
      return res;
    });
  };
  const obs = new MutationObserver(() => {
    document.querySelectorAll('input,textarea,code,pre,.alert,.modal').forEach(el => {
      const t = el.textContent || el.value || '';
      if (t.length < 20) return;
      check(t);
    });
  });
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  console.log('%c[ProMedia] Key yakalayıcı aktif — panelde yeni API key oluşturun', 'color:#7844E4;font-weight:bold');
})();`

export function getPanelKeyHelp(panelId: string): PanelKeyHelp {
  return (
    PANEL_KEY_HELP[panelId] ?? {
      visibility: 'masked_once' as KeyVisibility,
      steps: [
        'Panel hesabınıza giriş yapın',
        'API / Developer bölümüne gidin',
        'Yeni key oluşturun — key yalnızca bir kez gösterilir, hemen kopyalayın',
        'Buraya yapıştırıp Test Et ile doğrulayın',
      ],
    }
  )
}
