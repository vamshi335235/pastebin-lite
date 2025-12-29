
import { Redis } from '@upstash/redis';

// Types
export interface PasteData {
    id: string;
    content: string;
    created_at: number;
    ttl_seconds?: number;
    expires_at?: number | null;
    max_views?: number;
    views: number;
}

const isRedisConfigured = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// In-memory fallback for local dev
const memoryStore = new Map<string, PasteData>();

// Redis Client
const redis = isRedisConfigured ? new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
}) : null;

export const storage = {
    createPaste: async (paste: PasteData) => {
        if (redis) {
            const payload: Record<string, unknown> = {
                id: paste.id,
                content: paste.content,
                created_at: paste.created_at,
                views: paste.views,
            };
            if (paste.ttl_seconds !== undefined) payload.ttl_seconds = paste.ttl_seconds;
            if (paste.expires_at !== undefined && paste.expires_at !== null) payload.expires_at = paste.expires_at;
            if (paste.max_views !== undefined) payload.max_views = paste.max_views;

            const p = redis.pipeline();
            p.hset(`paste:${paste.id}`, payload);

            if (paste.ttl_seconds) {
                p.expire(`paste:${paste.id}`, paste.ttl_seconds);
            }
            await p.exec();
            console.log(`[Storage] Created paste ${paste.id} in Redis`);
        } else {
            console.warn("Using in-memory storage. Data will be lost on restart.");
            memoryStore.set(paste.id, { ...paste });
        }
    },

    getPaste: async (id: string): Promise<PasteData | null> => {
        if (redis) {
            const data = await redis.hgetall(`paste:${id}`) as Record<string, unknown> | null;
            if (!data) {
                console.log(`[Storage] Paste ${id} not found in Redis (hgetall returned null)`);
                return null;
            }

            // Check if object is empty (Upstash sometimes returns empty object for missing key?)
            if (Object.keys(data).length === 0) {
                console.log(`[Storage] Paste ${id} returned empty object`);
                return null;
            }

            // Manually cast types to ensure safety
            return {
                id: data.id as string,
                content: data.content as string,
                created_at: Number(data.created_at),
                views: Number(data.views),
                ttl_seconds: data.ttl_seconds ? Number(data.ttl_seconds) : undefined,
                expires_at: data.expires_at ? Number(data.expires_at) : undefined,
                max_views: data.max_views ? Number(data.max_views) : undefined,
            };
        } else {
            return memoryStore.get(id) || null;
        }
    },

    incrementView: async (id: string): Promise<number> => {
        if (redis) {
            const val = await redis.hincrby(`paste:${id}`, 'views', 1);
            return val;
        } else {
            const paste = memoryStore.get(id);
            if (!paste) return 0;
            paste.views += 1;
            return paste.views;
        }
    },

    isReady: () => isRedisConfigured || process.env.NODE_ENV !== 'production'
};
