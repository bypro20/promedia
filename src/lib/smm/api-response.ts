/** SMM panel API yanıtını parse et — birçok panel 401 + JSON error döner */

export type SmmApiJson = Record<string, unknown> | unknown[]

export async function readSmmApiJson(res: Response): Promise<SmmApiJson | null> {
  try {
    return (await res.json()) as SmmApiJson
  } catch {
    return null
  }
}

export function smmApiError(data: SmmApiJson | null): string | undefined {
  if (!data || Array.isArray(data)) return undefined
  const err = data.error
  if (typeof err === 'string' && err.trim()) return err.trim()
  return undefined
}

export function assertSmmApiOk(res: Response, data: SmmApiJson | null): void {
  const apiError = smmApiError(data)
  if (!res.ok) {
    throw new Error(apiError ?? `Panel HTTP ${res.status}`)
  }
  if (apiError) {
    throw new Error(apiError)
  }
}
