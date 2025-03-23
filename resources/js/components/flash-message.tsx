import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

function FlashMessage() {
    const page = usePage<SharedData>();
    const { flash = {} } = page.props;

    const [classAlert, setClassAlert] = useState('');
    const [messageAlert, setMessageAlert] = useState('');

    useEffect(() => {
        if (flash.success) {
            setClassAlert('bg-green-400 hover:bg-green-500');
            setMessageAlert(flash.success);
        }
        if (flash.error) {
            setClassAlert('bg-red-400 hover:bg-red-500');
            setMessageAlert(flash.error);
        }
    }, [flash]);

    return (
        messageAlert && (
            <Alert variant="default" className={classAlert}>
                <AlertTitle>Informasi!</AlertTitle>
                <AlertDescription className='text-gray-800'>{messageAlert}.</AlertDescription>
            </Alert>
        )
    );
}

export default FlashMessage;

