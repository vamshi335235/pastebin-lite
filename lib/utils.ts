
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface HeadersLike {
    get(name: string): string | null;
}

export function getCurrentTime(headers?: HeadersLike | null): number {
    if (process.env.TEST_MODE === '1' && headers) {
        const testNow = headers.get('x-test-now-ms');
        if (testNow) {
            const parsed = parseInt(testNow, 10);
            if (!isNaN(parsed)) return parsed;
        }
    }
    return Date.now();
}
