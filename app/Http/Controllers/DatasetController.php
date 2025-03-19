<?php

namespace App\Http\Controllers;

use App\Models\Dataset;
use App\Http\Requests\StoreDatasetRequest;
use App\Http\Requests\UpdateDatasetRequest;

class DatasetController extends Controller
{

    /**
     * Controller Masih Kosong Karena Fitur Dataset Masih Belum Ada
     * Kerjakan setelah Design Halaman 40-70% selesai
     * @return void
     */
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDatasetRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Dataset $dataset)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dataset $dataset)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDatasetRequest $request, Dataset $dataset)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dataset $dataset)
    {
        //
    }
}
