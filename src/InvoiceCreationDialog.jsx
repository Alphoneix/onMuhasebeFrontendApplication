import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
    GetApp as DownloadIcon
} from '@mui/icons-material';
import generatePDF, {usePDF} from "react-to-pdf";

const MAIN_BLUE = '#1565c0';
const LIGHT_BLUE = '#e3f2fd';

const TestComponent = ({companyName, invoiceNo, invoiceDate, customerName, invoiceNote, services, grandTotal, isPreview = false}) => {
    const { targetRef } = usePDF({
        filename: "fatura.pdf",
        method: "save"
    });

    // PDF indirme fonksiyonunu dışarı açıyoruz
    const handleDownloadPDF = () => {
        generatePDF(targetRef, {filename: 'proforma-fatura.pdf'});
    };

    // Eğer önizleme modundaysak, PDF indir fonksiyonunu parent'a gönder
    React.useImperativeHandle(isPreview ? React.createRef() : null, () => ({
        downloadPDF: handleDownloadPDF
    }), []);

    return (
        <Box sx={{
            border: `2px solid ${MAIN_BLUE}`,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 3,
            maxHeight: '500px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
                background: MAIN_BLUE,
                borderRadius: '4px',
                '&:hover': {
                    background: '#0d47a1',
                },
            },
        }}>
            <div ref={targetRef}>
                <Box sx={{
                    background: '#fff',
                    p: 3,
                    minHeight: '600px',
                    fontSize: '0.875rem'
                }}>
                    {/* Fatura Başlığı */}
                    <Box sx={{
                        textAlign: 'center',
                        mb: 3,
                        borderBottom: `3px solid ${MAIN_BLUE}`,
                        pb: 2,
                        background: `linear-gradient(135deg, ${LIGHT_BLUE} 0%, #ffffff 100%)`,
                        mx: -3,
                        mt: -3,
                        pt: 3,
                        px: 3,
                        borderRadius: '8px 8px 0 0'
                    }}>
                        <Typography variant="h4" sx={{
                            color: MAIN_BLUE,
                            fontWeight: 'bold',
                            letterSpacing: 2,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            PROFORMA FATURA
                        </Typography>
                    </Box>

                    {/* Şirket ve Fatura Bilgileri */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2
                    }}>
                        <Box sx={{
                            background: `linear-gradient(135deg, ${LIGHT_BLUE} 0%, #f5f5f5 100%)`,
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${MAIN_BLUE}20`,
                            minWidth: 200
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                color: MAIN_BLUE,
                                mb: 1
                            }}>
                                {companyName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                www.uzai.com.tr
                            </Typography>
                        </Box>
                        <Box sx={{
                            textAlign: 'right',
                            background: '#f9f9f9',
                            p: 2,
                            borderRadius: 2,
                            border: `1px solid ${MAIN_BLUE}20`,
                            minWidth: 200
                        }}>
                            <Typography variant="subtitle1" sx={{ color: MAIN_BLUE, mb: 1 }}>
                                Fatura No: <strong>{invoiceNo}</strong>
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: MAIN_BLUE }}>
                                Tarih: <strong>{formatDisplayDate(invoiceDate)}</strong>
                            </Typography>
                        </Box>
                    </Box>

                    {/* Müşteri Bilgileri */}
                    <Box sx={{
                        mb: 3,
                        p: 2,
                        background: `linear-gradient(135deg, ${LIGHT_BLUE} 0%, #ffffff 100%)`,
                        borderRadius: 2,
                        border: `1px solid ${MAIN_BLUE}30`,
                        boxShadow: 1
                    }}>
                        <Typography variant="subtitle1" sx={{
                            color: MAIN_BLUE,
                            mb: 1,
                            fontWeight: 'bold'
                        }}>
                            Fatura Edilen:
                        </Typography>
                        <Typography variant="h6" sx={{
                            fontWeight: 'bold',
                            color: '#333'
                        }}>
                            {customerName}
                        </Typography>
                        {invoiceNote && (
                            <Typography variant="body2" sx={{
                                mt: 1,
                                fontStyle: 'italic',
                                color: '#666',
                                background: '#fff',
                                p: 1,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0'
                            }}>
                                Not: {invoiceNote}
                            </Typography>
                        )}
                    </Box>

                    {/* Hizmetler Tablosu */}
                    <TableContainer component={Paper} sx={{
                        mb: 3,
                        border: `2px solid ${MAIN_BLUE}`,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 2
                    }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{
                                    background: `linear-gradient(135deg, ${MAIN_BLUE} 0%, #0d47a1 100%)`
                                }}>
                                    <TableCell sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 14
                                    }}>
                                        #
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 14
                                    }}>
                                        Hizmet/Ürün
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        textAlign: 'center'
                                    }}>
                                        Miktar
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        textAlign: 'right'
                                    }}>
                                        Birim Fiyat (₺)
                                    </TableCell>
                                    <TableCell sx={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                        textAlign: 'right'
                                    }}>
                                        Toplam (₺)
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services?.map((service, index) => (
                                    <TableRow
                                        key={service.id}
                                        sx={{
                                            '&:nth-of-type(even)': {
                                                background: '#f8f9fa'
                                            },
                                            '&:hover': {
                                                background: LIGHT_BLUE
                                            },
                                            transition: 'background-color 0.2s ease'
                                        }}
                                    >
                                        <TableCell sx={{
                                            fontSize: 13,
                                            fontWeight: 'bold',
                                            color: MAIN_BLUE
                                        }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: 13 }}>
                                            {service.serviceName}
                                        </TableCell>
                                        <TableCell sx={{
                                            fontSize: 13,
                                            textAlign: 'center',
                                            fontWeight: 'medium'
                                        }}>
                                            {service.quantity}
                                        </TableCell>
                                        <TableCell sx={{
                                            fontSize: 13,
                                            textAlign: 'right'
                                        }}>
                                            {service.unitPrice.toFixed(2)}
                                        </TableCell>
                                        <TableCell sx={{
                                            fontSize: 13,
                                            textAlign: 'right',
                                            fontWeight: 'bold',
                                            color: MAIN_BLUE
                                        }}>
                                            {service.total.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Toplam */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                        <Box sx={{
                            minWidth: 250,
                            background: `linear-gradient(135deg, ${LIGHT_BLUE} 0%, #ffffff 100%)`,
                            border: `2px solid ${MAIN_BLUE}`,
                            borderRadius: 3,
                            p: 2.5,
                            textAlign: 'center',
                            boxShadow: 3,
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -2,
                                left: -2,
                                right: -2,
                                bottom: -2,
                                background: `linear-gradient(135deg, ${MAIN_BLUE}, #0d47a1)`,
                                borderRadius: 3,
                                zIndex: -1
                            }
                        }}>
                            <Typography variant="subtitle1" sx={{
                                fontWeight: 'bold',
                                color: MAIN_BLUE,
                                mb: 1
                            }}>
                                TOPLAM TUTAR
                            </Typography>
                            <Typography variant="h5" sx={{
                                fontWeight: 'bold',
                                color: MAIN_BLUE,
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                {grandTotal?.toFixed(2)} ₺
                            </Typography>
                        </Box>
                    </Box>

                    {/* Alt Bilgiler */}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{
                        mt: 2,
                        background: '#fafafa',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid #e0e0e0'
                    }}>
                        <Typography variant="body2" sx={{
                            color: '#555',
                            mb: 1,
                            lineHeight: 1.6
                        }}>
                            <strong>Ödeme Koşulları:</strong> Lütfen ödemeyi fatura tarihinden itibaren 30 gün içinde tamamlayınız.
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: '#555',
                            mb: 2,
                            lineHeight: 1.6
                        }}>
                            <strong>Önemli:</strong> Bu bir proforma faturadır ve yasal fatura yerine geçmez.
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: '#999',
                            textAlign: 'center',
                            display: 'block',
                            fontStyle: 'italic'
                        }}>
                            Bu belge dijital olarak oluşturulmuştur. | {companyName} - Profesyonel Hizmetler
                        </Typography>
                    </Box>
                </Box>
            </div>
        </Box>
    );
};

// Diğer fonksiyonlar aynı kalacak
function formatDate(dateStr) {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);
    if (isNaN(date)) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

function extractAutoData(paymentRecords) {
    const customerSet = new Set();
    const serviceSet = new Set();
    const servicePriceMap = {};

    paymentRecords.forEach(rec => {
        if (rec.item?.customerName) customerSet.add(rec.item.customerName);
        if (rec.item?.productName) {
            serviceSet.add(rec.item.productName);
            if (rec.amount != null) servicePriceMap[rec.item.productName] = rec.amount;
        }
    });

    return {
        customerList: Array.from(customerSet),
        serviceList: Array.from(serviceSet),
        servicePriceMap
    };
}

function InvoiceCreationDialog({ open, onClose, paymentRecord, paymentRecords = [] }) {
    const { customerList, serviceList, servicePriceMap } = useMemo(
        () => extractAutoData(paymentRecords),
        [paymentRecords]
    );

    // Ana form verileri
    const [customerName, setCustomerName] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(formatDate(new Date()));
    const [invoiceNote, setInvoiceNote] = useState('');
    const [companyName, setCompanyName] = useState('UzAI Teknoloji');

    // Hizmetler listesi
    const [services, setServices] = useState([
        { id: 1, serviceName: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);

    // Dialog durumları
    const [showPreview, setShowPreview] = useState(false);
    const [showSettings, setShowSettings] = useState(true);

    // PDF referansı
    const { targetRef } = usePDF({
        filename: "proforma-fatura.pdf",
        method: "save"
    });

    // Toplam hesaplama
    const grandTotal = services.reduce((sum, service) => sum + service.total, 0);
    const invoiceNo = paymentRecord?.id ? `PF-${paymentRecord.id}-${Date.now()}` : `PF-${Date.now()}`;

    // PDF indirme fonksiyonu
    const handleDownloadPDF = () => {
        generatePDF(targetRef, {filename: 'proforma-fatura.pdf'});
    };

    useEffect(() => {
        if (paymentRecord) {
            setCustomerName(paymentRecord.item?.customerName || '');
            setInvoiceNote(paymentRecord.note || '');
            setServices([{
                id: 1,
                serviceName: paymentRecord.item?.productName || '',
                quantity: 1,
                unitPrice: paymentRecord.amount || 0,
                total: paymentRecord.amount || 0
            }]);
        }
    }, [paymentRecord]);

    const handleServiceChange = (id, field, value) => {
        setServices(prev => prev.map(service => {
            if (service.id === id) {
                const updated = { ...service, [field]: value };

                // Hizmet adı değiştiğinde fiyatı otomatik doldur
                if (field === 'serviceName' && servicePriceMap[value]) {
                    updated.unitPrice = servicePriceMap[value];
                }

                // Miktar veya birim fiyat değiştiğinde toplamı hesapla
                if (field === 'quantity' || field === 'unitPrice') {
                    updated.total = Number(updated.quantity) * Number(updated.unitPrice);
                }

                return updated;
            }
            return service;
        }));
    };

    const addService = () => {
        const newId = Math.max(...services.map(s => s.id)) + 1;
        setServices(prev => [...prev, {
            id: newId,
            serviceName: '',
            quantity: 1,
            unitPrice: 0,
            total: 0
        }]);
    };

    const removeService = (id) => {
        if (services.length > 1) {
            setServices(prev => prev.filter(s => s.id !== id));
        }
    };

    const handlePreview = () => {
        setShowSettings(false);
        setShowPreview(true);
    };

    const handleBackToEdit = () => {
        setShowPreview(false);
        setShowSettings(true);
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{
                background: MAIN_BLUE,
                color: '#fff',
                textAlign: 'center',
                letterSpacing: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>PROFORMA FATURA OLUŞTUR</span>
                <Box>
                    <IconButton
                        color="inherit"
                        onClick={handlePreview}
                        disabled={!customerName || services.some(s => !s.serviceName)}
                    >
                        <VisibilityIcon />
                    </IconButton>
                    {showPreview && (
                        <IconButton color="inherit" onClick={handleBackToEdit}>
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>
            </DialogTitle>

            <DialogContent sx={{ background: LIGHT_BLUE, py: 3 }}>
                {showSettings && (
                    <Grid container spacing={3}>
                        {/* Şirket Bilgileri */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color={MAIN_BLUE}>
                                        Şirket Bilgileri
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Şirket Adı"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        margin="normal"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Fatura Bilgileri */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color={MAIN_BLUE}>
                                        Fatura Bilgileri
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Fatura No"
                                        value={invoiceNo}
                                        disabled
                                        margin="normal"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Fatura Tarihi"
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        margin="normal"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Müşteri Bilgileri */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom color={MAIN_BLUE}>
                                        Müşteri Bilgileri
                                    </Typography>
                                    <Autocomplete
                                        freeSolo
                                        options={customerList}
                                        value={customerName}
                                        onInputChange={(_, newValue) => setCustomerName(newValue)}
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label="Müşteri Adı"
                                                fullWidth
                                                required
                                                margin="normal"
                                            />
                                        )}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Fatura Notu"
                                        value={invoiceNote}
                                        onChange={(e) => setInvoiceNote(e.target.value)}
                                        multiline
                                        rows={3}
                                        margin="normal"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Hizmetler */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6" color={MAIN_BLUE}>
                                            Hizmetler
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={addService}
                                            size="small"
                                        >
                                            Hizmet Ekle
                                        </Button>
                                    </Box>

                                    {services.map((service, index) => (
                                        <Paper key={service.id} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} sm={4}>
                                                    <Autocomplete
                                                        freeSolo
                                                        options={serviceList}
                                                        value={service.serviceName}
                                                        onInputChange={(_, newValue) =>
                                                            handleServiceChange(service.id, 'serviceName', newValue)
                                                        }
                                                        renderInput={params => (
                                                            <TextField
                                                                {...params}
                                                                label="Hizmet Adı"
                                                                fullWidth
                                                                size="small"
                                                                required
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    <TextField
                                                        label="Miktar"
                                                        type="number"
                                                        value={service.quantity}
                                                        onChange={(e) =>
                                                            handleServiceChange(service.id, 'quantity', Number(e.target.value) || 1)
                                                        }
                                                        fullWidth
                                                        size="small"
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    <TextField
                                                        label="Birim Fiyat"
                                                        type="number"
                                                        value={service.unitPrice}
                                                        onChange={(e) =>
                                                            handleServiceChange(service.id, 'unitPrice', Number(e.target.value) || 0)
                                                        }
                                                        fullWidth
                                                        size="small"
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    <TextField
                                                        label="Toplam"
                                                        value={service.total.toFixed(2)}
                                                        fullWidth
                                                        size="small"
                                                        disabled
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={2}>
                                                    {services.length > 1 && (
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => removeService(service.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    ))}

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Typography variant="h6" color={MAIN_BLUE}>
                                            Genel Toplam: {grandTotal.toFixed(2)} ₺
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Önizleme alanı */}
                {showPreview && (
                    <div ref={targetRef} style={{ display: 'none' }}>
                        <Box sx={{
                            background: '#fff',
                            p: 3,
                            minHeight: '800px'
                        }}>
                            {/* Fatura Başlığı */}
                            <Box sx={{
                                textAlign: 'center',
                                mb: 4,
                                borderBottom: `3px solid ${MAIN_BLUE}`,
                                pb: 2
                            }}>
                                <Typography variant="h3" sx={{
                                    color: MAIN_BLUE,
                                    fontWeight: 'bold',
                                    letterSpacing: 3
                                }}>
                                    PROFORMA FATURA
                                </Typography>
                            </Box>

                            {/* Şirket ve Fatura Bilgileri */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 4
                            }}>
                                <Box>
                                    <Typography variant="h5" sx={{
                                        fontWeight: 'bold',
                                        color: MAIN_BLUE,
                                        mb: 1
                                    }}>
                                        {companyName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        www.uzai.com.tr
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h6" sx={{ color: MAIN_BLUE }}>
                                        Fatura No: <strong>{invoiceNo}</strong>
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: MAIN_BLUE }}>
                                        Tarih: <strong>{formatDisplayDate(invoiceDate)}</strong>
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Müşteri Bilgileri */}
                            <Box sx={{
                                mb: 4,
                                p: 2,
                                background: LIGHT_BLUE,
                                borderRadius: 1
                            }}>
                                <Typography variant="h6" sx={{
                                    color: MAIN_BLUE,
                                    mb: 1
                                }}>
                                    Fatura Edilen:
                                </Typography>
                                <Typography variant="h5" sx={{
                                    fontWeight: 'bold'
                                }}>
                                    {customerName}
                                </Typography>
                                {invoiceNote && (
                                    <Typography variant="body1" sx={{
                                        mt: 2,
                                        fontStyle: 'italic'
                                    }}>
                                        Not: {invoiceNote}
                                    </Typography>
                                )}
                            </Box>

                            {/* Hizmetler Tablosu */}
                            <TableContainer component={Paper} sx={{
                                mb: 4,
                                border: `2px solid ${MAIN_BLUE}`
                            }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ background: MAIN_BLUE }}>
                                            <TableCell sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 16
                                            }}>
                                                #
                                            </TableCell>
                                            <TableCell sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 16
                                            }}>
                                                Hizmet/Ürün
                                            </TableCell>
                                            <TableCell sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                                textAlign: 'center'
                                            }}>
                                                Miktar
                                            </TableCell>
                                            <TableCell sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                                textAlign: 'right'
                                            }}>
                                                Birim Fiyat (₺)
                                            </TableCell>
                                            <TableCell sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: 16,
                                                textAlign: 'right'
                                            }}>
                                                Toplam (₺)
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {services?.map((service, index) => (
                                            <TableRow
                                                key={service.id}
                                                sx={{
                                                    '&:nth-of-type(even)': {
                                                        background: '#f9f9f9'
                                                    }
                                                }}
                                            >
                                                <TableCell sx={{
                                                    fontSize: 14,
                                                    fontWeight: 'bold'
                                                }}>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: 14 }}>
                                                    {service.serviceName}
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontSize: 14,
                                                    textAlign: 'center'
                                                }}>
                                                    {service.quantity}
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontSize: 14,
                                                    textAlign: 'right'
                                                }}>
                                                    {service.unitPrice.toFixed(2)}
                                                </TableCell>
                                                <TableCell sx={{
                                                    fontSize: 14,
                                                    textAlign: 'right',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {service.total.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Toplam */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mb: 4
                            }}>
                                <Box sx={{
                                    minWidth: 300,
                                    background: LIGHT_BLUE,
                                    border: `2px solid ${MAIN_BLUE}`,
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'right'
                                }}>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 'bold',
                                        color: MAIN_BLUE
                                    }}>
                                        TOPLAM TUTAR
                                    </Typography>
                                    <Typography variant="h3" sx={{
                                        fontWeight: 'bold',
                                        color: MAIN_BLUE,
                                        mt: 1
                                    }}>
                                        {grandTotal?.toFixed(2)} ₺
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Alt Bilgiler */}
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" sx={{
                                    color: '#777',
                                    mb: 2
                                }}>
                                    <strong>Ödeme Koşulları:</strong> Lütfen ödemeyi fatura tarihinden itibaren 30 gün içinde tamamlayınız.
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: '#777',
                                    mb: 2
                                }}>
                                    <strong>Önemli:</strong> Bu bir proforma faturadır ve yasal fatura yerine geçmez.
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: '#aaa',
                                    textAlign: 'center',
                                    mt: 3
                                }}>
                                    Bu belge dijital olarak oluşturulmuştur. | {companyName} - Profesyonel Hizmetler
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                )}

                {/* Önizleme görünümü */}
                {showPreview && (
                    <TestComponent
                        companyName={companyName}
                        invoiceNo={invoiceNo}
                        invoiceDate={invoiceDate}
                        services={services}
                        customerName={customerName}
                        invoiceNote={invoiceNote}
                        grandTotal={grandTotal}
                        isPreview={true}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ background: LIGHT_BLUE, p: 3 }}>
                <Button onClick={onClose} variant="outlined">
                    Kapat
                </Button>
                {showSettings && (
                    <Button
                        onClick={handlePreview}
                        variant="contained"
                        color="primary"
                        disabled={!customerName || services.some(s => !s.serviceName)}
                    >
                        Önizleme
                    </Button>
                )}
                {showPreview && (
                    <>
                        <Button onClick={handleBackToEdit} variant="outlined" color="primary">
                            Düzenle
                        </Button>
                        <Button
                            onClick={handleDownloadPDF}
                            variant="contained"
                            color="success"
                            startIcon={<DownloadIcon />}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4,
                                    transform: 'translateY(-1px)'
                                },
                                transition: 'all 0.2s ease-in-out'
                            }}
                        >
                            PDF İndir
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default InvoiceCreationDialog;