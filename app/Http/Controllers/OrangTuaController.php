<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class OrangTuaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();
        $query->withoutRole('admin');
        if ($request->filled('q')) {
            $query->filterBySearch($request->input('q', ''));
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
            $users = $query->paginate($request->input('per_page', 10));
        } catch (\Exception $e) {
            // Handle pagination error
            return redirect()->back()->withErrors(['pagination' => 'Pagination failed: ' . $e->getMessage()]);
        }

        return Inertia::render('admin/orangtua/index', [
            'orangtua' => $users,
            'breadcrumb' => [
                [
                    'title' => 'dashboard',
                    'href' => '/dashboard',
                ],
                [
                    'title' => 'dataorangtua',
                    'href' => '/admin/orangtua/',
                ],
            ],
            'filter' => $request->only('q', 'per_page', 'order_by'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/orangtua/create', [
            'breadcrumb'=> [
                [
                    'title'=> 'dashboard',
                    'href'=> '/dashboard',
                ],
                [
                    'title'=> 'dataorangtua',
                    'href'=> '/admin/orangtua/',
                ],
                [
                    'title'=> 'tambah data',
                    'href'=> '/admin/orangtua/create',
                ],
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('orangtua');

        return to_route('admin.orangtua.index')->with('success', 'Data orang tua berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('admin/orangtua/show', [
            'orangtua'=> $user,
            'breadcrumb'=> [
                [
                    'title'=> 'dashboard',
                    'href'=> '/dashboard',
                ],
                [
                    'title'=> 'dataorangtua',
                    'href'=> '/admin/orangtua/',
                ],
                [
                    'title'=> 'Detail data',
                    'href'=> '/admin/orangtua/show',
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/orangtua/edit', [
            'orangtua'=> $user,
            'breadcrumb'=> [
                [
                    'title'=> 'dashboard',
                    'href'=> '/dashboard',
                ],
                [
                    'title'=> 'dataorangtua',
                    'href'=> '/admin/orangtua/',
                ],
                [
                    'title'=> 'Edit data',
                    'href'=> '/admin/orangtua/edit',
                ],
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email,'.$user->id,
            'password' => ['nullable'],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        return to_route('admin.orangtua.index')->with('success', 'Data orang tua berhasil diupdate!!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return to_route('admin.orangtua.index')->with('success', 'Data orang tua berhasil dihapus!!');
    }
}
