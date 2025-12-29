
import { notFound } from 'next/navigation';
import { getAndVisitPaste } from '@/lib/paste';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Clock, Eye, Calendar, ArrowLeft } from 'lucide-react';

// Force dynamic rendering to ensure view counts and headers are processed correctly on every request.
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PastePage({ params }: PageProps) {
    const { id } = await params;
    const headersList = await headers();

    // Fetch paste
    const paste = await getAndVisitPaste(id, headersList);

    if (!paste) {
        // This triggers the not-found.tsx page
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">

                {/* Navigation */}
                <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
                    <Link href="/" className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                {/* Meta Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative z-10 pl-12 md:pl-0 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Secure Paste</span>
                        <h1 className="text-3xl md:text-4xl font-mono text-white tracking-tight">{paste.id}</h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-full border border-white/5 text-xs font-medium text-neutral-300">
                            <Calendar className="w-3 h-3" />
                            {new Date(paste.created_at).toLocaleString()}
                        </div>
                        {paste.expires_at && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-xs font-medium text-indigo-300">
                                <Clock className="w-3 h-3" />
                                Expires: {new Date(paste.expires_at).toLocaleString()}
                            </div>
                        )}
                        {paste.max_views && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full border border-purple-500/20 text-xs font-medium text-purple-300">
                                <Eye className="w-3 h-3" />
                                {paste.views} / {paste.max_views} Views
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative z-10">
                    <div className="bg-black/30 border border-white/5 rounded-2xl p-6 md:p-8 shadow-inner overflow-hidden">
                        <pre className="w-full overflow-x-auto font-mono text-sm md:text-base leading-relaxed text-neutral-200 whitespace-pre-wrap break-words custom-scrollbar">
                            {paste.content}
                        </pre>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-10 text-center relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-sm font-medium hover:underline underline-offset-4 opacity-60 hover:opacity-100"
                    >
                        Generate New Paste
                    </Link>
                </div>
            </div>
        </div>
    );
}
