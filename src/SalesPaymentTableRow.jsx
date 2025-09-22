import React from "react";
import { TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptIcon from "@mui/icons-material/Receipt";

function SalesPaymentTableRow({ record, onEdit, onInvoice, index, isEmpty }) {
    if (isEmpty) {
        return (
            <TableRow>
                <TableCell>{index}</TableCell>
                <TableCell colSpan={6} />
                <TableCell />
            </TableRow>
        );
    }

    return (
        <TableRow>
            <TableCell>{index}</TableCell>
            <TableCell>{record.item?.productName}</TableCell>
            <TableCell>{record.item?.customerName}</TableCell>
            <TableCell>{record.dueDate}</TableCell>
            <TableCell>{record.amount != null ? Number(record.amount).toFixed(2) : "-"}</TableCell>
            <TableCell>{record.paymentStatus}</TableCell>
            <TableCell>{record.paymentDate || "-"}</TableCell>
            <TableCell>
                <IconButton color="primary" onClick={() => onEdit(record)}>
                    <EditIcon />
                </IconButton>
                <Tooltip title="Proforma Fatura Oluştur">
                    <IconButton
                        color="success"
                        onClick={() => onInvoice(record)}
                        sx={{ ml: 1 }}
                    >
                        <ReceiptIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}

export default SalesPaymentTableRow;