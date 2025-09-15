import React, { useState, useMemo } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Box } from "@mui/material";
import SalesPaymentTableRow from "./SalesPaymentTableRow.jsx";

const MAX_ROWS = 10;

function SalesPaymentTable({ status, onEdit, onInvoice, paymentRecords }) {
    // Sadece ilgili statüdeki kayıtlar
    const filteredRecords = paymentRecords
        ? paymentRecords.filter(r => r.paymentStatus === status)
        : [];

    // Tarihe göre sıralama (en yakın tarihli ilk)
    const sortedRecords = useMemo(() =>
        [...filteredRecords].sort((a, b) =>
            new Date(a.dueDate || a.paymentDate) - new Date(b.dueDate || b.paymentDate)
        ), [filteredRecords]
    );

    // Sayfalama
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(sortedRecords.length / MAX_ROWS);

    const paginatedRecords = sortedRecords.slice(page * MAX_ROWS, (page + 1) * MAX_ROWS);

    // Boş satırları ekle
    const emptyRows = Array.from({ length: MAX_ROWS - paginatedRecords.length }, (_, idx) => ({
        id: `empty-${idx}`,
        item: {},
        amount: "",
        paymentStatus: "",
        paymentDate: "",
        dueDate: "",
        invoiced: false,
        isEmpty: true
    }));

    const rowsToRender = [...paginatedRecords, ...emptyRows];

    const handlePrev = () => setPage(prev => Math.max(prev - 1, 0));
    const handleNext = () => setPage(prev => Math.min(prev + 1, totalPages - 1));

    return (
        <Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Ürün/Hizmet</TableCell>
                        <TableCell>Müşteri</TableCell>
                        <TableCell>Vade Tarihi</TableCell>
                        <TableCell>Tutar (₺)</TableCell>
                        <TableCell>Durum</TableCell>
                        <TableCell>Ödeme Tarihi</TableCell>
                        <TableCell>İşlemler</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsToRender.map((record, idx) => (
                        <SalesPaymentTableRow
                            key={record.id}
                            record={record}
                            onEdit={record.isEmpty ? undefined : onEdit}
                            onInvoice={record.isEmpty ? undefined : onInvoice}
                            index={page * MAX_ROWS + idx + 1}
                            isEmpty={record.isEmpty}
                        />
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handlePrev}
                    disabled={page === 0}
                    sx={{ mr: 1 }}
                >
                    Önceki
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleNext}
                    disabled={page >= totalPages - 1}
                >
                    Sonraki
                </Button>
            </Box>
        </Box>
    );
}

export default SalesPaymentTable;