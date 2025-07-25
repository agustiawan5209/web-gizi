<?php

namespace App\Http\Controllers\OrangTua;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Balita;
use App\Models\Attribut;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PemeriksaanController extends Controller
{
    private const STATUS_LABELS = [
        'gizi buruk',
        'gizi kurang',
        'gizi baik',
        'gizi lebih',
    ];


    public function index(){
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
            return Inertia::render('orangtua/pemeriksaan/index', [
                'pemeriksaan' => $pemeriksaan,
            ]);
    }
    public function create(Request $request)
    {
        return Inertia::render('orangtua/pemeriksaan/create', [
            'attribut' => Attribut::orderBy('id')
                ->whereNotIn('nama', ['jenis kelamin', 'status'])
                ->get(),
            'orangtua' => User::withoutRole('admin')->get(),
            'balita' => Balita::orderBy('id')->with(['orangtua'])->get(),
            'label' => array_map(fn($label) => ['nama' => $label], self::STATUS_LABELS),
            [
                'title' => 'tambah pemeriksaan',
                'href' => '/pemeriksaan/create',
            ],
        ]);
    }
}
