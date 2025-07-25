<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Balita;
use App\Models\Attribut;
use App\Models\PolaMakan;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{

    public function index(Balita $balita)
    {
        $attributes = Attribut::all()->toArray();
        // Ambil data dari database
        $balita->load(['orangtua']);
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

    public function pemeriksaan(Balita $balita,Request $request)
    {
        $attributes = Attribut::all()->toArray();
        $datapemeriksaan = Pemeriksaan::find($request->pemeriksaan);
        $polaMakan = PolaMakan::where('pemeriksaan_id', $request->pemeriksaan)->first();
        // Ambil data dari database
        $balita->load(['orangtua', 'pemeriksaan', 'pemeriksaan.detailpemeriksaan',]);

        // Hitung usia balita
        $tanggalLahir = \Carbon\Carbon::parse($balita->tanggal_lahir);
        $usia = $tanggalLahir->diffInMonths(\Carbon\Carbon::now());
        $balita->usia = round($usia, 1);

        $datauji = [];
        if ($datapemeriksaan && $datapemeriksaan->detailpemeriksaan) {
            $datauji = $this->setDataUji($datapemeriksaan, $attributes);
        }
        $attr = array_map('strtolower', array_column(array_filter($attributes, function($item) {
            return strtolower($item['nama']) !== 'status' && strtolower($item['nama']) !== 'jenis kelamin';
        }), 'nama'));
        $data = [
            'orangTua' => $balita->orangtua,
            'balita' => $balita,
            'pemeriksaan' => $datapemeriksaan,
            'polamakan' => $polaMakan,
            'detail' => $datauji,
            'dataPemeriksaanBalita' => $balita->pemeriksaan,
            'attribut' => $attr,
            'attributes' => $attributes,

        ];

        if (empty($data['pemeriksaan'])) {
            return back()->with('error', 'Belum ada data pemeriksaan');
        }

        $pdf = PDF::loadView('laporan-pemeriksaan', $data);

        // return $pdf->download('laporan_pemeriksaan_balita.pdf');

        // Atau untuk preview:
        return $pdf->stream('laporan_pemeriksaan.pdf');
    }
}
