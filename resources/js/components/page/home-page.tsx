// HomePage.tsx
import { Link } from "@inertiajs/react";
const HomePage = () => (
    <div className="flex w-full items-center justify-around bg-white lg:p-8 md:h-[80vh]">
        <div className="max-w-full lg:max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 md:text-xl lg:text-2xl">Kesehatan Balita</h2>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl lg:text-5xl">Aplikasi monitoring kesehatan balita yang komprehensif</h1>
            <p className="mt-4 text-sm text-gray-600 md:text-base lg:text-lg">
                Aplikasi ini membantu Anda memantau kesehatan balita Anda dengan lebih mudah dan efektif. Dari data kesehatan hingga perawatan - Semua
                ada di sini.
            </p>
            <Link href="/login">
                <button className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Coba Sekarang</button>
            </Link>
        </div>
        <div className="hidden w-1/4 md:block">
            {/* Placeholder for the image or graphic on the right */}
            <img src="/image/logo.png" alt="Graphic representing Figma" className="w-full" />
        </div>
    </div>
);

export default HomePage;
