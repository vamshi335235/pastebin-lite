
import { NextRequest, NextResponse } from 'next/server';
import { getAndVisitPaste } from '@/lib/paste';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const paste = await getAndVisitPaste(params.id, req.headers);

    if (!paste) {
        return NextResponse.json({ error: 'Paste not found or unavailable' }, { status: 404 });
    }

    const remaining_views = (paste.max_views !== undefined && paste.max_views !== null)
        ? Math.max(0, paste.max_views - paste.views)
        : null;

    // expires_at should be ISO string or null
    const expires_at = paste.expires_at ? new Date(paste.expires_at).toISOString() : null;

    return NextResponse.json({
        content: paste.content,
        remaining_views,
        expires_at
    });
}
