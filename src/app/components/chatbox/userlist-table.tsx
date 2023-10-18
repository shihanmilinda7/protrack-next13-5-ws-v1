"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

export const UserListTable = ({ userListIn }: { userListIn: any[] }) => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const q = [...userListIn];
    setUserList(q);
  }, [userListIn]);
  return (
    <div className="py-2 sm:w-5/5 w-full">
      <div className="w-full">
        <Table isStriped aria-label="Example static collection table">
          <TableHeader>
            <TableColumn className="w-10 border border-blue-500">#</TableColumn>
            <TableColumn className="w-20 border border-blue-500">
              User
            </TableColumn>
            <TableColumn className="w-10 border border-blue-500">
              Hours
            </TableColumn>
            <TableColumn className="w-10 border border-blue-500">
              Status
            </TableColumn>
          </TableHeader>
          <TableBody>
            {userList?.map((tableRow: any, index: number) => (
              <TableRow key={tableRow.staffname} className="">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{tableRow.staffname}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <span
                    className={`inline-block mr-1 last:mr-0 py-1 px-2 rounded-full ${
                      tableRow.status == "Active"
                        ? "bg-green-200 text-green-600"
                        : "bg-red-200 text-red-600"
                    }  text-xs font-semibold uppercase`}
                  >
                    {tableRow.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
