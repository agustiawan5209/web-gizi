import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
export interface DeleteProps {
    id: string;
    title?: string;
    url: string;
}
type DeleteForm = {
    id: string;
    title?: string;
};
function DeleteItem({ id, title, url }: DeleteProps) {
    const [open, setOpen] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm<Required<DeleteForm>>({
        id: id,
        title: title!!,
    });

    const submit: FormEventHandler = (e) => {
        wait().then(() => setOpen(false));
        e.preventDefault();
        if (!url) {
            console.error("URL is not defined");
            return;
        }
        try {
            destroy(url, {
                onError: (err) => {
                    console.error("Error occurred during deletion:", err);
                },
                onFinish: () => {
                    reset();
                },
            });
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="submit" variant={'destructive'} size={'xs'} className="w-8 bg-red-400 hover:bg-red-500 md:w-16" tabIndex={4}>
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Apakah Anda Yakin Menghapus Data ini?</DialogTitle>
                <DialogDescription>Peringatan! Jika Anda menghapus data ini, maka data tersebut akan dihapus secara permanen.</DialogDescription>
                <DialogFooter>
                    <Button type="button" variant="destructive" size="sm" className="flex-1" disabled={processing} onClick={submit}>
                        Hapus
                    </Button>
                </DialogFooter>
                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}

export default DeleteItem;
