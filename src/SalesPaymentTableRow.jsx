import React from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function SalesPaymentTableRow({ record, onEdit }) {
    return (
        <TableRow>
            <TableCell>{record.id}</TableCell>
            <TableCell>{record.item?.productName}</TableCell>
            <TableCell>{record.item?.customerName}</TableCell>
            <TableCell>{record.dueDate}</TableCell>
            <TableCell>{record.amount != null ? Number(record.amount).toFixed(2) : "-"}</TableCell> {/* Yeni alan! */}
            <TableCell>{record.paymentStatus}</TableCell>
            <TableCell>{record.paymentDate || "-"}</TableCell>
            <TableCell>
                <IconButton color="primary" onClick={() => onEdit(record)}>
                    <EditIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

export default SalesPaymentTableRow;