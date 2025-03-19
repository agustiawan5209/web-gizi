<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dataset extends Model
{
    /** @use HasFactory<\Database\Factories\DatasetFactory> */
    use HasFactory;

    protected $fillable = [
        'tgl',
        'label',
    ];

    public function fiturdataset()
    {
        return $this->hasMany(Dataset::class, 'dataset_id', 'id');
    }

    /**
     * Scope a query to search for Attributs by their tanggal.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $tgl
     * @return void
     */

    public function scopeSearchByTgl($query, $tgl): void
    {
        $query->when($tgl ?? null, function ($query, $tgl) {
            $query->whereDate('tgl', $tgl);
        });
    }

    /**
     * Scope a query to search for Attributs by their label.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string|null $Label
     * @return void
     */

    public function scopeSearchByLabel($query, $label): void
    {
        $query->when($label ?? null, function ($query, $label) {
            $query->where('label', 'like', '%' . $label . '%');
        });
    }
}
