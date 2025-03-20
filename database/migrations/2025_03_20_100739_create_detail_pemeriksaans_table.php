<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_pemeriksaans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pemeriksaan_id')->constrained('pemeriksaans')->onDelete('cascade');
            $table->foreignId('attribut_id')->constrained('attributs')->onDelete('cascade');
            $table->integer('nilai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_pemeriksaans');
    }
};
