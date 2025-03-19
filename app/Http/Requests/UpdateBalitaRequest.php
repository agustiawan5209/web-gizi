<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBalitaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "nama"=> "required|string|max:100",
            "tempat_lahir"=> "required|string|max:100",
            "tanggal_lahir"=> "required|date",
            "jenis_kelamin"=> "required|string|in:Laki-laki,Perempuan",
        ];
    }
}
