import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Typography
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";

function InvoiceListDialog({ open, onClose, invoices, onInvoiceDownload }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Oluşturulan Faturalar</DialogTitle>
            <DialogContent>
                {invoices.length === 0 ? (
                    <Typography>Henüz hiç fatura oluşturulmadı.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sıra</TableCell>
                                <TableCell>Fatura No</TableCell>
                                <TableCell>Müşteri</TableCell>
                                <TableCell>Ürün/Hizmet</TableCell>
                                <TableCell>Tutar (₺)</TableCell>
                                <TableCell>Fatura Tarihi</TableCell>
                                <TableCell>İndir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.map((inv, idx) => (
                                <TableRow key={inv.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{`INV-${inv.id}`}</TableCell>
                                    <TableCell>{inv.item?.customerName}</TableCell>
                                    <TableCell>{inv.item?.productName}</TableCell>
                                    <TableCell>{Number(inv.amount).toFixed(2)}</TableCell>
                                    <TableCell>{inv.paymentDate || inv.dueDate || "-"}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => onInvoiceDownload(inv)}>
                                            <ReceiptIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Kapat</Button>
            </DialogActions>
        </Dialog>
    );
}

export default InvoiceListDialog;