
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                <h2 className="text-5xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">404</h2>
                <h3 className="text-xl font-medium text-white mb-4">Paste Not Found</h3>
                <p className="mb-8 text-neutral-400 text-sm leading-relaxed">
                    This paste has expired, reached its view limit, or never existed in the first place.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:scale-105 inline-block shadow-lg shadow-indigo-600/20"
                >
                    Create New Paste
                </Link>
            </div>
        </div>
    );
}
