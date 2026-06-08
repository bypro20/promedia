# ProMedia — Agent Görev Kuyruğu

Koordinatör bu listeyi okur ve `[rol]` etiketine göre dağıtır.

## Sprint 3 — Panel ayrımı + bakiye akışı (aktif)

### Tamamlanan

- [x] `[api]` DepositRequest modeli — müşteri talep, admin onay/red
- [x] `[api]` POST /api/panel/balance → pending deposit (ticket değil)
- [x] `[api]` /api/admin/deposits — onay, red, manuel kredi, işlem geçmişi
- [x] `[ui]` Müşteri paneli — MedyaBayim tarzı: bakiye, sipariş, yükleme talebi
- [x] `[ui]` Admin /admin/bakiye — bekleyen talepler kuyruğu + Onayla & Yükle
- [x] `[ui]` Admin kullanıcılar — rol/aktif; bakiye buradan değil bakiye sayfasından
- [x] `[ui]` Panel nav — müşteri odaklı; API bayi alt menüde

### Sırada — `[ui]` agent

- [ ] Sipariş detay `/panel/siparisler/[code]`
- [ ] Destek ticket mesaj thread (müşteri + admin)
- [ ] Admin dashboard — bekleyen bakiye + SMM durumu widget

### Sırada — `[api]` agent

- [ ] Reseller API `/api/v1/*` (UserApiKey)
- [ ] iyzico / PayTR otomatik ödeme → deposit auto-approve
- [ ] Sipariş iptal / iade admin aksiyonu

### Sırada — `[qa]` agent

- [ ] Bakiye akışı E2E: talep → admin onay → bakiye artışı → sipariş
- [ ] Cross-access: admin /panel, user /admin, user A → user B
- [ ] Canlı smoke tüm panel sayfaları

### Sırada — `[ops]` agent

- [ ] Turso schema push (DepositRequest)
- [ ] GitHub push + Vercel deploy
- [ ] Vercel Git auto-deploy

### Sırada — `[content]` agent

- [ ] Havale/EFT banka bilgileri metni (bakiye sayfası)
- [ ] Reseller API dokümantasyonu
- [ ] FAQ tutarlılığı

---

## Agent komutları

```
AGENT_TASKS.md Sprint 3'teki ilk [ui] görevini yap
```

```
[qa] Bakiye talep → admin onay E2E testini çalıştır
```

```
[ops] prisma db push + vercel deploy
```

---

## Tamamlanan (geçmiş sprintler)

- [x] Portal ayrımı (/giris vs /admin/giris, middleware)
- [x] Panel shell + admin shell
- [x] Google OAuth canlı
- [x] Turso + SMM multi-panel
