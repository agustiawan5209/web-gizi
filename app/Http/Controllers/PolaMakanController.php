<?php

namespace App\Http\Controllers;

use App\Models\PolaMakan;
use App\Http\Requests\StorePolaMakanRequest;
use App\Http\Requests\UpdatePolaMakanRequest;
use App\Models\Pemeriksaan;
use Inertia\Inertia;

class PolaMakanController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'data pemeriksaan',
            'href' => '/admin/pemeriksaan/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->find(1);
        $pemeriksaan->load(['balita', 'balita.orangtua', 'detailpemeriksaan', 'detailpemeriksaan.attribut']);


        return Inertia::render('admin/polamakan/index', [
            'pemeriksaan' => $pemeriksaan,
            'balita' => $pemeriksaan->balita,
            'orangTua' => $pemeriksaan->balita->orangtua,
            'detail' => $pemeriksaan->detailpemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                'title' => 'detail pola-makan',
                'href' => '/admin/pola-makan/create',
            ],),
        ]);
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePolaMakanRequest $request)
    {
        $polaMakan = PolaMakan::create($request->all());
        return redirect()->route('admin.pemeriksaan.index')->with('success', 'data pemeriksaan berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PolaMakan $polaMakan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PolaMakan $polaMakan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePolaMakanRequest $request, PolaMakan $polaMakan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PolaMakan $polaMakan)
    {
        //
    }
}
