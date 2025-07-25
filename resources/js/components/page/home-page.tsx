// HomePage.tsx
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
interface HomeProps {
    className?: string;
}
const HomePage = ({ className, ...props }: HomeProps) => (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 w-full items-center justify-around bg-transparent p-10 md:h-[80vh] lg:p-0', className)} {...props}>
        <div className="max-w-full lg:max-w-md">
            <h2 className="text-lg font-semibold text-yellow-300 md:text-xl lg:text-2xl">Sistem Klasifikasi </h2>
            <h1 className="mt-2 text-justify text-xl font-bold md:text-4xl text-white">
                Gizi Anak Balita <br />Berbasis  Web <br />Menggunakan <br />Algoritma Naive Bayes
            </h1>
            <p className="mt-4 text-sm text-white md:text-base lg:text-lg">
                Aplikasi ini dibangun menggunakan pendekatan naive bayes classifier untuk menentukan status gizi anak berdasarkan data antropometri
            </p>
            <Link href="/login">
                <button className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Mulai Pemeriksaan Gizi Balita</button>
            </Link>
        </div>
        <div className="col-span-1">
            {/* Placeholder for the image or graphic on the right */}
            <img src="/image/logo-dark.png" alt="Graphic representing Figma" className="w-[80%]" />
        </div>
    </div>
);

export default HomePage;
