import { NextResponse } from 'next/server'
import { isIpBanned } from '@/lib/security'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ip = searchParams.get('ip')
  if (!ip) {
    return NextResponse.json({ banned: false })
  }
  const banned = await isIpBanned(ip)
  return NextResponse.json({ banned }, { headers: { 'Cache-Control': 'no-store' } })
}
