import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';
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
        e.preventDefault();
        destroy(`${url}`, {
            onError: (err) => {
                console.log(err);
            },
        });
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="submit" variant={'destructive'} size={'xs'} className="w-8 bg-red-400 hover:bg-red-500 md:w-16" tabIndex={4}>
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Apakah Anda Yakin Menghapus Data ini?</DialogTitle>
                <DialogDescription>Peringatan! Jika Anda menghapus data ini, maka data tersebut akan dihapus secara permanen.</DialogDescription>
                <DialogFooter>
                    <Button type="button" variant="destructive" size="sm" className="flex-1" onClick={submit}>
                        Hapus
                    </Button>
                </DialogFooter>
                <DialogClose />
            </DialogContent>
        </Dialog>
    );
}

export default DeleteItem;
