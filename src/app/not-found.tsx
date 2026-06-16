import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <h2 className="mt-3 text-xl font-semibold text-slate-900">
        Halaman tidak ditemukan
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Halaman yang Anda cari tidak tersedia.
      </p>
      <Link
        href="/dashboard"
        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
