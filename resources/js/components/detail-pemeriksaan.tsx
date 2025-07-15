import { Table, TableBody, TableColumn, TableContainer, TableRow } from '@/components/ui/table';

interface DetailPemeriksaanProps {
    detail: {
        attribut: {
            nama: string;
        };
        nilai: number | string;
    }[];
    pemeriksaan: {
        id: string;
        tgl_pemeriksaan: string;
        label: string;
        detailpemeriksaan: any;
        alasan: string;
    };
}

function DetailPemeriksaan({ detail, pemeriksaan }: DetailPemeriksaanProps) {
    return (
        <section className="border-x">
            <h3 className="text-foreground bg-blue-100 p-4 text-left text-lg font-semibold md:text-xl dark:bg-gray-800">Data Pemeriksaan</h3>
            <TableContainer className="relative">
                <Table className="w-full">
                    <TableBody>
                        {detail
                            .filter((attr) => !['jenis kelamin'].includes(attr.attribut.nama.toLowerCase()))
                            .map((item, index) => (
                                <TableRow key={index} className="border-b py-1">
                                    <TableColumn className="w-1/3 font-normal text-gray-600 dark:text-gray-100">{item.attribut.nama}:</TableColumn>
                                    <TableColumn>{item.nilai}</TableColumn>
                                </TableRow>
                            ))}
                        <TableRow  className="border-b py-1">
                            <TableColumn className="w-1/3 font-normal text-gray-600 dark:text-gray-100">Alasan:</TableColumn>
                            <TableColumn>
                                <p dangerouslySetInnerHTML={{ __html: pemeriksaan.alasan }} className="whitespace-normal max-w-max" />
                            </TableColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    );
}

export default DetailPemeriksaan;
