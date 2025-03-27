<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePemeriksaanBalitaIdRequest;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Balita;
use App\Models\Attribut;
use App\Models\Pemeriksaan;
use App\Models\DetailPemeriksaan;
use App\Http\Requests\StorePemeriksaanRequest;
use App\Http\Requests\UpdatePemeriksaanRequest;
use App\Models\User;
use Illuminate\Http\Request;

class PemeriksaanController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $pemeriksaanQuery = Pemeriksaan::query();

        if ($request->filled('search')) {
            $pemeriksaanQuery->searchByBalita($request->input('search'));
        }

        $orderBy = $request->input('order_by', 'asc');

        if (in_array($orderBy, ['asc', 'desc'])) {
            $pemeriksaanQuery->orderBy('created_at', $orderBy);
        } elseif (in_array($orderBy, ['A-Z', 'Z-A'])) {
            $pemeriksaanQuery->orderBy('name', $orderBy === 'A-Z' ? 'asc' : 'desc');
        } elseif (in_array($orderBy, ['Laki-laki', 'Perempuan'])) {
            $pemeriksaanQuery->searchByJenkel($orderBy);
        }

        if($request->filled('date')){
            $pemeriksaanQuery->searchByTanggal($request->date);
        }
        $pemeriksaan = $pemeriksaanQuery
            ->with(['balita', 'balita.orangtua'])
            ->paginate($request->input('per_page', 10));

        return Inertia::render('admin/pemeriksaan/index', [
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data pemeriksaan',
                    'href' => '/admin/pemeriksaan/',
                ],
            ],
            'filter' => $request->only('search', 'order_by', 'date', 'q'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/pemeriksaan/create', [
            'attribut' => Attribut::orderBy('id', 'asc')->whereNotIn('nama', ['jenis kelamin', 'status'])->get(),
            'orangtua' => User::withoutRole('admin')->get(),
            'label' => [
                ['nama' => 'gizi buruk'],
                ['nama' => 'gizi kurang'],
                ['nama' => 'gizi baik'],
                ['nama' => 'gizi lebih'],
            ],
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data pemeriksaan',
                    'href' => '/admin/pemeriksaan/',
                ],
                [
                    'title' => 'tambah pemeriksaan',
                    'href' => '/admin/pemeriksaan/create',
                ],
            ],
        ]);
    }
    public function createById()
    {
        return Inertia::render('admin/pemeriksaan/create-id', [
            'attribut' => Attribut::orderBy('id', 'asc')->whereNotIn('nama', ['jenis kelamin', 'status'])->get(),
            'orangtua' => User::withoutRole('admin')->get(),
            'balita'=> Balita::orderBy('id', 'asc')->get(),
            'label' => [
                ['nama' => 'gizi buruk'],
                ['nama' => 'gizi kurang'],
                ['nama' => 'gizi baik'],
                ['nama' => 'gizi lebih'],
            ],
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data pemeriksaan',
                    'href' => '/admin/pemeriksaan/',
                ],
                [
                    'title' => 'tambah pemeriksaan',
                    'href' => '/admin/pemeriksaan/create',
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemeriksaanRequest $request)
    {
       try{
        $balita = Balita::create($request->except('attribut', 'tanggal_pemeriksaan'));

        $attribut = $request->input('attribut');
        $label = 'GIZI??';
        $pemeriksaan = Pemeriksaan::create([
            'balita_id' => $balita->id,
            'data_balita'=> json_encode($balita),
            'data_pemeriksaan'=> json_encode($attribut),
            'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
            'label' => $label,
        ]);

        foreach ($attribut as $item) {
            DetailPemeriksaan::create([
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $item['attribut_id'],
                'nilai' => $item['nilai'],
            ]);
        }

        $jenkelAttribut = Attribut::where('nama', 'like', '%jenis kelamin%')->first();
        $statusAttribut = Attribut::where('nama', 'like', '%status%')->first();
        if ($jenkelAttribut) {
            DetailPemeriksaan::create([
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $jenkelAttribut->id,
                'nilai' => $balita->jenis_kelamin,
            ]);
        }
        if ($statusAttribut) {
            DetailPemeriksaan::create([
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $statusAttribut->id,
                'nilai' => $label,
            ]);
        }

        return redirect()->route('admin.pemeriksaan.index')->with('success', 'data pemeriksaan berhasil ditambahkan!!');
       }catch(\Exception $e){
        return redirect()->route('admin.pemeriksaan.index')->with('error', 'terjadi kesalahan '. $e->getMessage());
       }
    }
    public function storeByBalita(StorePemeriksaanBalitaIdRequest $request)
    {
        try{
            $balita = Balita::find($request->balita_id);

            $attribut = $request->input('attribut');
            $label = 'GIZI??';
            $pemeriksaan = Pemeriksaan::create([
                'balita_id' => $balita->id,
                'data_balita'=> json_encode($balita),
                'data_pemeriksaan'=> json_encode($attribut),
                'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
                'label' => $label,
            ]);

            foreach ($attribut as $item) {
                DetailPemeriksaan::create([
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'attribut_id' => $item['attribut_id'],
                    'nilai' => $item['nilai'],
                ]);
            }

            $jenkelAttribut = Attribut::where('nama', 'like', '%jenis kelamin%')->first();
            $statusAttribut = Attribut::where('nama', 'like', '%status%')->first();
            if ($jenkelAttribut) {
                DetailPemeriksaan::create([
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'attribut_id' => $jenkelAttribut->id,
                    'nilai' => $balita->jenis_kelamin,
                ]);
            }
            if ($statusAttribut) {
                DetailPemeriksaan::create([
                    'pemeriksaan_id' => $pemeriksaan->id,
                    'attribut_id' => $statusAttribut->id,
                    'nilai' => $label,
                ]);
            }

            return redirect()->route('admin.pemeriksaan.index')->with('success', 'data pemeriksaan berhasil ditambahkan!!');
           }catch(\Exception $e){
            return redirect()->route('admin.pemeriksaan.index')->with('error', 'terjadi kesalahan '. $e->getMessage());
           }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pemeriksaan $pemeriksaan)
    {
        $pemeriksaan->load(['balita', 'balita.orangtua', 'detailpemeriksaan', 'detailpemeriksaan.attribut']);
        return Inertia::render('admin/pemeriksaan/show', [
            'pemeriksaan' => $pemeriksaan,
            'balita' => $pemeriksaan->balita,
            'orangTua' => $pemeriksaan->balita->orangtua,
            'detail' => $pemeriksaan->detailpemeriksaan,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data pemeriksaan',
                    'href' => '/admin/pemeriksaan/',
                ],
                [
                    'title' => 'detail pemeriksaan',
                    'href' => '/admin/pemeriksaan/show',
                ],
            ],
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
            'pemeriksaan' => $pemeriksaan,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data pemeriksaan',
                    'href' => '/admin/pemeriksaan/',
                ],
                [
                    'title' => 'edit pemeriksaan',
                    'href' => '/admin/pemeriksaan/edit',
                ],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemeriksaanRequest $request, Pemeriksaan $pemeriksaan)
    {
        $attribut =  Attribut::orderBy('id', 'asc')->get();

        $pemeriksaan = Balita::find($request->pemeriksaan_id);

        $pemeriksaan->update([
            'pemeriksaan_id' => $request->input('pemeriksaan_id'),
            'data_pemeriksaan' => $pemeriksaan,
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
