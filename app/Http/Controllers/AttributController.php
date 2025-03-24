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
        $query = Attribut::query();

        if ($request->filled('q')) {
            $query->filterByNama($request->input('q', ''));
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
            }else {
                // Handle invalid order_by value
                return redirect()->back()->withErrors(['order_by' => 'Invalid order_by value']);
            }
        }

        try {
            $attribut = $query->paginate($request->input('per_page', 10));
        } catch (\Exception $e) {
            // Handle pagination error
            return redirect()->back()->withErrors(['pagination' => 'Pagination failed: ' . $e->getMessage()]);
        }

        return Inertia::render('admin/attribut/index', [
            'attribut' => $attribut,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data attribut',
                    'href' => '/admin/attribut/',
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
        return Inertia::render('admin/attribut/create',[
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data attribut',
                    'href' => '/admin/attribut/',
                ],
                [
                    'title' => 'tambah attribut',
                    'href' => '/admin/attribut/create',
                ],
            ],
        ]);
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
            'attribut'=> $attribut,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data attribut',
                    'href' => '/admin/attribut/',
                ],
                [
                    'title' => 'show attribut',
                    'href' => '/admin/attribut/show',
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attribut $attribut)
    {
        return Inertia::render('admin/attribut/edit', [
            'attribut'=> $attribut,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'data attribut',
                    'href' => '/admin/attribut/',
                ],
                [
                    'title' => 'edit attribut',
                    'href' => '/admin/attribut/edit',
                ],
            ],
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
