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
use App\Models\PolaMakan;

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
        if ($user->hasRole('orangtua')) {
            $query->wherehas('balita', function ($query) use ($user) {
                $query->where('orang_tua_id', $user->id);
            });
        }
    }

    /**
     * Show the form for creating a new resource.
     */

    public function createById(Request $request)
    {
        return Inertia::render('admin/pemeriksaan/create-id', [
            'attribut' => Attribut::orderBy('id')
                ->whereNotIn('nama', ['jenis kelamin', 'status'])
                ->get(),
            'orangtua' => User::withoutRole('admin')->get(),
            'balita' => Balita::orderBy('id')->with(['orangtua'])->get(),
            'label' => array_map(fn($label) => ['nama' => $label], self::STATUS_LABELS),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah pemeriksaan',
                    'href' => '/pemeriksaan/create',
                ],
            ]),
        ]);
    }

    public function createClassification(Request $request)
    {

        if ($request->filled('attribut')) {

            $datauji = $request->input('attribut');
            $detailRecords = [];
            $attributes = Attribut::all()->toArray();
            foreach ($attributes as $key => $value) {
                $attributes_id = $value['id'];
                $attributes_nama = strtolower($value['nama']);

                if ($attributes_nama !== 'status') {

                    $filtered = array_filter($datauji, fn($val) => $val['attribut_id'] == $attributes_id);

                    $firstMatch = reset($filtered); // ambil elemen pertama

                    $detailRecords[$attributes_nama] = $firstMatch['nilai'] ?? 0;
                }
                if ($attributes_nama === 'jenis kelamin' || $attributes_nama === 'jenkel') {
                    $detailRecords[$attributes_nama] = $request->input('jenis_kelamin');
                }
            }
            $naive = new NaiveBayesController(null, $detailRecords);
            $klasifikasi = $naive->generate();

            if ($klasifikasi['success']) {
                $label = $klasifikasi['hasil_prediksi'];
                $rekomendasi = match ($label) {
                    "gizi buruk" => "Tingkatkan asupan makanan bergizi tinggi, berikan makanan sumber protein seperti telur, ikan, dan daging, serta tambahkan susu, sayur, dan buah dalam porsi cukup.",
                    "gizi kurang" => "Perbanyak makanan yang mengandung kalori dan protein, seperti nasi, tahu, tempe, telur, serta sayuran hijau dan buah-buahan untuk menambah nutrisi.",
                    "gizi baik" => "Pertahankan pola makan seimbang dengan kombinasi karbohidrat, protein, sayur, dan buah. Pastikan cukup minum air dan tetap aktif berolahraga.",
                    "gizi lebih" => "Kurangi makanan berlemak dan tinggi gula, berikan lebih banyak sayur dan buah, serta atur porsi makanan agar tetap seimbang.",
                    default => "Label gizi tidak dikenali.",
                };
                return [
                    'label' => $label,
                    'rekomendasi' => $rekomendasi,
                    'detailRecords' => $detailRecords,
                ];
            }
        }
        return [
            'label' => '',
            'rekomendasi' => '',
            'detailRecords' => [],
        ];
    }


    public function store(StorePemeriksaanBalitaIdRequest $request)
    {
        // dd($request->all());
        // Validate the request

        try {
            $balitaData = $request->except('attribut', 'tanggal_pemeriksaan');

            $existingBalitaWithNama = Balita::where('nama', '=', $request->nama)->where('orang_tua_id', '=', $request->orang_tua_id)->first();
            if ($existingBalitaWithNama) {
                $balita = $existingBalitaWithNama;
            } else {

                $balita = Balita::create($balitaData);
            }

            $pemeriksaanData = [
                'balita_id' => $balita->id,
                'data_balita' => json_encode($balita),
                'data_pemeriksaan' => json_encode($request->input('attribut')),
                'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
                'label' => $request->input('label'),
                'alasan' => $request->input('alasan'),
            ];
            $pemeriksaan = Pemeriksaan::create($pemeriksaanData);

            $this->createDetailPemeriksaan($pemeriksaan, $request->input('attribut'), $balita->jenis_kelamin, $request->input('label'));
            PolaMakan::create([
                'pemeriksaan_id' => $pemeriksaan->id,
                'rekomendasi' => $request->input('rekomendasi'),
            ]);

            return redirect()
                ->route('pemeriksaan.show', ['pemeriksaan' => $pemeriksaan->id])
                ->with('success', 'Data pemeriksaan berhasil ditambahkan!');
        } catch (\Exception $exception) {
            $pemeriksaan = Pemeriksaan::latest()->first();
            if ($pemeriksaan) {
                $pemeriksaan->delete();
            }
            return redirect()
                ->route('pemeriksaan.create-id')
                ->with('error', $exception->getMessage());
        }
    }

    /**
     * Create detail pemeriksaan records
     */
    private function createDetailPemeriksaan(Pemeriksaan $pemeriksaan, array $attribut, string $jenisKelamin, $label): void
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
        if ($statusAttribut = Attribut::where('nama', 'like', '%status%')->first()) {
            $detailRecords[] = [
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $statusAttribut->id,
                'nilai' => $label,
            ];
        }

        DetailPemeriksaan::insert($detailRecords);
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

        return Inertia::render('admin/pemeriksaan/show', [
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
        Balita::find($pemeriksaan->balita_id)->delete();
        $pemeriksaan->delete();


        return redirect()
            ->route('pemeriksaan.index')
            ->with('success', 'Data pemeriksaan berhasil dihapus!');
    }
}
