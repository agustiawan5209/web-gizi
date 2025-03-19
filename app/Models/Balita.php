<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Balita extends Model
{
    /** @use HasFactory<\Database\Factories\BalitaFactory> */
    use HasFactory;

    protected $fillable = [
        'nama',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
    ];


    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    /**
     * Get the parent (orang tua) associated with the Balita.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public function orang_tua()
    {
        return $this->belongsTo(User::class, 'orang_tua_id');
    }

    /**
     * Scope a query to only include balita with a specific name.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $name
     * @return \Illuminate\Database\Eloquent\Builder
     */

    public function scopeSearchByName($query, $name)
    {
        return $query->when($name, function ($query, $name) {
            return $query->where('nama', 'like', '%' . $name . '%');
        });
    }
    /**
     * Scope a query to only include balita with a specific tempat lahir.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $tempat_lahir
     * @return \Illuminate\Database\Eloquent\Builder
     */

    public function scopeSearchByTempatLahir($query, $tempat_lahir)
    {
        return $query->when($tempat_lahir, function ($query, $tempat_lahir) {
            return $query->where('tempat_lahir', 'like', '%' . $tempat_lahir . '%');
        });
    }
    /**
     * Scope a query to only include balita of given tanggal lahir.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $tgl_lahir
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByTglLahir($query, $tgl_lahir)
    {
        return $query->when($tgl_lahir, function ($query, $tgl_lahir) {
            return $query->whereDate('tgl_lahir', $tgl_lahir);
        });
    }

    /**
     * Scope a query to only include balita of given jenis_kelamin.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $jenis_kelamin
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByJenkel($query, $jenis_kelamin)
    {
        return $query->when($jenis_kelamin, function ($query, $jenis_kelamin) {
            return $query->where('jenis_kelamin', 'like', '%' . $jenis_kelamin . '%');
        });
    }
}
