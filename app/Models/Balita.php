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
        'alamat',
        'orang_tua_id',
    ];


    protected $casts = [
        // 'tanggal_lahir' => 'date',
    ];

    /**
     * Get the parent (orang tua) associated with the Balita.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public function orangtua()
    {
        return $this->belongsTo(User::class, 'orang_tua_id');
    }
    public function pemeriksaan()
    {
        return $this->hasMany(Pemeriksaan::class, 'balita_id', 'id');
    }


    /**
     * Scope a query to search by name.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $name
     * @return void
     */
    public function scopeSearchByNama($query, $name): void
    {
        $query->when($name, function ($query, $name) {
            $query->where('nama', 'like', '%' . $name . '%');
        });
    }


    /**
     * Scope a query to search by place of birth.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $tempat_lahir
     * @return void
     */

    public function scopeSearchByTempatLahir($query, $tempat_lahir): void
    {
        $query->when($tempat_lahir, function ($query, $tempat_lahir) {
            $query->where('tempat_lahir', 'like', '%' . $tempat_lahir . '%');
        });
    }

    /**
     * Scope a query to search by date of birth.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $tgl_lahir
     * @return void
     */
    public function scopeSearchByTglLahir($query, $tgl_lahir): void
    {
        $query->when($tgl_lahir, function ($query, $tgl_lahir) {
            $query->whereDate('tgl_lahir', $tgl_lahir);
        });
    }


    /**
     * Scope a query to search by gender.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $jenis_kelamin
     * @return void
     */
    public function scopeSearchByJenkel($query, $jenis_kelamin): void
    {
        $query->when($jenis_kelamin, function ($query, $jenis_kelamin) {
            $query->where('jenis_kelamin', 'like', '%' . $jenis_kelamin . '%');
        });
    }
}
