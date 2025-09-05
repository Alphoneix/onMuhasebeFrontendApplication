import React, { useState, useMemo } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Alert,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Autocomplete
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addItem } from "./ItemService.js";

const DURATION_UNIT_OPTIONS = [
    { value: "MONTH", label: "Ay" },
    { value: "YEAR", label: "Yıl" },
];

const PAYMENT_FREQUENCY_UNIT_OPTIONS = [
    { value: "MONTH", label: "Her Ay" },
    { value: "YEAR", label: "Her Yıl" },
    { value: "ONCE", label: "Tek Sefer" },
];

// paymentRecords prop'u ile mevcut kayıtlar üst component'ten aktarılıyor
function PaymentAddDialog({ open, onClose, paymentRecords }) {
    const [productName, setProductName] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [durationUnit, setDurationUnit] = useState("YEAR");
    const [durationValue, setDurationValue] = useState("");
    const [paymentFrequencyUnit, setPaymentFrequencyUnit] = useState("MONTH");
    const [paymentFrequencyValue, setPaymentFrequencyValue] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [error, setError] = useState("");
    const queryClient = useQueryClient();

    // paymentRecords'tan benzersiz müşteri adları (büyük/küçük harf duyarsız)
    const customerNames = useMemo(() => {
        if (!paymentRecords) return [];
        const names = paymentRecords
            .map(rec => rec.item?.customerName || rec.customerName || "")
            .filter(x => !!x)
            .map(name => name.trim().toLowerCase());
        // Sadece küçük harfe çevirip benzersizleştir, sonra orijinal halleriyle döndür
        const unique = Array.from(new Set(names));
        // Orijinal halleriyle döndürmek için ilk eşleşeni bul
        return unique
            .map(lcName =>
                paymentRecords.find(rec =>
                    (rec.item?.customerName || rec.customerName || "").trim().toLowerCase() === lcName
                )
            )
            .map(rec => (rec.item?.customerName || rec.customerName || ""));
    }, [paymentRecords]);

    const mutation = useMutation({
        mutationFn: (newItem) => addItem(newItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paymentRecords"] });
            onClose();
            setProductName(""); setCustomerName(""); setStartDate("");
            setDurationUnit("YEAR"); setDurationValue("");
            setPaymentFrequencyUnit("MONTH"); setPaymentFrequencyValue("");
            setTotalAmount(""); setError("");
        },
        onError: () => {
            setError("Kayıt eklenirken hata oluştu.");
        }
    });

    const handleSave = () => {
        setError("");
        if (
            !productName ||
            !customerName ||
            !startDate ||
            !durationUnit ||
            !durationValue ||
            !paymentFrequencyUnit ||
            !paymentFrequencyValue ||
            !totalAmount
        ) {
            setError("Tüm alanları doldurmalısınız.");
            return;
        }
        const newItem = {
            productName,
            customerName,
            startDate,
            durationUnit,
            durationValue: parseInt(durationValue),
            paymentFrequencyUnit,
            paymentFrequencyValue: parseInt(paymentFrequencyValue),
            totalAmount: parseFloat(totalAmount),
        };
        mutation.mutate(newItem);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Yeni Ödeme/Hizmet Ekle</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Ürün/Hizmet Adı"
                            fullWidth
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            freeSolo
                            options={customerNames}
                            value={customerName}
                            onInputChange={(_, newValue) => setCustomerName(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Müşteri Adı"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Başlangıç Tarihi"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Süre Birimi</InputLabel>
                            <Select
                                value={durationUnit}
                                label="Süre Birimi"
                                onChange={e => setDurationUnit(e.target.value)}
                            >
                                {DURATION_UNIT_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Süre Miktarı"
                            type="number"
                            fullWidth
                            value={durationValue}
                            onChange={e => setDurationValue(e.target.value)}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Ödeme Sıklığı</InputLabel>
                            <Select
                                value={paymentFrequencyUnit}
                                label="Ödeme Sıklığı"
                                onChange={e => setPaymentFrequencyUnit(e.target.value)}
                            >
                                {PAYMENT_FREQUENCY_UNIT_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Sıklık Miktarı"
                            type="number"
                            fullWidth
                            value={paymentFrequencyValue}
                            onChange={e => setPaymentFrequencyValue(e.target.value)}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Toplam Ödeme Miktarı (₺)"
                            type="number"
                            fullWidth
                            value={totalAmount}
                            onChange={e => setTotalAmount(e.target.value)}
                            inputProps={{ min: 0, step: "0.01" }}
                        />
                    </Grid>
                </Grid>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button
                    onClick={handleSave}
                    color="success"
                    variant="contained"
                    disabled={mutation.isLoading}
                >
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PaymentAddDialog;