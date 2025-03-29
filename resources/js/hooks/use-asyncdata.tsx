import { useState, useEffect } from "react";
import axios from "axios";
type ApiResponse<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
};


function useAsyncData<T>(url: string) : ApiResponse<T>{
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await axios.get<T>(url);
            setData(response.data);
            setError(null);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, [url]);

      return { data, loading, error };
}

export default useAsyncData;
