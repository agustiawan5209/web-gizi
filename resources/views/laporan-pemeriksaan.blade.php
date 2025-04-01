<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Laporan Pemeriksaan Balita</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }

        .header h1 {
            color: #3498db;
            margin-bottom: 5px;
        }

        .section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 5px;
        }

        .section-title {
            background-color: #f8f9fa;
            padding: 8px 15px;
            margin: -15px -15px 15px -15px;
            border-bottom: 1px solid #eee;
            font-weight: bold;
            color: #2c3e50;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .data-table th {
            background-color: #3498db;
            color: white;
            text-align: left;
            padding: 8px;
        }

        .data-table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        .data-table tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
            color: #7f8c8d;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>LAPORAN PEMERIKSAAN BALITA</h1>
        <p>Posyandu Sehat Bahagia</p>
    </div>

    <!-- Data Orang Tua -->
    <div class="section">
        <div class="section-title">DATA ORANG TUA</div>
        <table class="data-table">
            <tr>
                <th width="30%">Nama Orang Tua</th>
                <td>{{ $orangTua->name }}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>{{ $orangTua->email }}</td>
            </tr>
        </table>
    </div>

    <!-- Data Balita -->
    <div class="section">
        <div class="section-title">DATA BALITA</div>
        <table class="data-table">
            <tr>
                <th width="30%">Nama Balita</th>
                <td>{{ $balita->nama }}</td>
            </tr>
            <tr>
                <th>Tempat Lahir</th>
                <td>{{ $balita->tempat_lahir }}</td>
            </tr>
            <tr>
                <th>Tanggal Lahir</th>
                <td>{{ \Carbon\Carbon::parse($balita->tanggal_lahir)->format('d F Y') }}</td>
            </tr>
            <tr>
                <th>Usia</th>
                <td>{{ $balita->usia }} bulan</td>
            </tr>
            <tr>
                <th>Jenis Kelamin</th>
                <td>{{ $balita->jenis_kelamin == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
            </tr>
        </table>
    </div>

    <!-- Data Pemeriksaan -->
    <div class="section">
        <div class="section-title">DATA PEMERIKSAAN</div>
        <table class="data-table">
            <thead>
                <tr>
                    @foreach ($attribut as $item)
                        <th style="font-size: 10px;">{{ $item }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @for ($i = 0; $i < count($pemeriksaan); $i++)
                    <tr>
                        @foreach ($attribut as $item)
                            <td style="font-size: 10px;">{{ $pemeriksaan[$i][$item] }}</td>
                        @endforeach
                    </tr>
                @endfor
            </tbody>
        </table>
    </div>

    <div class="footer">
        Laporan ini dicetak pada {{ \Carbon\Carbon::now()->format('d F Y H:i') }}
    </div>
</body>

</html>
