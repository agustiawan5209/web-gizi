<?php

use App\Http\Controllers\AttributController;
use App\Http\Controllers\BalitaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DatasetController;
use App\Http\Controllers\OrangTuaController;
use App\Http\Controllers\PemeriksaanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


Route::prefix('admin')->as('admin.')->middleware(['auth', 'verified'])->group(function () {

     // Routes for managing orangtuas
     Route::prefix('orangtua')->as('orangtua.')->group(function () {
        // Dataset controller
        Route::controller(OrangTuaController::class)->group(function () {
            // Show all orangtuas
            Route::get('/', 'index')->name('index');
            // Create a orangtua
            Route::get('/create', 'create')->name('create');
            // Edit a orangtua
            Route::get('/edit/{user}', 'edit')->name('edit');
            // Show a orangtua
            Route::get('/show/{user}', 'show')->name('show');

            // Store a orangtua
            Route::post('/store', 'store')->name('store');
            // Update a orangtua
            Route::put('/update/{user}', 'update')->name('update');
            // Delete a orangtua
            Route::delete('/destroy/{user}', 'destroy')->name('destroy');
        });
    });


    Route::prefix('balita')->as('balita.')->group(function () {
        Route::controller(BalitaController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::get('/edit/{balita}', 'edit')->name('edit');
            Route::get('/show/{balita}', 'show')->name('show');

            Route::post('/store', 'store')->name('store');
            Route::put('/update/{balita}', 'update')->name('update');
            Route::delete('/destroy/{balita}', 'destroy')->name('destroy');
        });
    });


    // Routes for managing attributs
    Route::prefix('attribut')->as('attribut.')->group(function () {
        // Dataset controller
        Route::controller(AttributController::class)->group(function () {
            // Show all attributs
            Route::get('/', 'index')->name('index');
            // Create a attribut
            Route::get('/create', 'create')->name('create');
            // Edit a attribut
            Route::get('/edit/{attribut}', 'edit')->name('edit');
            // Show a attribut
            Route::get('/show/{attribut}', 'show')->name('show');

            // Store a attribut
            Route::post('/store', 'store')->name('store');
            // Update a attribut
            Route::put('/update/{attribut}', 'update')->name('update');
            // Delete a attribut
            Route::delete('/destroy/{attribut}', 'destroy')->name('destroy');
        });
    });


    // Routes for managing datasets
    Route::prefix('dataset')->as('dataset.')->group(function () {
        // Dataset controller
        Route::controller(DatasetController::class)->group(function () {
            // Show all datasets
            Route::get('/', 'index')->name('index');
            // Create a dataset
            Route::get('/create', 'create')->name('create');
            // Edit a dataset
            Route::get('/edit/{dataset}', 'edit')->name('edit');
            // Show a dataset
            Route::get('/show/{dataset}', 'show')->name('show');

            // Store a dataset
            Route::post('/store', 'store')->name('store');
            // Update a dataset
            Route::put('/update/{dataset}', 'update')->name('update');
            // Delete a dataset
            Route::delete('/destroy/{dataset}', 'destroy')->name('destroy');
        });
    });


    // Routes for managing pemeriksaans
    Route::prefix('pemeriksaan')->as('pemeriksaan.')->group(function () {
        // Dataset controller
        Route::controller(PemeriksaanController::class)->group(function () {
            // Show all pemeriksaans
            Route::get('/', 'index')->name('index');
            // Create a pemeriksaan
            Route::get('/create', 'create')->name('create');
            Route::get('/create-id', 'createById')->name('create-id');

            // Edit a pemeriksaan
            Route::get('/edit/{pemeriksaan}', 'edit')->name('edit');
            // Show a pemeriksaan
            Route::get('/show/{pemeriksaan}', 'show')->name('show');

            // Store a pemeriksaan
            Route::post('/store', 'store')->name('store');
            Route::post('/store-id', 'storeByBalita')->name('store-id');
            // Update a pemeriksaan
            Route::put('/update/{pemeriksaan}', 'update')->name('update');
            // Delete a pemeriksaan
            Route::delete('/destroy/{pemeriksaan}', 'destroy')->name('destroy');
        });
    });


});
