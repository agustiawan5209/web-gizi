<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePemeriksaanBalitaIdRequest;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;
use App\Models\Attribut;
use App\Models\Balita;
use App\Models\DetailPemeriksaan;
use App\Models\Pemeriksaan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PemeriksaanController extends Controller
{
    private const STATUS_LABELS = [
        'gizi buruk',
        'gizi kurang',
        'gizi baik',
        'gizi lebih',
    ];

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
    public function index(Request $request)
    {
        $pemeriksaanQuery = Pemeriksaan::with([
            'balita',
            'balita.orangtua',
            'detailpemeriksaan',
            'detailpemeriksaan.attribut',
            'polamakan'
        ]);

        // Apply filters
        $this->applyFilters($pemeriksaanQuery, $request);

        $pemeriksaan = $pemeriksaanQuery->paginate($request->input('per_page', 10));

        return Inertia::render('admin/pemeriksaan/index', [
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => self::BASE_BREADCRUMB,
            'filter' => $request->only('search', 'order_by', 'date', 'q'),
            'statusLabel' => self::STATUS_LABELS
        ]);
    }

    /**
     * Apply filters to the query
     */
    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('q')) {
            $query->searchByBalita($request->input('q'));
        }

        if ($request->filled('date')) {
            $query->searchByTanggal(Carbon::parse($request->date));
        }

        if (in_array($request->input('order_by'), ['asc', 'desc'])) {
            $query->orderBy('created_at', $request->input('order_by'));
        } elseif (in_array($request->input('order_by'), ['A-Z', 'Z-A'])) {
            $direction = $request->input('order_by') === 'A-Z' ? 'asc' : 'desc';
            $query->orderBy('label', $direction);
        } elseif (in_array($request->input('order_by'), self::STATUS_LABELS)) {
            $query->where('label', $request->input('order_by'));
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/pemeriksaan/create', [
            'attribut' => Attribut::orderBy('id')
                ->whereNotIn('nama', ['jenis kelamin', 'status'])
                ->get(),
            'orangtua' => User::withoutRole('admin')->get(),
            'label' => array_map(fn($label) => ['nama' => $label], self::STATUS_LABELS),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah pemeriksaan',
                    'href' => '/admin/pemeriksaan/create',
                ],
            ]),
        ]);
    }

    public function createById()
    {
        return Inertia::render('admin/pemeriksaan/create-id', [
            'attribut' => Attribut::orderBy('id')
                ->whereNotIn('nama', ['jenis kelamin', 'status'])
                ->get(),
            'orangtua' => User::withoutRole('admin')->get(),
            'balita' => Balita::orderBy('id')->get(),
            'label' => array_map(fn($label) => ['nama' => $label], self::STATUS_LABELS),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah pemeriksaan',
                    'href' => '/admin/pemeriksaan/create',
                ],
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemeriksaanRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $balita = Balita::create($request->except('attribut', 'tanggal_pemeriksaan'));

            $pemeriksaan = $this->createPemeriksaan($balita, $request);

            $this->createDetailPemeriksaan($pemeriksaan, $request->input('attribut'), $balita->jenis_kelamin);

            $this->classifyAndUpdateLabel($pemeriksaan);

            return redirect()
                ->route('admin.pola-makan.index', ['pemeriksaan' => $pemeriksaan->id])
                ->with('success', 'Data pemeriksaan berhasil ditambahkan!');
        });
    }

    public function storeByBalita(StorePemeriksaanBalitaIdRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $balita = Balita::findOrFail($request->balita_id);

            $pemeriksaan = $this->createPemeriksaan($balita, $request);

            $this->createDetailPemeriksaan($pemeriksaan, $request->input('attribut'), $balita->jenis_kelamin);

            $this->classifyAndUpdateLabel($pemeriksaan);

            return redirect()
                ->route('admin.pola-makan.index', ['pemeriksaan' => $pemeriksaan->id])
                ->with('success', 'Data pemeriksaan berhasil ditambahkan!');
        });
    }

    /**
     * Create pemeriksaan record
     */
    private function createPemeriksaan(Balita $balita, $request): Pemeriksaan
    {
        return Pemeriksaan::create([
            'balita_id' => $balita->id,
            'data_balita' => json_encode($balita),
            'data_pemeriksaan' => json_encode($request->input('attribut')),
            'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
        ]);
    }

    /**
     * Create detail pemeriksaan records
     */
    private function createDetailPemeriksaan(Pemeriksaan $pemeriksaan, array $attribut, string $jenisKelamin): void
    {
        $detailRecords = array_map(function ($item) use ($pemeriksaan) {
            return [
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $item['attribut_id'],
                'nilai' => $item['nilai'],
            ];
        }, $attribut);

        // Add jenis kelamin attribute if exists
        if ($jenkelAttribut = Attribut::where('nama', 'like', '%jenis kelamin%')->first()) {
            $detailRecords[] = [
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $jenkelAttribut->id,
                'nilai' => $jenisKelamin,
            ];
        }

        DetailPemeriksaan::insert($detailRecords);
    }

    /**
     * Classify and update label using Naive Bayes
     */
    private function classifyAndUpdateLabel(Pemeriksaan $pemeriksaan): void
    {
        $naive = new NaiveBayesController($pemeriksaan->id);
        $klasifikasi = $naive->generate();

        if ($klasifikasi['success']) {
            $label = $klasifikasi['hasil_prediksi'];
            $pemeriksaan->update(['label' => $label]);

            if ($statusAttribut = Attribut::where('nama', 'like', '%status%')->first()) {
                $fullLabel = $label . " - akurasi=" . $klasifikasi['akurasi'];
                DetailPemeriksaan::create([
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'attribut_id' => $statusAttribut->id,
                    'nilai' => $fullLabel,
                ]);
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->load([
            'balita',
            'balita.orangtua',
            'detailpemeriksaan',
            'detailpemeriksaan.attribut',
            'polamakan'
        ]);

        return Inertia::render('admin/pemeriksaan/show', [
            'pemeriksaan' => $pemeriksaan,
            'balita' => $pemeriksaan->balita,
            'orangTua' => $pemeriksaan->balita->orangtua,
            'detail' => $pemeriksaan->detailpemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail pemeriksaan',
                    'href' => '/admin/pemeriksaan/show',
                ],
            ]),
            'polamakan' => $pemeriksaan->polamakan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pemeriksaan $pemeriksaan)
    {
        return Inertia::render('admin/pemeriksaan/edit', [
            'attribut' => Attribut::orderBy('id')->get(),
            'label' => array_map(fn($label) => ['nama' => $label], self::STATUS_LABELS),
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit pemeriksaan',
                    'href' => '/admin/pemeriksaan/edit',
                ],
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemeriksaanRequest $request, Pemeriksaan $pemeriksaan)
    {
        DB::transaction(function () use ($request, $pemeriksaan) {
            $pemeriksaan->update([
                'data_pemeriksaan' => $request->input('data_pemeriksaan'),
                'tgl_pemeriksaan' => $request->input('tgl_pemeriksaan'),
                'label' => $request->input('label'),
            ]);

            DetailPemeriksaan::where('pemeriksaan_id', $pemeriksaan->id)->delete();

            $detailRecords = array_map(function ($attributId, $nilai) use ($pemeriksaan) {
                return [
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'attribut_id' => $attributId,
                    'nilai' => $nilai,
                ];
            }, array_keys($request->attribut), $request->attribut);

            DetailPemeriksaan::insert($detailRecords);
        });

        return redirect()
            ->route('admin.pemeriksaan.index')
            ->with('success', 'Data pemeriksaan berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->delete();

        return redirect()
            ->route('admin.pemeriksaan.index')
            ->with('success', 'Data pemeriksaan berhasil dihapus!');
    }
}
