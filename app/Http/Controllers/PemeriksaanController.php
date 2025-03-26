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
use App\Models\User;
use Illuminate\Http\Request;

class PemeriksaanController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Pemeriksaan::query();

        if ($request->filled('q')) {
            $query->searchByBalita($request->input('q', ''));
        }

        if ($request->filled('order_by')) {
            $orderBy = $request->input('order_by');
            if (in_array($orderBy, ['asc', 'desc'])) {
                $query->orderBy('created_at', $orderBy);
            } else if (in_array($orderBy, ['A-Z', 'Z-A'])) {
                if ($orderBy == 'A-Z') {
                    $query->orderBy('name', 'asc');
                } else {
                    $query->orderBy('name', 'desc');
                }
            } else if (in_array($orderBy, ['Laki-laki', 'Perempuan'])) {
                $query->searchByJenkel($orderBy);
            } else {
                // Handle invalid order_by value
                return redirect()->back()->withErrors(['order_by' => 'Invalid order_by value']);
            }
        }

        try {
            $pemeriksaan = $query->with(['balita', 'balita.orangtua'])->paginate($request->input('per_page', 10));
        } catch (\Exception $e) {
            // Handle pagination error
            return redirect()->back()->withErrors(['pagination' => 'Pagination failed: ' . $e->getMessage()]);
        }

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
            'filter' => $request->only('q'),
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemeriksaanRequest $request)
    {
       try{
        $balita = Balita::create($request->all());
        $attribut = $request->attribut;

        $pemeriksaan = Pemeriksaan::create([
            'balita_id' => $balita->id,
            'data_pemeriksaan' => json_encode($attribut),
            'tgl_pemeriksaan' => $request->input('tanggal_pemeriksaan'),
            'label' => 'GIZI??',
        ]);
        for ($i = 0; $i < count($attribut); $i++) {
            DetailPemeriksaan::create([
                'pemeriksaan_id' => $pemeriksaan->id,
                'attribut_id' => $attribut[$i]['attribut_id'],
                'nilai' => $attribut[$i]['nilai'],
            ]);
        }

        return redirect()->route('admin.pemeriksaan.index')->with('success', 'data pemeriksaan berhasil ditambahkan!!');
       }catch(\Exception $e){
        return redirect()->route('admin.pemeriksaan.index')->with('error', 'terjadi kesalahan '. $e->getMessage());
       }
    }
    public function storeByBalita(StorePemeriksaanRequest $request)
    {
        $attribut =  Attribut::orderBy('id', 'asc')->get();

        $pemeriksaan = Balita::find($request->pemeriksaan_id);

        $pemeriksaan = Pemeriksaan::create([
            'pemeriksaan_id' => $request->input('pemeriksaan_id'),
            'data_pemeriksaan' => $pemeriksaan,
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
