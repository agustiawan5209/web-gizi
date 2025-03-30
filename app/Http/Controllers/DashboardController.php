<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Balita;
use App\Models\Dataset;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $statusLabel = [
            'gizi buruk',
            'gizi kurang',
            'gizi baik',
            'gizi lebih',
        ];

        $Gizi = [];
        foreach ($statusLabel as  $value) {
            $Gizi[] = intval(Dataset::where('label', $value)->count());
        }
        $chartPemeriksaan = $this->pemeriksaan();
        return Inertia::render('dashboard', [
            'orangtuacount' => User::all()->count(),
            'balitacount' => Balita::all()->count(),
            'pemeriksaancount' => Pemeriksaan::all()->count(),
            'datasetcount' => Dataset::all()->count(),
            'gizi' => $Gizi,
            'statusLabel'=> $statusLabel,
            'chartPemeriksaan'=> $chartPemeriksaan,

        ]);
    }

    public function pemeriksaan() {
        $oldPemeriksaan = Pemeriksaan::orderBy('tgl_pemeriksaan', 'desc')->first();
        $oldPemeriksaanDate = $oldPemeriksaan ? $oldPemeriksaan->tgl_pemeriksaan : null;
        $bulan = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agu', 'sep', 'okt', 'nov', 'des'];

        $pemeriksaan = array_fill(0, 12, 0);

        for ($i = 1; $i <= 12; $i++) {
            $pemeriksaan[$i - 1] = Pemeriksaan::whereMonth('tgl_pemeriksaan', $i)->count();
        }

        return [
            'label' => $bulan,
            'data' => $pemeriksaan
        ];
    }
}
