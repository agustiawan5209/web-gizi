<?php

namespace App\Http\Controllers\Orangtua;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Balita;
use App\Models\Attribut;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBalitaRequest;
use App\Http\Requests\UpdateBalitaRequest;
use App\Models\Pemeriksaan;

class BalitaController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'data balita',
            'href' => '/orangtua/balita/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Balita::query();
        $query->where('orang_tua_id', auth()->user()->id);
        if ($request->filled('q')) {
            $query->searchByNama($request->input('q', ''));
        }

        if ($request->filled('order_by')) {
            $orderBy = $request->input('order_by');
            if (in_array($orderBy, ['Laki-laki', 'Perempuan'])) {
                $query->searchByJenkel($orderBy);
            }
        }

        $balita = $query->with(['orangtua'])->get();

        return Inertia::render('orangtua/balita/index', [
            'balita' => $balita,
            'breadcrumb' => self::BASE_BREADCRUMB,
            'filter' => $request->only('q'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('orangtua/balita/create', [
            'orangtua' => User::role('orangtua')->get(),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah data',
                    'href' => '/orangtua/balita/create',
                ],
            ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBalitaRequest $request)
    {
        $balita = Balita::create($request->all());
        return redirect()->route('orangtua.balita.index')->with('success', 'Balita berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->load([
            'balita',
            'balita.orangtua',
            'balita.pemeriksaan',
            'balita.pemeriksaan.detailpemeriksaan',
            'detailpemeriksaan',
            'detailpemeriksaan.attribut',
            'polamakan'
        ]);
        return Inertia::render('orangtua/balita/show', [
            'pemeriksaan' => $pemeriksaan,
            'balita' => $pemeriksaan->balita,
            'orangTua' => $pemeriksaan->balita->orangtua,
            'detail' => $pemeriksaan->detailpemeriksaan,
            'dataPemeriksaanBalita' => $pemeriksaan->balita->pemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail pemeriksaan',
                    'href' => '/pemeriksaan/show',
                ],
            ]),
            'polamakan' => $pemeriksaan->polamakan,
            'attribut' => Attribut::orderBy('id', 'asc')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Balita $balita)
    {
        $balita->load(['orangtua']);
        return Inertia::render('orangtua/balita/edit', [
            'balita' => $balita,
            'orangtua' => User::role('orangtua')->get(),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit data',
                    'href' => '/orangtua/balita/edit',
                ],
            ])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBalitaRequest $request, Balita $balita)
    {
        $balita->update($request->all());
        return redirect()->route('orangtua.balita.index')->with('success', 'Balita berhasil diupdate!!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Balita $balita)
    {
        $balita->delete();
        return redirect()->route('orangtua.balita.index')->with('success', 'Balita berhasil dihapus!!');
    }
}
