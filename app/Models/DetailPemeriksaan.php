<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPemeriksaan extends Model
{
    protected $table = "detail_pemeriksaans";

    protected $fillable = [
        'balita_id',
        'attribut_id',
        'nilai',
    ];

    public function balita(){
        return $this->hasOne(Balita::class,'id', 'balita_id');
    }
    public function attribut(){
        return $this->hasOne(Attribut::class,'id', 'attribut_id');
    }
}
