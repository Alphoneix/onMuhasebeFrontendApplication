import React, { useState, useMemo } from "react";
import { Card, CardContent, Typography, Box, Button, Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import SalesPaymentTable from "./SalesPaymentTable.jsx";
import EditPaymentDialog from "./EditPaymentDialog.jsx";
import PaymentAddDialog from "./PaymentAddDialog.jsx";
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

    const handleEdit = (paymentRecord) => {
        setSelectedPayment(paymentRecord);
        setEditDialogOpen(true);
    };

    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedPayment(null);
    };

    const handleAddOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddClose = () => {
        setAddDialogOpen(false);
    };

    return (
        <Box sx={{ my: 4 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Satış Ödeme Takibi
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {STATUS_OPTIONS.map((option) => (
                            <Grid item key={option.value}>
                                <Button
                                    variant={statusFilter === option.value ? "contained" : "outlined"}
                                    color="primary"
                                    onClick={() => setStatusFilter(option.value)}
                                >
                                    {option.label}
                                </Button>
                            </Grid>
                        ))}
                        <Grid item xs>
                            {/* Sağda hizalama için boş Grid */}
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleAddOpen}
                            >
                                Yeni Ödeme Ekle
                            </Button>
                        </Grid>
                    </Grid>
                    <SalesPaymentTable
                        status={statusFilter}
                        onEdit={handleEdit}
                    />
                </CardContent>
            </Card>
            <EditPaymentDialog
                open={editDialogOpen}
                paymentRecord={selectedPayment}
                onClose={handleDialogClose}
            />
            <PaymentAddDialog
                open={addDialogOpen}
                onClose={handleAddClose}
                paymentRecords={allPaymentRecords} // autocomplete için tüm kayıtlar!
            />
        </Box>
    );
}

export default SalesPaymentTracking;