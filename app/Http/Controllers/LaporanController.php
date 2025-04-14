<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Balita;
use App\Models\Attribut;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{

    public function index(Balita $balita)
    {
        $attributes = Attribut::all()->toArray();
        // Ambil data dari database
        $balita->with(['orangtua']);
        $pemeriksaan = Pemeriksaan::with(['detailpemeriksaan'])->where('balita_id', $balita->id)->get();

        // Hitung usia balita
        $tanggalLahir = \Carbon\Carbon::parse($balita->tanggal_lahir);
        $usia = $tanggalLahir->diffInMonths(\Carbon\Carbon::now());
        $balita->usia = round($usia, 1);

        $datauji = [];

        foreach ($pemeriksaan as $key => $value) {
            if ($value && $value->detailpemeriksaan) {
                $datauji[] = $this->setDataUji($value, $attributes);
            }
        }
        $data = [
            'orangTua' => $balita->orangtua,
            'balita' => $balita,
            'pemeriksaan' => $datauji,
            'attribut' => array_map('strtolower', array_column($attributes, 'nama')),

        ];

        if (empty($data['pemeriksaan'])) {
            return back()->with('error', 'Belum ada data pemeriksaan');
        }

        $pdf = PDF::loadView('laporan-balita', $data);

        // return $pdf->download('laporan_pemeriksaan_balita.pdf');

        // Atau untuk preview:
        return $pdf->download('laporan_pemeriksaan.pdf');
    }

    public function setDataUji($pemeriksaan, $attributes)
    {

        $datauji = [];
        foreach ($attributes as $key => $value) {
            $attributes_id = $value['id'];
            $attributes_nama = strtolower($value['nama']);

            $datauji[$attributes_nama] = $pemeriksaan->detailpemeriksaan()->where('attribut_id', $attributes_id)->first()->nilai;
        }
        // dd($datauji);
        return $datauji;
    }

    public function pemeriksaan(Balita $balita, Pemeriksaan $pemeriksaan)
    {
        $attributes = Attribut::all()->toArray();
        // Ambil data dari database
        $balita->with(['orangtua']);

        // Hitung usia balita
        $tanggalLahir = \Carbon\Carbon::parse($balita->tanggal_lahir);
        $usia = $tanggalLahir->diffInMonths(\Carbon\Carbon::now());
        $balita->usia = round($usia, 1);

        $datauji = [];
        if ($pemeriksaan && $pemeriksaan->detailpemeriksaan) {
            $datauji = $this->setDataUji($pemeriksaan, $attributes);
        }
        // dd($datauji);
        $data = [
            'orangTua' => $balita->orangtua,
            'balita' => $balita,
            'pemeriksaan' => $datauji,
            'detail' => $pemeriksaan->with(['detailpemeriksaan']),
            'attribut' => array_map('strtolower', array_column($attributes, 'nama')),

        ];

        // if (empty($data['pemeriksaan'])) {
        //     return back()->with('error', 'Belum ada data pemeriksaan');
        // }

        $pdf = PDF::loadView('laporan-pemeriksaan', $data);

        // return $pdf->download('laporan_pemeriksaan_balita.pdf');

        // Atau untuk preview:
        return $pdf->stream('laporan_pemeriksaan.pdf');
    }
}
