import React from "react";
import { Link } from "@inertiajs/react";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  data: any;
}

const PaginationTable: React.FC<PaginationProps> = ({ links,data }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.url ?? ""}
          data={data}
          dangerouslySetInnerHTML={{ __html: link.label }}
          className={`px-3 py-1 border rounded text-sm ${
            link.active
              ? "bg-primary text-white"
              : link.url
              ? "hover:bg-gray-200 text-gray-700"
              : "text-gray-200 cursor-not-allowed"
          }`}
        />
      ))}
    </div>
  );
};

export default PaginationTable;
