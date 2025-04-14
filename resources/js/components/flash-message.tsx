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
        }else if (flash.error) {
            setClassAlert('bg-red-400 hover:bg-red-500');
            setMessageAlert(flash.error);
        }
    }, [flash]);

    const clearMessage = () => {
        setClassAlert('');
        setMessageAlert('');
    }
    return (
        messageAlert && (
            <div className="px-4 py-2">
                <Alert variant="default" className={classAlert}>
                    <AlertTitle>Informasi!</AlertTitle>
                    <AlertDescription className="text-gray-800">{messageAlert}.</AlertDescription>

                    <button type='button' onClick={clearMessage} className=' absolute text-xl px-3 cursor-pointer top-0 right-0'>x</button>
                </Alert>
            </div>
        )
    );
}

export default FlashMessage;
