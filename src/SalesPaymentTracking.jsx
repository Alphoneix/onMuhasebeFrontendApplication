import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Button, Grid } from "@mui/material";
import SalesPaymentTable from "./SalesPaymentTable.jsx";
import EditPaymentDialog from "./EditPaymentDialog.jsx";
import PaymentAddDialog from "./PaymentAddDialog.jsx"; // Yeni eklenen dosya!

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
            />
        </Box>
    );
}

export default SalesPaymentTracking;