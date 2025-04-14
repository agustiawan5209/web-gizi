<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Balita;
use App\Models\Attribut;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use App\Models\DetailPemeriksaan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;
use App\Http\Requests\StorePemeriksaanBalitaIdRequest;

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
            'href' => '/pemeriksaan/',
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
            'statusLabel' => self::STATUS_LABELS,
            'can' => [
                'add' => auth()->user()->can('add pemeriksaan'),
                'edit' => auth()->user()->can('edit pemeriksaan'),
                'delete' => auth()->user()->can('delete pemeriksaan'),
                'read' => auth()->user()->can('read pemeriksaan'),
            ]
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

        $user = Auth::user();
        if($user->hasRole('orangtua')){
            $query->wherehas('balita', function($query) use($user){
                $query->where('orang_tua_id', $user->id);
            });
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
                    'href' => '/pemeriksaan/create',
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
                    'href' => '/pemeriksaan/create',
                ],
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemeriksaanRequest $request)
    {
        try {
            $balitaData = $request->except('attribut', 'tanggal_pemeriksaan');
            $balita = Balita::create($balitaData);

            $pemeriksaanData = [
                'balita_id' => $balita->id,
                'data_balita' => json_encode($balita),
                'data_pemeriksaan' => json_encode($request->input('attribut')),
                'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
            ];
            $pemeriksaan = Pemeriksaan::create($pemeriksaanData);

            $this->createDetailPemeriksaan($pemeriksaan, $request->input('attribut'), $balita->jenis_kelamin);
            $this->classifyAndUpdateLabel($pemeriksaan);

            return redirect()
                ->route('pola-makan.index', ['pemeriksaan' => $pemeriksaan->id])
                ->with('success', 'Data pemeriksaan berhasil ditambahkan!');
        } catch (\Exception $exception) {
            $pemeriksaan = Pemeriksaan::latest()->first();
            if ($pemeriksaan) {
                $pemeriksaan->delete();
            }
            $balita->delete();
            return redirect()
                ->route('pemeriksaan.create')
                ->with('error', $exception->getMessage());
        }
    }

    public function storeByBalita(StorePemeriksaanBalitaIdRequest $request)
    {
        try {
            $balita = Balita::findOrFail($request->balita_id);

            $pemeriksaanData = [
                'balita_id' => $balita->id,
                'data_balita' => json_encode($balita),
                'data_pemeriksaan' => json_encode($request->input('attribut')),
                'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
            ];
            $pemeriksaan = Pemeriksaan::create($pemeriksaanData);

            $this->createDetailPemeriksaan($pemeriksaan, $request->input('attribut'), $balita->jenis_kelamin);
            $this->classifyAndUpdateLabel($pemeriksaan);

            return redirect()
                ->route('pola-makan.index', ['pemeriksaan' => $pemeriksaan->id])
                ->with('success', 'Data pemeriksaan berhasil ditambahkan!');
        } catch (\Exception $exception) {
            $pemeriksaan = Pemeriksaan::latest()->first();
            if ($pemeriksaan) {
                $pemeriksaan->delete();
            }
            $balita->delete();
            return redirect()
                ->route('pemeriksaan.create')
                ->with('error', $exception->getMessage());
        }
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
                    'href' => '/pemeriksaan/show',
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
                    'href' => '/pemeriksaan/edit',
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
            ->route('pemeriksaan.index')
            ->with('success', 'Data pemeriksaan berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->delete();

        return redirect()
            ->route('pemeriksaan.index')
            ->with('success', 'Data pemeriksaan berhasil dihapus!');
    }
}
