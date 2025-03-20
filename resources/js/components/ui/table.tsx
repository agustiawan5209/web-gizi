import * as React from "react"
import { Button } from '@/components/ui/button';
import { LucideEye, PenBox, Trash2 } from 'lucide-react';

import { cn } from "@/lib/utils"
interface TableActionProps extends React.ComponentProps<"td"> {
    show?: string;
    edit?: string;
    delete?: string;
  }

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table
      data-slot="table"
      className={cn(
        "min-w-full bg-white dark:bg-gray-800",
        className
      )}
      {...props}
    />
  )
}


function TableHead({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-head"
      className={cn(
        "bg-gray-100 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  )
}
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "divide-y divide-gray-200 dark:divide-gray-700",
        className
      )}
      {...props}
    />
  )
}


function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
    return (
      <tr
        data-slot="table-row"
        className={cn(
          "",
          className
        )}
        {...props}
      />
    )
  }

function TableTh({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-row-head"
      className={cn(
        "px-6 py-3 text-left text-xs border-x-2 font-medium text-gray-500 dark:text-white uppercase tracking-wider",
        className
      )}
      {...props}
    />
  )
}

function TableColumn({ className, ...props }: React.ComponentProps<"td">) {
    return (
      <td
        data-slot="table-column"
        className={cn(
          "px-2 py-1 whitespace-nowrap text-xs text-gray-800 dark:text-white border border-gray-300 dark:border-gray-100",
          className
        )}
        {...props}
      />
    )
  }

function TableAction({className, show, edit,delete : destroy, ...props}: TableActionProps){
    return (
        <td
        data-slot="table-column-action"
        className={cn(
          "px-2 py-1 whitespace-nowrap text-xs text-gray-800 dark:text-white border border-gray-300 dark:border-gray-100",
          className
        )}
        {...props}
      >
       <div className="flex gap-1">
      {show &&  <Button type="submit" size={'xs'} className="w-8 md:w-16 bg-blue-400 hover:bg-blue-500" tabIndex={4}>
                       <LucideEye/>
                    </Button>}
      {edit &&  <Button type="submit" variant={"destructive"} size={'xs'} className="w-8 md:w-16 bg-green-400 hover:bg-green-500" tabIndex={4}>
                       <PenBox/>
                    </Button>}
      { destroy &&  <Button type="submit" variant={"destructive"} size={'xs'} className="w-8 md:w-16" tabIndex={4}>
                       <Trash2/>
                    </Button>}
        </div>
      </td>
    )
}
export {Table, TableHead, TableBody, TableRow, TableTh, TableColumn, TableAction}
