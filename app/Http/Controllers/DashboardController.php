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
        return Inertia::render('dashboard', [
            'orangtuacount' => User::all()->count(),
            'balitacount' => Balita::all()->count(),
            'pemeriksaancount' => Pemeriksaan::all()->count(),
            'datasetcount' => Dataset::all()->count(),
            'gizi' => $Gizi,
            'statusLabel'=> $statusLabel
        ]);
    }
}
