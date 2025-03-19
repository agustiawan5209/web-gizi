<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat permissions
        // user
        Permission::create(['name' => 'add users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        Permission::create(['name' => 'read users']);

        // attribut
        Permission::create(['name' => 'add attribut']);
        Permission::create(['name' => 'edit attribut']);
        Permission::create(['name' => 'delete attribut']);
        Permission::create(['name' => 'read attribut']);
        // balita
        Permission::create(['name' => 'add balita']);
        Permission::create(['name' => 'edit balita']);
        Permission::create(['name' => 'delete balita']);
        Permission::create(['name' => 'read balita']);

        // pemeriksaan
        Permission::create(['name' => 'add pemeriksaan']);
        Permission::create(['name' => 'edit pemeriksaan']);
        Permission::create(['name' => 'delete pemeriksaan']);
        Permission::create(['name' => 'read pemeriksaan']);

        // dataset
        Permission::create(['name' => 'add dataset']);
        Permission::create(['name' => 'edit dataset']);
        Permission::create(['name' => 'delete dataset']);
        Permission::create(['name' => 'read dataset']);

        // Buat roles
        $admin = Role::create(['name' => 'admin']);
        $orangtua = Role::create(['name' => 'orangtua']);

        // Berikan permissions ke roles
        $admin->givePermissionTo([
            'add users',
            'edit users',
            'delete users',
            'read users',
            'add attribut',
            'edit attribut',
            'delete attribut',
            'read attribut',

            'add balita',
            'edit balita',
            'delete balita',
            'read balita',
            'add pemeriksaan',
            'edit pemeriksaan',
            'delete pemeriksaan',
            'read pemeriksaan',
            'add dataset',
            'edit dataset',
            'delete dataset',
            'read dataset',

        ]);
        $orangtua->givePermissionTo([
            'read users',
            'read attribut',
            'edit balita',
            'read balita',
            'read pemeriksaan'
        ]);

        $user = User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password'=> bcrypt('12345678'),
        ]);

        $user->assignRole($admin);
    }
}
