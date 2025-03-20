<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PolaMakan extends Model
{
    /** @use HasFactory<\Database\Factories\PolaMakanFactory> */
    use HasFactory;

    protected $fillable = [
        "pemeriksaan_id",
        "rekomendasi",
        "jml_kalori",
        'catatan_dokter',
    ];

    /**
     * Get the pemeriksaan that owns the PolaMakan
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function pemeriksaan()
    {
        return $this->belongsTo(Pemeriksaan::class);
    }
}
