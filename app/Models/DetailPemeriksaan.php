<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPemeriksaan extends Model
{
    protected $table = "detail_pemeriksaans";

    protected $fillable = [
        'id_pemeriksaan',
        'attribut_id',
        'nilai',
    ];

    public function pemeriksaan(){
        return $this->hasOne(Pemeriksaan::class,'id', 'pemeriksaan_id');
    }
    public function attribut(){
        return $this->hasOne(Attribut::class,'id', 'attribut_id');
    }
}
