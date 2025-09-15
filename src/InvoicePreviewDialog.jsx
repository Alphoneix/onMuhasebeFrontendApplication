import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

// Mavi tonları için tema rengi
const MAIN_BLUE = "#1565c0";
const LIGHT_BLUE = "#e3f2fd";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    // GG.AA.YYYY
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

function InvoicePreviewDialog({ open, onClose, paymentRecord, onDownloadPDF }) {
    if (!paymentRecord) return null;

    // Fatura tarihi ve vade tarihi aynı
    const date = paymentRecord.paymentDate || paymentRecord.dueDate || "";
    const formattedDate = formatDate(date);

    // Fatura No
    const invoiceNo = paymentRecord.id ? `INV-${paymentRecord.id}` : "";

    // Hizmet ve toplam
    const hizmet = paymentRecord.item?.productName || "";
    const musteri = paymentRecord.item?.customerName || "";

    const tutar = paymentRecord.amount != null ? Number(paymentRecord.amount).toFixed(2) : "0.00";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ background: MAIN_BLUE, color: "#fff", textAlign: "center", letterSpacing: 2 }}>
                PROFORMA FATURA
            </DialogTitle>
            <DialogContent sx={{ background: LIGHT_BLUE, py: 3 }}>
                <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                        <Typography sx={{ fontWeight: "bold", color: MAIN_BLUE }}>UzAI Teknoloji</Typography>
                        {/* Şirket adresi veya diğer bilgiler eklenebilir */}
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ color: MAIN_BLUE }}>Fatura No: <b>{invoiceNo}</b></Typography>
                        <Typography sx={{ color: MAIN_BLUE }}>Fatura Tarihi: <b>{formattedDate}</b></Typography>
                        <Typography sx={{ color: MAIN_BLUE }}>Vade Tarihi: <b>{formattedDate}</b></Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography sx={{ color: MAIN_BLUE, fontWeight: "bold", mb: 0.5 }}>Bill To:</Typography>
                    <Typography>{musteri}</Typography>
                </Box>

                <TableContainer component={Paper} sx={{ background: "#fff" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ background: MAIN_BLUE }}>
                                <TableCell sx={{ color: "#fff", width: 60 }}>#</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Hizmet</TableCell>
                                <TableCell sx={{ color: "#fff", textAlign: "right", width: 120 }}>Tutar (TL)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>{hizmet}</TableCell>
                                <TableCell sx={{ textAlign: "right" }}>{tutar} ₺</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Box sx={{
                        minWidth: 220,
                        background: "#f5fafd",
                        border: `1px solid ${MAIN_BLUE}`,
                        borderRadius: 1,
                        p: 1.5,
                        textAlign: "right"
                    }}>
                        <Typography sx={{ fontWeight: "bold" }}>Toplam Tutar:</Typography>
                        <Typography sx={{ fontSize: 20, fontWeight: "bold", color: MAIN_BLUE }}>
                            {tutar} ₺
                        </Typography>
                        <Typography sx={{ mt: 1, color: "#666", fontSize: 14 }}>Balance Due: {tutar} ₺</Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Typography sx={{ color: "#777", fontSize: 13 }}>
                        Lütfen ödemeyi fatura tarihinden itibaren 1 iş günü içinde tamamlayınız.
                        Bu bir proforma faturadır ve ödeme yapılmadan hizmet başlamaz.
                    </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Typography sx={{ color: "#aaa", fontSize: 11, textAlign: "center" }}>
                        Bu belge dijital olarak oluşturulmuştur ve resmi bir fatura yerine geçmez.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ background: LIGHT_BLUE, pb: 2 }}>
                <Button onClick={onClose}>Kapat</Button>
                <Button
                    onClick={() => {
                        console.log("PDF Olarak İndir tıklandı", paymentRecord);
                        onDownloadPDF(paymentRecord);
                    }}
                    color="primary"
                    variant="contained"
                    sx={{ fontWeight: "bold" }}
                >
                    PDF Olarak İndir
                </Button>

            </DialogActions>
        </Dialog>
    );
}

export default InvoicePreviewDialog;