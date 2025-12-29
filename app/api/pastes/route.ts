
import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getCurrentTime } from '@/lib/utils';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { content, ttl_seconds, max_views } = body;

        // Validation
        if (typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Content is required and must be a non-empty string' }, { status: 400 });
        }
        if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
            return NextResponse.json({ error: 'ttl_seconds must be an integer >= 1' }, { status: 400 });
        }
        if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
            return NextResponse.json({ error: 'max_views must be an integer >= 1' }, { status: 400 });
        }

        const id = nanoid(8);
        const now = getCurrentTime(req.headers);

        let expires_at = null;
        if (ttl_seconds) {
            expires_at = now + (ttl_seconds * 1000);
        }

        await storage.createPaste({
            id,
            content,
            created_at: now,
            ttl_seconds: ttl_seconds || undefined,
            expires_at: expires_at || undefined,
            max_views: max_views || undefined,
            views: 0
        });

        const host = req.headers.get('host');
        // Default to https in production or logical inference, fallback http
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const url = `${protocol}://${host}/p/${id}`;

        return NextResponse.json({ id, url }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
