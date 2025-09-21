<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDatasetRequest extends FormRequest
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
            "jenis_kelamin" => "required|string|in:Laki-laki,Perempuan",
            'attribut' => 'required|array',
            'attribut.*.attribut_id' => 'required|integer',
            'label' => 'required|string|max:50|in:gizi buruk,gizi kurang,gizi baik,gizi lebih,gizi normal',
            'tgl' => 'required|date'
        ];
    }
}
