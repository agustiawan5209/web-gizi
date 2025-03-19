<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Attribut;
use App\Http\Requests\StoreAttributRequest;
use App\Http\Requests\UpdateAttributRequest;
use Illuminate\Http\Request;

class AttributController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('admin/attribut/index', [
            'attribut' => Attribut::searchByNama($request->nama)->paginate($request->per_page),
            'breadcrumbs'=> [],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/attribut/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttributRequest $request)
    {
        $attribut = Attribut::create($request->all());
        return redirect()->route('admin.attribut.index')->with('success','data attribut berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attribut $attribut)
    {
        return Inertia::render('admin/attribut/show', [
            'attribut'=> $attribut
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attribut $attribut)
    {
        return Inertia::render('admin/attribut/edit', [
            'attribut'=> $attribut
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttributRequest $request, Attribut $attribut)
    {
        $attribut->update($request->all());
        return redirect()->route('admin.attribut.index')->with('success','data attribut berhasil diupdate!!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribut $attribut)
    {
        $attribut->delete();
        return redirect()->route('admin.attribut.index')->with('success','data attribut berhasil dihapus!!');
    }
}
