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
import EditPaymentDialog from "./EditPaymentDialog.jsx";
import PaymentAddDialog from "./PaymentAddDialog.jsx";
import InvoiceCreationDialog from "./InvoiceCreationDialog.jsx";
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

    // Yeni proforma fatura dialog
    const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
    const [selectedInvoiceRecord, setSelectedInvoiceRecord] = useState(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

    // Proforma fatura oluşturma
    const handleInvoice = (paymentRecord) => {
        setSelectedInvoiceRecord(paymentRecord);
        setInvoiceDialogOpen(true);
    };

    const handleTabChange = (event, newValue) => {
        setStatusFilter(newValue);
    };

    const handleInvoiceDialogClose = () => {
        setInvoiceDialogOpen(false);
        setSelectedInvoiceRecord(null);
        setSnackbar({
            open: true,
            message: "Proforma fatura işlemi tamamlandı!",
            severity: "success"
        });
    };

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Satış ve Ödeme Takibi
            </Typography>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
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
                        color="primary"
                        onClick={() => setAddDialogOpen(true)}
                    >
                        Yeni Ödeme Ekle
                    </Button>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    <SalesPaymentTable
                        status={statusFilter}
                        onEdit={handleEdit}
                        onInvoice={handleInvoice}
                        paymentRecords={filteredRecords}
                    />
                </CardContent>
            </Card>

            {/* Proforma Fatura Dialog */}
            <InvoiceCreationDialog
                open={invoiceDialogOpen}
                onClose={handleInvoiceDialogClose}
                paymentRecord={selectedInvoiceRecord}
                paymentRecords={allPaymentRecords}
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