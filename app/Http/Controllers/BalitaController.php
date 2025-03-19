<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Balita;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBalitaRequest;
use App\Http\Requests\UpdateBalitaRequest;

class BalitaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render("admin/balita/index", [
            'balitas' => Balita::with(['orang_tua'])
            ->searchByName($request->nama)
            ->searchByTempatLahir($request->tempatLahir)
            ->searchByTglLahir($request->tgl_lahir)
            ->searchByJenkel($request->jenkel)
            ->paginate($request->per_page ?? 10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    return Inertia::render('admin/balita/create', [
        'orang_tua' => User::role('orangtua')->get(),
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBalitaRequest $request)
    {
        $balita = Balita::create($request->all());
        return redirect()->route('balita.index')->with('success','Balita berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Balita $balita)
    {
        return Inertia::render('admin/balita/show', [
            'balita'=> $balita
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Balita $balita)
    {
        return Inertia::render('admin/balita/edit', [
            'balita'=> $balita,
            'orang_tua' => User::role('orangtua')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBalitaRequest $request, Balita $balita)
    {
        $balita->update($request->all());
        return redirect()->route('balita.index')->with('success','Balita berhasil diupdate!!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Balita $balita)
    {
        $balita->delete();
        return redirect()->route('balita.index')->with('success','Balita berhasil dihapus!!');
    }
}
