# Google OAuth — prmdia.com

Kalıcı callback yolları `src/lib/google-oauth-config.ts` içinde tanımlıdır.

## Google Cloud Console

[Credentials](https://console.cloud.google.com/apis/credentials) → OAuth 2.0 Client ID  
(`35721285024-sbk42nuah3ffk9891b2lc4euaoid8jql.apps.googleusercontent.com`)

### Authorized JavaScript origins

```
https://prmdia.com
http://localhost:3000
```

### Authorized redirect URIs

```
https://prmdia.com/api/auth/google/callback
http://localhost:3000/api/auth/google/callback
```

## Ortam değişkenleri

| Değişken | Production |
|----------|------------|
| `GOOGLE_CLIENT_ID` | Vercel + `.env` |
| `GOOGLE_CLIENT_SECRET` | Vercel + `.env` |
| `NEXT_PUBLIC_SITE_URL` | `https://prmdia.com` |

## Doğrulama

```bash
npm run oauth:verify
```

## guchat.org farkı

| Site | Callback |
|------|----------|
| prmdia.com | `/api/auth/google/callback` |
| guchat.org | `/api/auth/callback/google` |

Aynı Google client kullanılıyorsa **her iki URI de** Console'da kayıtlı olmalıdır.
