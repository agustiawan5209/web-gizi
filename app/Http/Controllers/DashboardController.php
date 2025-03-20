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
    public function index(Request $request){
        return Inertia::render('dashboard', [
            'orangtuacount'=> User::role('orangtua')->get()->count(),
            'balita'=> Balita::all()->count(),
            'pemeriksaan'=> Pemeriksaan::all()->count(),
            'dataset'=> Dataset::all()->count(),
        ]);
    }
}
