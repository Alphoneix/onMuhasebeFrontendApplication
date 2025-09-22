import React, { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Grid,
    Snackbar,
    Alert,
    Tabs,
    Tab
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import SalesPaymentTable from "./SalesPaymentTable.jsx";
import SalesPaymentTableRow from "./SalesPaymentTableRow.jsx";
import EditPaymentDialog from "./EditPaymentDialog.jsx";
import PaymentAddDialog from "./PaymentAddDialog.jsx";
import InvoiceListDialog from "./InvoiceListDialog.jsx";
import InvoicePreviewDialog from "./InvoicePreviewDialog.jsx";
import { fetchPaymentRecords } from "./ItemService.js";

const STATUS_OPTIONS = [
    { value: "YAPILMADI", label: "Yapılmayan Ödemeler" },
    { value: "YAPILDI", label: "Yapılan Ödemeler" },
    { value: "YAPILMAYACAK", label: "Yapılmayacak Ödemeler" },
];

function SalesPaymentTracking() {
    const [statusFilter, setStatusFilter] = useState("YAPILMADI");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    // Fatura dialog ve snackbar
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Faturalı kayıtlar
    const [invoicedRecords, setInvoicedRecords] = useState([]);

    // Fatura önizleme dialogu
    const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
    const [previewRecord, setPreviewRecord] = useState(null);

    // Her status için ayrı ayrı ödeme kayıtlarını çekiyoruz
    const { data: recordsNotDone = [] } = useQuery({
        queryKey: ["paymentRecords", "YAPILMADI"],
        queryFn: () => fetchPaymentRecords("YAPILMADI"),
        initialData: [],
    });
    const { data: recordsDone = [] } = useQuery({
        queryKey: ["paymentRecords", "YAPILDI"],
        queryFn: () => fetchPaymentRecords("YAPILDI"),
        initialData: [],
    });
    const { data: recordsNever = [] } = useQuery({
        queryKey: ["paymentRecords", "YAPILMAYACAK"],
        queryFn: () => fetchPaymentRecords("YAPILMAYACAK"),
        initialData: [],
    });

    // Bütün kayıtları birleştiriyoruz
    const allPaymentRecords = useMemo(() => [
        ...recordsNotDone,
        ...recordsDone,
        ...recordsNever
    ], [recordsNotDone, recordsDone, recordsNever]);

    const filteredRecords = useMemo(() => {
        if (statusFilter === "YAPILMADI") return recordsNotDone;
        if (statusFilter === "YAPILDI") return recordsDone;
        if (statusFilter === "YAPILMAYACAK") return recordsNever;
        return allPaymentRecords;
    }, [statusFilter, recordsNotDone, recordsDone, recordsNever, allPaymentRecords]);

    const handleEdit = (paymentRecord) => {
        setSelectedPayment(paymentRecord);
        setEditDialogOpen(true);
    };

    // Fatura butonuna basınca önizleme açılır
    const handleInvoice = (paymentRecord) => {
        setPreviewRecord(paymentRecord);
        setInvoicePreviewOpen(true);
    };

    // Fatura önizlemede indirildiğinde, invoicedRecords'a ekle (isteğe bağlı)
    const handleInvoiceDownloaded = (paymentRecord) => {
        setInvoicePreviewOpen(false);
        setSnackbar({ open: true, message: "Fatura başarıyla indirildi!", severity: "success" });

        paymentRecord.invoiced = true;
        setInvoicedRecords(prev => {
            if (!prev.find(r => r.id === paymentRecord.id)) {
                return [...prev, paymentRecord];
            }
            return prev;
        });
    };

    const handleInvoiceDialogOpen = () => setInvoiceDialogOpen(true);
    const handleInvoiceDialogClose = () => setInvoiceDialogOpen(false);

    const handleTabChange = (event, newValue) => {
        setStatusFilter(newValue);
    };

    return (
        <Box sx={{ my: 4 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                    <Tabs
                        value={statusFilter}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {STATUS_OPTIONS.map(option => (
                            <Tab
                                key={option.value}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Tabs>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleInvoiceDialogOpen}
                        sx={{ mr: 2 }}
                    >
                        Faturalar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setAddDialogOpen(true)}
                    >
                        Yeni Ödeme Ekle
                    </Button>
                </Grid>
            </Grid>
            <SalesPaymentTable
                status={statusFilter}
                onEdit={handleEdit}
                onInvoice={handleInvoice}
                paymentRecords={filteredRecords}
            />
            <InvoiceListDialog
                open={invoiceDialogOpen}
                onClose={handleInvoiceDialogClose}
                invoices={invoicedRecords}
                onInvoiceDownload={(_paymentRecord) => {}} // Kendi InvoicePreviewDialog'unuzda PDF indiriliyor, burada gerek yok
            />
            <InvoicePreviewDialog
                open={invoicePreviewOpen}
                onClose={() => setInvoicePreviewOpen(false)}
                paymentRecord={previewRecord}
                paymentRecords={allPaymentRecords}
                onDownloaded={handleInvoiceDownloaded}
            />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
            <EditPaymentDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                paymentRecord={selectedPayment}
            />
            <PaymentAddDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                paymentRecords={allPaymentRecords}
            />
        </Box>
    );
}

export default SalesPaymentTracking;