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
            'gizi buruk',
            'gizi kurang',
            'gizi baik',
            'gizi lebih',
        ];

        if (auth()->user()->hasRole('orangtua')) {
            $pemeriksaanQuery = Pemeriksaan::with([
                'balita',
                'balita.orangtua',
                'detailpemeriksaan',
                'detailpemeriksaan.attribut',
                'polamakan'
            ])->whereHas('balita', function($query){
                $query->where('orang_tua_id', auth()->user()->id);
            });


            $pemeriksaan = $pemeriksaanQuery->get();
            return Inertia::render('user-dashboard', [
                'pemeriksaan' => $pemeriksaan,
            ]);
        }
        $Gizi = Pemeriksaan::wherein('label', $statusLabel)
            ->selectRaw('label, count(*) as count')
            ->groupBy('label')
            ->pluck('count')
            ->toArray();

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
        $pemeriksaan = Pemeriksaan::selectRaw('month(tgl_pemeriksaan) as bulan, count(*) as count')
            ->groupByRaw('month(tgl_pemeriksaan)')
            ->pluck('count')
            ->toArray();

        $bulan = array_fill(1, 12, 0);
        foreach ($pemeriksaan as $key => $value) {
            $bulan[$key] = $value;
        }

        return [
            'label' => ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'],
            'data' => $bulan
        ];
    }
    public function pemeriksaanGizi(){
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
