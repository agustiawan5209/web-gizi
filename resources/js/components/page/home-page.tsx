// HomePage.tsx
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
interface HomeProps{
    className?:string
}
const HomePage = ({className, ...props}: HomeProps) => (
    <div className={cn('flex w-full items-center justify-around bg-white lg:p-8 md:h-[80vh]', className)} {...props}>
        <div className="max-w-full lg:max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 md:text-xl lg:text-2xl">Sistem Klasifikasi </h2>
            <h1 className="mt-2 text-xl font-bold md:text-4xl lg:text-3xl text-justify">Gizi Anak Balita Berbasis Web Menggunakan Algoritma Naive Bayes</h1>
            <p className="mt-4 text-sm text-gray-600 md:text-base lg:text-lg">
                Aplikasi ini dibangun menggunakan pendekatan naive bayes classifier untuk menentukan status gizi anak berdasarkan data antropometri
            </p>
            <Link href="/login">
                <button className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Mulai Pemeriksaan Gizi</button>
            </Link>
        </div>
        <div className="hidden w-1/4 md:block">
            {/* Placeholder for the image or graphic on the right */}
            <img src="/image/logo.png" alt="Graphic representing Figma" className="w-full" />
        </div>
    </div>
);

export default HomePage;

