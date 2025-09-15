import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Box
} from "@mui/material";

function InvoicePreviewDialog({ open, onClose, paymentRecord, onDownloadPDF }) {
    if (!paymentRecord) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Fatura Önizleme</DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" align="center" gutterBottom>FATURA</Typography>
                    <Typography><b>Şirket Adı:</b> Şirket Adı</Typography>
                    <Typography><b>Adres:</b> Adres, Şehir, Türkiye</Typography>
                    <Typography><b>Vergi No:</b> 1234567890</Typography>
                    <Box sx={{ my: 2 }}>
                        <Typography><b>Müşteri:</b> {paymentRecord.item?.customerName || ""}</Typography>
                        <Typography><b>Ürün/Hizmet:</b> {paymentRecord.item?.productName || ""}</Typography>
                        <Typography><b>Fatura Tarihi:</b> {paymentRecord.paymentDate || paymentRecord.dueDate || ""}</Typography>
                        <Typography><b>Tutar:</b> {Number(paymentRecord.amount).toFixed(2)} ₺</Typography>
                        <Typography><b>Fatura No:</b> INV-{paymentRecord.id}</Typography>
                    </Box>
                    <Typography variant="caption">Bu fatura dijital olarak oluşturulmuştur.</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Kapat</Button>
                <Button
                    onClick={() => onDownloadPDF(paymentRecord)}
                    color="success"
                    variant="contained"
                >
                    PDF'e Dönüştür
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default InvoicePreviewDialog;