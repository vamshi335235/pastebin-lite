
import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    if (!storage.isReady()) {
        return NextResponse.json({ ok: false, error: 'Storage not configured' }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
}
