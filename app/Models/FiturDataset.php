<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FiturDataset extends Model
{
    //

    protected $table = "fitur_datasets";
    protected $fillable = [
        'attribut_id',
        'dataset_id',
        'nilai',
    ];

    public function dataset()
    {
        return $this->hasOne(FiturDataset::class,'id', 'dataset_id');
    }

}
