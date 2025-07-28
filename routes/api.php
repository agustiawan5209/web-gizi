<?php

use App\Http\Controllers\ChartApiController;
use App\Http\Controllers\ClassifierController;
use Illuminate\Support\Facades\Route;


Route::get('/api/chart/balita/{balita}', [ChartApiController::class, 'balitabyid']);


Route::get('/api/classify/data', [ClassifierController::class,'index'])->name('api.classify.data');
