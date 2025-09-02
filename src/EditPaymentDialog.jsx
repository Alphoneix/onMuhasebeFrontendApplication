import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePaymentRecord } from "./ItemService.js";

const STATUS_OPTIONS = [
    { value: "YAPILDI", label: "Evet Yapıldı" },
    { value: "YAPILMADI", label: "Hayır Yapılmadı" },
    { value: "YAPILMAYACAK", label: "Hayır Yapılmayacak" },
];

function EditPaymentDialog({ open, paymentRecord, onClose }) {
    const [status, setStatus] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const queryClient = useQueryClient();

    useEffect(() => {
        if (paymentRecord) {
            setStatus(paymentRecord.paymentStatus);
            setPaymentDate(paymentRecord.paymentDate || "");
        }
    }, [paymentRecord]);

    const mutation = useMutation({
        mutationFn: ({ id, status, paymentDate }) =>
            updatePaymentRecord(id, status, status === "YAPILDI" ? paymentDate : null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paymentRecords"] });
            onClose();
        },
    });

    const handleSave = () => {
        if (!paymentRecord) return;
        mutation.mutate({
            id: paymentRecord.id,
            status,
            paymentDate: status === "YAPILDI" ? paymentDate : null,
        });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Ödeme Kaydını Düzenle</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 2 }}>
                    Ödeme Miktarı: {paymentRecord?.amount != null ? Number(paymentRecord.amount).toFixed(2) : "-"} ₺
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Ödeme Durumu</InputLabel>
                    <Select
                        value={status}
                        label="Ödeme Durumu"
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {status === "YAPILDI" && (
                    <TextField
                        fullWidth
                        label="Ödeme Yapıldığı Tarih"
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                    disabled={mutation.isLoading}
                >
                    Kaydet
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditPaymentDialog;