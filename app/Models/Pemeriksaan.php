<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemeriksaan extends Model
{
    /** @use HasFactory<\Database\Factories\PemeriksaanFactory> */
    use HasFactory;

    protected $fillable = [
        "balita_id",
        "data_balita",
        "tgl_pemeriksaan",
        "data_pemeriksaan",
        "label",
    ];

    public function balita()
    {
        return $this->belongsTo(Balita::class);
    }

    public function detailpemeriksaan(){
        return $this->hasMany(DetailPemeriksaan::class, 'balita_id', 'id');

    }

    /**
     * Scope a query to search by balita.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $balita
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByBalita($query, $balita)
    {
        $query->when($balita ?? null, function ($query, $balita) {
            $query->whereHas('balita', function ($query) use ($balita) {
                $query->where('nama', 'LIKE', '%' . $balita . '%');
            });
        });
    }


/**
 * Scope a query to search by examination date.
 *
 * @param  \Illuminate\Database\Eloquent\Builder  $query
 * @param  string|null  $tanggal
 * @return void
 */

    public function scopeSearchByTanggal($query, $tanggal)
    {
        $query->when($tanggal, function ($query, $tanggal) {
            $query->whereDate('tgl_pemeriksaan', $tanggal);
        });
    }
    /**
     * Scope a query to search by label.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $label
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByLabel($query, $label)
    {
        $query->when($label, function ($query, $label) {
            $query->where('label', 'LIKE', '%' . $label . '%');
        });
    }


    /**
     * Scope a query to search by name and gender.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $nama
     * @param  string|null  $jenkel
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearchByNamaJenkel($query, $nama, $jenkel)
    {
        $query->when($nama ?? null, function ($query, $nama) {
            $query->whereJsonContains('data_balita->nama', $nama);
        });
        $query->when($jenkel ?? null, function ($query, $jenkel) {
            $query->whereJsonContains('data_balita->jenis_kelamin', $jenkel);
        });
    }
}
