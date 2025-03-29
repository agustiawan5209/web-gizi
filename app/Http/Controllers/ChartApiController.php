<?php

namespace App\Http\Controllers;

use App\Http\Resources\BalitaResource;
use App\Models\Attribut;
use App\Models\Balita;
use Illuminate\Http\Request;

class ChartApiController extends Controller
{

    private $attributes;

    public function __construct()
    {
        $this->attributes = Attribut::all()->toArray();
    }

    public function balitabyid(Balita $balita)
    {
        $balita->load('orangtua', 'pemeriksaan', 'pemeriksaan.detailpemeriksaan', 'pemeriksaan.detailpemeriksaan.attribut');

        $pemeriksaan = $balita->pemeriksaan;
        $label = [];
        $datasets = [];

        foreach ($pemeriksaan as $key => $value) {
            $label[$key] = $value->tgl_pemeriksaan ?? 'Unknown';
        }

        foreach ($this->attributes as $key => $value) {
            $attributes_id = $value['id'] ?? null;
            $attributes_nama = strtolower($value['nama'] ?? '');
            $setData = [];
            if ($attributes_nama !== 'status' && $attributes_nama !== 'jenis kelamin') {
                foreach ($pemeriksaan as $key_dataset => $value_dataset) {
                    $detail = $value_dataset->detailpemeriksaan()->where('attribut_id', $attributes_id)->first();
                    $setData[$key_dataset] = $detail ? intval($detail->nilai) : 0;
                }
                $datasets[$key] =  [
                    'label' => $attributes_nama,
                    'data' => $setData,
                    'borderColor' => $this->getRandomColor(),
                    'fill' => false
                ];
            }
        }

        return response()->json([
            'labels' => $label,
            'datasets' => $datasets,
        ]);
    }

    private function getRandomColor()
    {
        return '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);
    }
}
