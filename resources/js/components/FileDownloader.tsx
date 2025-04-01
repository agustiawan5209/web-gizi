import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { Button } from './ui/button';
interface DownloadPdfProps {
    pdfUrl: string;
    fileName?: string;
    buttonText?: string;
    onDownloadStart?: () => void;
    onDownloadSuccess?: () => void;
    onDownloadError?: (error: string) => void;
}

const DownloadPdf: React.FC<DownloadPdfProps> = ({
    pdfUrl,
    fileName = 'document.pdf',
    buttonText = 'Download PDF',
    onDownloadStart,
    onDownloadSuccess,
    onDownloadError,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const downloadPdf = async () => {
        if (!pdfUrl) {
            const errMsg = 'URL PDF tidak valid';
            setError(errMsg);
            if (onDownloadError) onDownloadError(errMsg);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            if (onDownloadStart) onDownloadStart();

            const response: AxiosResponse<Blob> = await axios.get(pdfUrl, {
                responseType: 'blob',
                headers: {
                    Accept: 'application/pdf',
                },
                validateStatus: (status) => status === 200,
            });

            // Periksa tipe konten
            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.includes('application/pdf')) {
                const errMsg = 'File yang diminta bukan PDF';
                setError(errMsg);
                if (onDownloadError) onDownloadError(errMsg);
                return;
            }

            // Buat URL objek dari blob
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Buat elemen anchor untuk download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Bersihkan
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(url);

            if (onDownloadSuccess) onDownloadSuccess();
        } catch (err) {
            let errorMessage = 'Gagal mengunduh dokumen PDF';

            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;
                if (axiosError.response) {
                    if (axiosError.response.status === 404) {
                        errorMessage = 'File PDF tidak ditemukan (404)';
                    } else if (axiosError.response.status === 403) {
                        errorMessage = 'Akses ditolak (403)';
                    } else {
                        errorMessage = `Error ${axiosError.response.status}: ${axiosError.response.statusText}`;
                    }
                } else if (axiosError.request) {
                    errorMessage = 'Tidak ada respon dari server';
                } else {
                    errorMessage = 'Error dalam konfigurasi request';
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            console.error('Error downloading PDF:', err);
            setError(errorMessage);
            if (onDownloadError) onDownloadError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pdf-download-container">
            <Button
                type="button"
                variant={'default'}
                onClick={downloadPdf}
                disabled={isLoading}
                className={`pdf-download-button ${isLoading ? 'loading' : ''}`}
                aria-label="Download PDF document"
            >
                {isLoading ? (
                    <>
                        <span className="spinner"></span>
                        Downloading...
                    </>
                ) : (
                    buttonText
                )}
            </Button>

            {error && (
                <div className="pdf-download-error">
                    <p>Error: {error}</p>
                    <p>URL: {pdfUrl}</p>
                </div>
            )}
        </div>
    );
};

export default DownloadPdf;
