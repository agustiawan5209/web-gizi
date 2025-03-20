<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Dataset;
use App\Http\Requests\StoreDatasetRequest;
use App\Http\Requests\UpdateDatasetRequest;
use App\Models\Attribut;
use App\Models\FiturDataset;
use Carbon\Carbon;

class DatasetController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $datasets = Dataset::with(['fiturdataset'])->paginate(10);
        return Inertia::render('admin/dataset/index', [
            'datasets' => $datasets
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/dataset/create', [
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
    public function store(StoreDatasetRequest $request)
    {
        $tgl = Carbon::now()->format('Y-m-d');
        $attribut =  Attribut::orderBy('id', 'asc')->get();

        $dataset = Dataset::create([
            'tgl' => $tgl,
            'label' => $request->input('label'),
        ]);
        foreach ($attribut as $key => $value) {
            FiturDataset::create([
                'dataset_id' => $dataset->id,
                'attribut_id' => $value->id,
                'nilai' => $request->attribut[$key],
            ]);
        }

        return redirect()->route('admin.dataset.index')->with('success', 'data dataset berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Dataset $dataset)
    {
        return Inertia::render('admin/dataset/show', [
            'dataset' => $dataset
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dataset $dataset)
    {
        return Inertia::render('admin/dataset/edit', [
            'attribut' => Attribut::orderBy('id', 'asc')->get(),
            'label' => [
                ['nama' => 'gizi buruk'],
                ['nama' => 'gizi kurang'],
                ['nama' => 'gizi baik'],
                ['nama' => 'gizi lebih'],
            ],
            'dataset' => $dataset
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDatasetRequest $request, Dataset $dataset)
    {
        $tgl = Carbon::now()->format('Y-m-d');
        $attribut =  Attribut::orderBy('id', 'asc')->get();

        $dataset->update([
            'tgl' => $tgl,
            'label' => $request->input('label'),
        ]);
        FiturDataset::where('dataset_id', $dataset->id)->delete();

        foreach ($attribut as $key => $value) {
            FiturDataset::create([
                'dataset_id' => $dataset->id,
                'attribut_id' => $value->id,
                'nilai' => $request->attribut[$key],
            ]);
        }

        return redirect()->route('admin.dataset.index')->with('success', 'data dataset berhasil diupdate!!');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dataset $dataset)
    {
        $dataset->delete();
        return redirect()->route('admin.dataset.index')->with('success', 'data dataset berhasil dihapus!!');
    }
}
