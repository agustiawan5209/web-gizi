<?php

namespace Database\Seeders;

use App\Models\Attribut;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttributSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributs = array(
            array(
                "nama" => "Usia Balita (bulan)",
                "keterangan" => "Attribut",
                "created_at" => "2025-03-24 12:09:09",
                "updated_at" => "2025-03-24 12:09:09",
            ),
            array(
                "nama" => "Jenis Kelamin",
                "keterangan" => "Attribut",
                "created_at" => "2025-03-24 12:09:28",
                "updated_at" => "2025-03-24 12:09:28",
            ),
            array(
                "nama" => "Tinggi Badan (CM)",
                "keterangan" => "Attribut",
                "created_at" => "2025-03-24 12:09:37",
                "updated_at" => "2025-03-24 12:09:37",
            ),
            array(
                "nama" => "Berat Badan (KG)",
                "keterangan" => "Attribut",
                "created_at" => "2025-03-24 12:09:47",
                "updated_at" => "2025-03-24 12:09:47",
            ),
            array(
                "nama" => "Lingkar Kepala (CM)",
                "keterangan" => "Attribut",
                "created_at" => "2025-03-24 12:09:56",
                "updated_at" => "2025-03-24 12:09:56",
            ),
            array(
                "nama" => "Lingkar Lengan (CM)",
                "keterangan" => "Attribut",
                "created_at" => "2025-03-24 12:10:08",
                "updated_at" => "2025-03-24 12:10:08",
            ),
            array(
                "nama" => "Status",
                "keterangan" => "Label",
                "created_at" => "2025-03-24 12:10:15",
                "updated_at" => "2025-03-24 12:10:15",
            ),
        );

        Attribut::insert($attributs);
    }
}
