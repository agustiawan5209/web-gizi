<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Attribut;
use App\Models\Dataset;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $statusLabel = [
            'gizi lebih',
            'gizi buruk',
            'gizi kurang',
            'gizi baik',
        ];

        if (auth()->user()->hasRole('orangtua')) {
            $pemeriksaanQuery = Pemeriksaan::with([
                'balita',
                'balita.orangtua',
                'detailpemeriksaan',
                'detailpemeriksaan.attribut',
                'polamakan'
            ])->whereHas('balita', function ($query) {
                $query->where('orang_tua_id', auth()->user()->id);
            });


            $pemeriksaan = $pemeriksaanQuery->get();
            return Inertia::render('user-dashboard', [
                'pemeriksaan' => $pemeriksaan,
            ]);
        }
        // Hitung jumlah pemeriksaan berdasarkan label gizi dalam bulan ini
        // Query pemeriksaan berdasarkan label gizi dalam bulan ini
        // 1. Pilih pemeriksaan yang memiliki label gizi dalam array $statusLabel
        // 2. Filter pemeriksaan berdasarkan bulan sekarang
        // 3. Ambil kolom label dan hitung jumlah pemeriksaan untuk setiap label
        // 4. Group hasil query berdasarkan label
        // 5. Ambil hasil query dalam bentuk array asosiatif dengan key label dan value jumlah pemeriksaan
        $Gizi = Pemeriksaan::wherein('label', $statusLabel)
            ->whereMonth('tgl_pemeriksaan', date('m'))
            ->selectRaw('label, count(*) as count')
            ->groupBy('label')
            ->pluck('count', 'label')
            ->toArray();
        // Jika tidak ada data, inisialisasi dengan nol untuk setiap label
        foreach ($statusLabel as $label) {
            if (!array_key_exists($label, $Gizi)) {
                $Gizi[$label] = 0;
            }
        }
        $chartPemeriksaan = $this->pemeriksaan();

        return Inertia::render('dashboard', [
            'orangtuacount' => User::count(),
            'attributcount' => Attribut::count(),
            'pemeriksaancount' => Pemeriksaan::count(),
            'datasetcount' => Dataset::count(),
            'gizi' => $Gizi,
            'statusLabel' => $statusLabel,
            'chartPemeriksaan' => $chartPemeriksaan,
        ]);
    }

    public function pemeriksaan()
    {
        $pemeriksaan = Pemeriksaan::selectRaw('MONTH(tgl_pemeriksaan) as bulan, COUNT(*) as count')
            ->whereYear('tgl_pemeriksaan', date('Y'))
            ->groupByRaw('MONTH(tgl_pemeriksaan)')
            ->pluck('count', 'bulan')
            ->toArray();

        $bulan = array_fill(1, 12, 0);
        foreach ($pemeriksaan as $key => $value) {
            $bulan[$key] = $value;
        }

        $result = [
            'label' => ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'],
            'data' => array_values($bulan)
        ];

        return $result;
    }
    public function pemeriksaanGizi()
    {
        $pemeriksaan = Pemeriksaan::with('balita')->get();

        $gizi = [
            'gizi_buruk' => 0,
            'gizi_kurang' => 0,
            'gizi_baik' => 0,
            'gizi_lebih' => 0,
        ];

        foreach ($pemeriksaan as $item) {
            $status = $item->balita->status_gizi;
            if (array_key_exists($status, $gizi)) {
                $gizi[$status]++;
            }
        }

        return response()->json($gizi);
    }
}
