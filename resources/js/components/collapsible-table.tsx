// components/CollapsibleRow.tsx
import { ChevronDownIcon } from 'lucide-react';
import React, { useState } from 'react';
import { TableAction, TableColumn, TableRow } from './ui/table';

interface CollapsibleRowProps {
    num: string | number;
    title: string;
    columnData: string[];
    children: React.ReactNode;
    show?: string;
    edit?: string;
    delete?: string;
    id?: string;
    url?: string;
}

const CollapsibleRow: React.FC<CollapsibleRowProps> = ({ num, title, columnData = [], children, show, edit, delete: destroy, id, url }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TableRow className="border-b">
                <TableColumn>{num}</TableColumn>

                <TableColumn className="p-2">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center text-sm text-blue-600 dark:text-white hover:underline">
                        {title}
                        <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </TableColumn>
                {columnData.map((data, index) => (
                    <TableColumn key={index}>{data}</TableColumn>
                ))}
                <TableAction className="w-32" delete="delete" url={url} title={title} id={id} show={show} />
            </TableRow>

           { isOpen && <tr className="bg-gray-100">
                <td colSpan={columnData.length + 3} className="p-4 text-gray-700">
                    <div className={`animate-fade-in overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>{children}</div>
                </td>
            </tr>}
        </>
    );
};

export default CollapsibleRow;
