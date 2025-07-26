<?php

namespace App\Http\Controllers\OrangTua;

use Inertia\Inertia;
use App\Models\Pemeriksaan;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {

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
    public function naivebayes()
    {
        return Inertia::render('orangtua/naive-bayes');
    }

}
