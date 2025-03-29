<?php

namespace App\Http\Controllers;

use App\Models\Dataset;
use App\Models\Attribut;
use App\Models\Pemeriksaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NaiveBayesController extends Controller
{
    private $attributes;
    private $dataset;
    private $datauji;
    private $label = "label";
    private $target;
    private $pemeriksaan_id = 7;

    public function __construct($pemeriksaan_id)
    {
        $this->pemeriksaan_id = $pemeriksaan_id;
        $this->attributes = Attribut::all()->toArray();
        $this->loadDataset();
        $this->setDataUji();
        $this->label = ["gizi buruk", "gizi kurang", "gizi baik", "gizi lebih"];
        $this->target = strtolower(Attribut::where('keterangan', 'like', '%label%')->first()->nama);
    }

    public function generate()
    {
        $attributes = array_filter(array_map('strtolower', array_column($this->attributes, 'nama')), fn($nama) => $nama !== 'status');
        // dd($attributes);
        $url = "https://algoritma-web.citratekno.com/api/classify/";

        $response = Http::post($url, [
            'attributes' => $attributes,
            'dataset' => $this->dataset,
            'datauji' => [$this->datauji],
            'label' => $this->label,
            'target' => $this->target
        ]);


        return $response->successful()
            ? [
                'success' => true,
                'hasil_prediksi' => $response->json('prediction'),
                'akurasi' => $response->json('accuracy')
            ]
            : ['success' => false, 'error' => $response->body(), 'status' => $response->status()];
    }
    public function index()
    {
        $attributes = array_filter(array_map('strtolower', array_column($this->attributes, 'nama')), fn($nama) => $nama !== 'status');

        return  [
            'attributes' => $attributes,
            'dataset' => $this->dataset,
            'datauji' => [$this->datauji],
            'label' => $this->label,
            'target' => $this->target
        ];
    }

    public function loadDataset()
    {
        $dataset = Dataset::with(['fiturdataset'])->get();
        $this->dataset = [];
        foreach ($dataset as $key_dataset => $value_dataset) {
            foreach ($this->attributes as $key => $value) {
                $attributes_id = $value['id'];
                $attributes_nama = strtolower($value['nama']);

                $this->dataset[$key_dataset][$attributes_nama] = $value_dataset->fiturdataset()->where('attribut_id', $attributes_id)->first()->nilai;
            }
        }
    }

    public function setDataUji()
    {
        $pemeriksaan = Pemeriksaan::with(['detailpemeriksaan'])->find($this->pemeriksaan_id);

        foreach ($this->attributes as $key => $value) {
            $attributes_id = $value['id'];
            $attributes_nama = strtolower($value['nama']);

            if ($attributes_nama !== 'status') {
                $this->datauji[$attributes_nama] = $pemeriksaan->detailpemeriksaan()->where('attribut_id', $attributes_id)->first()->nilai;
            }
        }
        // dd($this->datauji);
    }
}
