import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { fetchPaymentRecords } from "./ItemService.js";
import SalesPaymentTableRow from "./SalesPaymentTableRow.jsx";

const ROWS_PER_PAGE = 10;

function SalesPaymentTable({ status, onEdit }) {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["paymentRecords", status],
        queryFn: () => fetchPaymentRecords(status),
        initialData: [],
    });

    // Tarihe göre sıralı
    const sortedData = [...(data || [])].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Sayfalama işlemleri
    const paginatedData = sortedData.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
    const emptyRows = ROWS_PER_PAGE - paginatedData.length;

    // Sıra numarası hesaplama (tüm tabloya göre, sayfa+satır bazında)
    const getIndex = (rowIdx) => page * ROWS_PER_PAGE + rowIdx + 1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                {status === "YAPILMADI"
                    ? "Yapılmayan Ödeme Kayıtları"
                    : status === "YAPILDI"
                        ? "Yapılan Ödeme Kayıtları"
                        : "Yapılmayacak Ödeme Kayıtları"}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sıra</TableCell>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Müşteri Adı</TableCell>
                            <TableCell>Ödeme Gereken Tarih</TableCell>
                            <TableCell>Ödeme Miktarı (₺)</TableCell>
                            <TableCell>Ödeme Yapıldı mı?</TableCell>
                            <TableCell>Ödeme Yapıldığı Tarih</TableCell>
                            <TableCell>Düzenle</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8}>Yükleniyor...</TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={8} style={{ color: "red" }}>
                                    Veri yüklenirken hata oluştu!
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {paginatedData.map((record, idx) => (
                                    <SalesPaymentTableRow
                                        key={record.id}
                                        record={record}
                                        onEdit={onEdit}
                                        index={getIndex(idx)}
                                    />
                                ))}
                                {/* Boş satırlar */}
                                {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, idx) => (
                                    <TableRow key={`empty-${idx}`}>
                                        <TableCell colSpan={8} style={{ height: 53, background: "#fafafa" }} />
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={sortedData.length}
                    rowsPerPage={ROWS_PER_PAGE}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[ROWS_PER_PAGE]}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
                    labelRowsPerPage="" // gizle
                />
            </TableContainer>
        </>
    );
}

export default SalesPaymentTable;