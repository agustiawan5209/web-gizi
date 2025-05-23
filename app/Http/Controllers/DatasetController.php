<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Dataset;
use App\Http\Requests\StoreDatasetRequest;
use App\Http\Requests\UpdateDatasetRequest;
use App\Models\Attribut;
use App\Models\FiturDataset;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DatasetController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'data dataset',
            'href' => '/admin/dataset/',
        ],
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $statusLabel = [
            'gizi buruk',
            'gizi kurang',
            'gizi baik',
            'gizi lebih',
        ];
        $datasetQuery = Dataset::query();

        $orderBy = $request->input('order_by', 'asc');

        if (in_array($orderBy, ['asc', 'desc'])) {
            $datasetQuery->orderBy('created_at', $orderBy);
        } elseif (in_array($orderBy, $statusLabel)) {
            $datasetQuery->where('label', '=', $orderBy);
        }

        if ($request->filled('date')) {
            $datasetQuery->searchByTanggal($request->date);
        }
        $dataset = $datasetQuery
            ->with(['fiturdataset'])
            ->paginate($request->input('per_page', 10));

        return Inertia::render('admin/dataset/index', [
            'dataset' => $dataset,
            'attribut' => Attribut::orderBy('id', 'asc')->get(),
          'breadcrumb' => self::BASE_BREADCRUMB,
            'statusLabel' => $statusLabel,
            'filter' => $request->only('search', 'order_by', 'date', 'q'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/dataset/create', [
            'attribut' => Attribut::orderBy('id', 'asc')->whereNotIn('nama', ['jenis kelamin', 'status'])->get(),
            'statusLabel' => [
                'gizi buruk',
                'gizi kurang',
                'gizi baik',
                'gizi lebih',
            ],
            'breadcrumb'=> array_merge(self::BASE_BREADCRUMB,[
                [
                    'title'=> 'tambah data',
                    'href'=> '/admin/dataset/create',
                ],
            ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDatasetRequest $request)
    {
        try {
            $attribut = $request->input('attribut');
            $label = $request->label;
            $dataset = Dataset::create([
                'tgl' => Carbon::now()->format('y-m-d'),
                'label' => $label,
            ]);

            foreach ($attribut as $item) {
                FiturDataset::create([
                    'dataset_id' => $dataset->id,
                    'attribut_id' => $item['attribut_id'],
                    'nilai' => $item['nilai'],
                ]);
            }

            $jenkelAttribut = Attribut::where('nama', 'like', '%jenis kelamin%')->first();
            $statusAttribut = Attribut::where('nama', 'like', '%status%')->first();
            if ($jenkelAttribut) {
                FiturDataset::create([
                    'dataset_id' => $dataset->id,
                    'attribut_id' => $jenkelAttribut->id,
                    'nilai' => $request->jenis_kelamin,
                ]);
            }
            if ($statusAttribut) {
                FiturDataset::create([
                    'dataset_id' => $dataset->id,
                    'attribut_id' => $statusAttribut->id,
                    'nilai' => $label,
                ]);
            }

            return redirect()->route('admin.dataset.index')->with('success', 'data dataset berhasil ditambahkan!!');
        } catch (\Exception $e) {
            return redirect()->route('admin.dataset.index')->with('error', 'terjadi kesalahan ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Dataset $dataset)
    {
        return Inertia::render('admin/dataset/show', [
            'dataset' => $dataset,
            'breadcrumb'=> array_merge(self::BASE_BREADCRUMB,[
                [
                    'title'=> 'detail data',
                    'href'=> '/admin/dataset/show',
                ],
            ])
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
            'dataset' => $dataset,
            'breadcrumb'=> array_merge(self::BASE_BREADCRUMB,[
                [
                    'title'=> 'edit data',
                    'href'=> '/admin/dataset/edit',
                ],
            ])
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
