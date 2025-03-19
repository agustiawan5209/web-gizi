<?php

test('Test Data create balita', function () {

    $user = \App\Models\User::factory()->create();
    $data = [
        'nama'=> 'baliat',
        'tempat_lahir'=> 'bali',
        'tanggal_lahir'=> '2000-01-01',
        'jenis_kelamin'=> 'Laki-laki',
        'orang_tua_id'=> $user->id,
    ];
    $response = $this->post('/admin/balita/store', $data);

    $response->assertStatus(302);
    $this->assertDatabaseHas('balitas', $data);
});
