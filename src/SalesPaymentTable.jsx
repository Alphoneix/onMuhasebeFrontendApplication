import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { fetchPaymentRecords } from "./ItemService.js";
import SalesPaymentTableRow from "./SalesPaymentTableRow.jsx";

function SalesPaymentTable({ status, onEdit }) {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["paymentRecords", status],
        queryFn: () => fetchPaymentRecords(status),
        initialData: [],
    });

    const sortedData = [...data].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

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
                            <TableCell>ID</TableCell>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Müşteri Adı</TableCell>
                            <TableCell>Ödeme Gereken Tarih</TableCell>
                            <TableCell>Ödeme Miktarı (₺)</TableCell> {/* Yeni sütun */}
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
                        ) : sortedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8}>Henüz kayıt yok.</TableCell>
                            </TableRow>
                        ) : (
                            sortedData.map((record) => (
                                <SalesPaymentTableRow key={record.id} record={record} onEdit={onEdit} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default SalesPaymentTable;