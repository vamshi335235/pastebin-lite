
import { storage } from './storage';
import { getCurrentTime, HeadersLike } from './utils';

export async function getAndVisitPaste(id: string, headers: HeadersLike) {
    const paste = await storage.getPaste(id);

    if (!paste) {
        console.log(`[PasteLogic] Paste ${id} not found in storage.`);
        return null;
    }

    // Check TTL
    const now = getCurrentTime(headers);
    if (paste.expires_at && now > paste.expires_at) {
        console.log(`[PasteLogic] Paste ${id} expired. Now: ${now}, ExpiresAt: ${paste.expires_at}`);
        return null;
    }

    // Handle View Counting
    const newViews = await storage.incrementView(id);
    console.log(`[PasteLogic] Paste ${id} view incremented to ${newViews}`);

    if (paste.max_views !== undefined && paste.max_views !== null) {
        if (newViews > paste.max_views) {
            console.log(`[PasteLogic] Paste ${id} max views exceeded. NewViews: ${newViews}, MaxViews: ${paste.max_views}`);
            return null;
        }
    }

    return { ...paste, views: newViews };
}
