<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Balita;
use Illuminate\Http\Request;
use App\Http\Requests\StoreBalitaRequest;
use App\Http\Requests\UpdateBalitaRequest;
use App\Models\Attribut;

class BalitaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Balita::query();

        if ($request->filled('q')) {
            $query->searchByNama($request->input('q', ''));
        }

        if ($request->filled('order_by')) {
            $orderBy = $request->input('order_by');
            if (in_array($orderBy, ['asc', 'desc'])) {
                $query->orderBy('created_at', $orderBy);
            } else if(in_array($orderBy, ['A-Z', 'Z-A'])) {
                if($orderBy == 'A-Z') {
                    $query->orderBy('name', 'asc');
                }else {
                    $query->orderBy('name', 'desc');
                }
            }else if(in_array($orderBy, ['Laki-laki','Perempuan'])){
                $query->searchByJenkel($orderBy);
            }
            else {
                // Handle invalid order_by value
                return redirect()->back()->withErrors(['order_by' => 'Invalid order_by value']);
            }
        }

        try {
            $balita = $query->with(['orangtua'])->paginate($request->input('per_page', 10));
        } catch (\Exception $e) {
            // Handle pagination error
            return redirect()->back()->withErrors(['pagination' => 'Pagination failed: ' . $e->getMessage()]);
        }

        return Inertia::render('admin/balita/index', [
            'balita' => $balita,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data balita',
                    'href' => '/admin/balita/',
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
    return Inertia::render('admin/balita/create', [
        'orangtua' => User::withoutRole('admin')->get(),
        'breadcrumb' => [
            [
                'title' => 'dashboard',
                'href' => '/dashboard',
            ],
            [
                'title' => 'data balita',
                'href' => '/admin/balita/',
            ],
            [
                'title' => 'tambah balita',
                'href' => '/admin/balita/create',
            ],
        ],
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBalitaRequest $request)
    {
        $balita = Balita::create($request->all());
        return redirect()->route('admin.balita.index')->with('success','Balita berhasil ditambahkan!!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Balita $balita)
    {
        $balita->load(['orangtua', 'pemeriksaan', 'pemeriksaan.detailpemeriksaan']);
        return Inertia::render('admin/balita/show', [
            'balita'=> $balita,
            'pemeriksaan'=> $balita->pemeriksaan,
            'orangTua'=> $balita->orangtua,
            'attribut'=> Attribut::orderBy('id', 'asc')->get(),
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data balita',
                    'href' => '/admin/balita/',
                ],
                [
                    'title' => 'detail balita',
                    'href' => '/admin/balita/show',
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Balita $balita)
    {
        $balita->load(['orangtua']);
        return Inertia::render('admin/balita/edit', [
            'balita'=> $balita,
            'orangtua' => User::role('orangtua')->get(),
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data balita',
                    'href' => '/admin/balita/',
                ],
                [
                    'title' => 'edit balita',
                    'href' => '/admin/balita/edit',
                ],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBalitaRequest $request, Balita $balita)
    {
        $balita->update($request->all());
        return redirect()->route('admin.balita.index')->with('success','Balita berhasil diupdate!!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Balita $balita)
    {
        $balita->delete();
        return redirect()->route('admin.balita.index')->with('success','Balita berhasil dihapus!!');
    }
}
