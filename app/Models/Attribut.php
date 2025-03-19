<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribut extends Model
{
    /** @use HasFactory<\Database\Factories\AttributFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'keterangan',
    ];

    /**
     * Scope a query to search for Attributs by their name.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $Nama
     * @return void
     */

    public function scopeSearchByNama($query, $Nama) : void
    {
        $query->when($Nama ?? null, function ($query, $Nama) {
            $query->where('nama', 'like', '%' . $Nama . '%');
        });
    }
}
