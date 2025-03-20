<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Balita;
use App\Models\Attribut;
use App\Models\Pemeriksaan;
use App\Models\DetailPemeriksaan;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;

class PemeriksaanController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pemeriksaans = Pemeriksaan::with(['fiturpemeriksaan'])->paginate(10);
        return Inertia::render('admin/pemeriksaan/index', [
            'pemeriksaans' => $pemeriksaans
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/pemeriksaan/create', [
            'attribut' => Attribut::orderBy('id', 'asc')->get(),
            'label' => [
                ['nama' => 'gizi buruk'],
                ['nama' => 'gizi kurang'],
                ['nama' => 'gizi baik'],
                ['nama' => 'gizi lebih'],
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemeriksaanRequest $request)
    {
        $attribut =  Attribut::orderBy('id', 'asc')->get();

        $balita = Balita::find($request->balita_id);

        $pemeriksaan = Pemeriksaan::create([
            'balita_id' => $request->input('balita_id'),
            'data_balita'=> $balita,
            'data_pemeriksaan' => $request->input('data_pemeriksaan'),
            'tgl_pemeriksaan' => $request->input('tgl_pemeriksaan'),
            'label' => $request->input('label'),
        ]);

        foreach ($attribut as $key => $value) {
            DetailPemeriksaan::create([
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $value->id,
                'nilai' => $request->attribut[$key],
            ]);
        }

        return redirect()->route('admin.pemeriksaan.index')->with('success', 'data pemeriksaan berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pemeriksaan $pemeriksaan)
    {
        return Inertia::render('admin/pemeriksaan/show', [
            'pemeriksaan' => $pemeriksaan
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pemeriksaan $pemeriksaan)
    {
        return Inertia::render('admin/pemeriksaan/edit', [
            'attribut' => Attribut::orderBy('id', 'asc')->get(),
            'label' => [
                ['nama' => 'gizi buruk'],
                ['nama' => 'gizi kurang'],
                ['nama' => 'gizi baik'],
                ['nama' => 'gizi lebih'],
            ],
            'pemeriksaan' => $pemeriksaan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemeriksaanRequest $request, Pemeriksaan $pemeriksaan)
    {
        $attribut =  Attribut::orderBy('id', 'asc')->get();

        $balita = Balita::find($request->balita_id);

        $pemeriksaan->update([
            'balita_id' => $request->input('balita_id'),
            'data_balita'=> $balita,
            'data_pemeriksaan' => $request->input('data_pemeriksaan'),
            'tgl_pemeriksaan' => $request->input('tgl_pemeriksaan'),
            'label' => $request->input('label'),
        ]);

        DetailPemeriksaan::where('pemeriksaan_id', $pemeriksaan->id)->delete();

        foreach ($attribut as $key => $value) {
            DetailPemeriksaan::create([
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $value->id,
                'nilai' => $request->attribut[$key],
            ]);
        }

        return redirect()->route('admin.pemeriksaan.index')->with('success', 'data pemeriksaan berhasil diupdate!!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->delete();
        return redirect()->route('admin.pemeriksaan.index')->with('success', 'data pemeriksaan berhasil dihapus!!');
    }
}
