<?php

use App\Http\Controllers\BalitaController;
use App\Http\Controllers\DatasetController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';


Route::prefix('admin')->as('admin.')->group(function () {
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
});
