'use client';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Autocomplete,
    Typography
} from '@mui/material';
import ReactToPdf from 'react-to-pdf';

const MAIN_BLUE = '#1565c0';
const LIGHT_BLUE = '#e3f2fd';

// Yardımcı: Tarih formatla
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

// Yardımcı: Müşteri ve ürün autocomplete için
function extractAutoData(paymentRecords) {
    const customerSet = new Set();
    const productSet = new Set();
    const productPriceMap = {};
    paymentRecords.forEach(rec => {
        if (rec.item?.customerName) customerSet.add(rec.item.customerName);
        if (rec.item?.productName) {
            productSet.add(rec.item.productName);
            if (rec.amount != null) productPriceMap[rec.item.productName] = rec.amount;
        }
    });
    return {
        customerList: Array.from(customerSet),
        productList: Array.from(productSet),
        productPriceMap
    };
}

function InvoicePreviewDialog({
                                  open,
                                  onClose,
                                  paymentRecord,
                                  paymentRecords = []
                              }) {
    // Otomatik doldurma verileri
    const { customerList, productList, productPriceMap } = useMemo(
        () => extractAutoData(paymentRecords),
        [paymentRecords]
    );

    // State'ler
    const [customerName, setCustomerName] = useState(paymentRecord?.item?.customerName || '');
    const [productName, setProductName] = useState(paymentRecord?.item?.productName || '');
    const [amount, setAmount] = useState(paymentRecord?.amount || 0);
    const [invoiceDate, setInvoiceDate] = useState(paymentRecord?.paymentDate || paymentRecord?.dueDate || '');
    const [note, setNote] = useState(paymentRecord?.note || '');
    const [quantity, setQuantity] = useState(1);

    // Ürün adı değişirse otomatik fiyat getir
    useEffect(() => {
        if (productName && productPriceMap[productName] != null) {
            setAmount(productPriceMap[productName]);
        }
        // eslint-disable-next-line
    }, [productName]);

    // PDF alanı için ref
    const pdfRef = useRef();

    // Toplam tutar
    const totalAmount = Number(amount) * Number(quantity);

    // Fatura No ve tarih
    const invoiceNo = paymentRecord?.id ? `INV-${paymentRecord.id}` : '';
    const formattedDate = formatDate(invoiceDate);

    if (!paymentRecord) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ background: MAIN_BLUE, color: '#fff', textAlign: 'center', letterSpacing: 2 }}>
                PROFORMA FATURA
            </DialogTitle>
            <DialogContent sx={{ background: LIGHT_BLUE, py: 3 }}>
                {/* PDF'e çevrilecek alan */}
                <div ref={pdfRef}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 'bold', color: MAIN_BLUE }}>UzAI Teknoloji</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ color: MAIN_BLUE }}>Fatura No: <b>{invoiceNo}</b></Typography>
                            <Typography sx={{ color: MAIN_BLUE }}>Fatura Tarihi: <b>{formattedDate}</b></Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Autocomplete
                            freeSolo
                            options={customerList}
                            value={customerName}
                            onInputChange={(_, newValue) => setCustomerName(newValue)}
                            renderInput={params => (
                                <TextField {...params} label="Müşteri Adı" variant="outlined" size="small" fullWidth />
                            )}
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            label="Fatura Notu"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            multiline
                            minRows={2}
                        />
                    </Box>

                    <TableContainer component={Paper} sx={{ background: '#fff' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ background: MAIN_BLUE }}>
                                    <TableCell sx={{ color: '#fff', width: 60 }}>#</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Hizmet</TableCell>
                                    <TableCell sx={{ color: '#fff', width: 80 }}>Miktar</TableCell>
                                    <TableCell sx={{ color: '#fff', width: 120, textAlign: 'right' }}>Birim Fiyat (TL)</TableCell>
                                    <TableCell sx={{ color: '#fff', textAlign: 'right', width: 120 }}>Toplam (TL)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>
                                        <Autocomplete
                                            freeSolo
                                            options={productList}
                                            value={productName}
                                            onInputChange={(_, newValue) => setProductName(newValue)}
                                            renderInput={params => (
                                                <TextField {...params} label="Hizmet/Ürün" variant="standard" size="small" />
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={quantity}
                                            onChange={e => setQuantity(Number(e.target.value) || 1)}
                                            type="number"
                                            variant="standard"
                                            size="small"
                                            inputProps={{ min: 1 }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <TextField
                                            value={amount}
                                            onChange={e => setAmount(Number(e.target.value) || 0)}
                                            type="number"
                                            variant="standard"
                                            size="small"
                                            inputProps={{ min: 0, step: 0.01 }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        {totalAmount.toFixed(2)} ₺
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Box sx={{
                            minWidth: 220,
                            background: '#f5fafd',
                            border: `1px solid ${MAIN_BLUE}`,
                            borderRadius: 1,
                            p: 1.5,
                            textAlign: 'right'
                        }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Toplam Tutar:</Typography>
                            <Typography sx={{ fontSize: 20, fontWeight: 'bold', color: MAIN_BLUE }}>
                                {totalAmount.toFixed(2)} ₺
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: '#777', fontSize: 13 }}>
                            Lütfen ödemeyi fatura tarihinden itibaren 1 iş günü içinde tamamlayınız.
                            Bu bir proforma faturadır ve ödeme yapılmadan hizmet başlamaz.
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: '#aaa', fontSize: 11, textAlign: 'center' }}>
                            Bu belge dijital olarak oluşturulmuştur ve resmi bir fatura yerine geçmez.
                        </Typography>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions sx={{ background: LIGHT_BLUE, pb: 2 }}>
                <Button onClick={onClose}>Kapat</Button>
                {open && (
                    <ReactToPdf targetRef={pdfRef} filename={`ProformaFatura_${invoiceNo}.pdf`} scale={1}>
                        {({ toPdf }) => (
                            <Button
                                onClick={toPdf}
                                color="primary"
                                variant="contained"
                                sx={{ fontWeight: 'bold' }}
                            >
                                PDF Olarak İndir
                            </Button>
                        )}
                    </ReactToPdf>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default InvoicePreviewDialog;