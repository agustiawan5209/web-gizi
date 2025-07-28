<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClassifierController extends Controller
{

    public function index(){

        $naiveBayes = new NaiveBayesController(null, []);
        return response()->json($naiveBayes->setNaiveBayesData());
    }
}
