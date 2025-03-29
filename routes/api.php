<?php

use App\Http\Controllers\ChartApiController;
use Illuminate\Support\Facades\Route;


Route::get('/api/chart/balita/{balita}', [ChartApiController::class, 'balitabyid']);
