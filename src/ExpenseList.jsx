import axios from 'axios';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useState} from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    InputAdornment,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {AAComp} from "./AAComp.jsx";

async function fetchExpenses() {
    const http = await axios.get('http://localhost:8080/api/expense');
    return http.data;
}

async function fetchIncomes() {
    const http = await axios.get('http://localhost:8080/api/income');
    return http.data;
}

function ExpenseList() {
    const [amount, setAmount] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');

    const [snackbar, setSnackbar] = useState({
        open: false, message: '', severity: 'success'
    });
    const queryClient = useQueryClient();

    const {data: expensesData, isLoading: expenseLoading, isError: expenseError} = useQuery({
        queryKey: ['expenses'], queryFn: fetchExpenses, initialData: []
    });

    const {data: incomeData, isLoading: incomeLoading, isError: incomeError} = useQuery({
        queryKey: ['incomes'], queryFn: fetchIncomes, initialData: []
    });

    const isLoading = expenseLoading || incomeLoading;
    const isError = expenseError || incomeError;

    function handleSubmit(item, url) {
        axios.post('http://localhost:8080/api/' + url, item)
            .then(response => {
                setSnackbar({
                    open: true, message: 'Değer başarıyla eklendi!', severity: 'success'
                });
                queryClient.refetchQueries(["expenses", "incomes"]);
                setAmount('');
                setIncomeAmount('');
            })
            .catch(error => {
                setSnackbar({
                    open: true, message: 'Değer eklenirken bir hata oluştu!', severity: 'error'
                });
                console.error('There was an error adding the expense!', error);
            });
    }

    function onAddExpense() {
        if (!amount) return;

        const expense = {
            "amount": Number(amount),
        };

        handleSubmit(expense, "expense");
    }
    function onAddIncome() {
        if (!incomeAmount) return;

        const income = {
            "amount": Number(incomeAmount),
        };

        handleSubmit(income, "income");
    }

    function handleCloseSnackbar() {
        setSnackbar({...snackbar, open: false});
    }

    // Giderler toplamı
    const totalExpenseSum = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);
    // Gelirler toplamı
    const totalIncomeSum = incomeData.reduce((sum, income) => sum + Number(income.amount), 0);

    // Genel toplam (gelirler - giderler)
    const generalSum = totalIncomeSum - totalExpenseSum;

    return (<Container maxWidth="md">
        <Box sx={{my: 4}}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Gelir/Gider Yönetimi
            </Typography>

            <Grid container spacing={3} sx={{mb: 4}}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Yeni Gider Ekle
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Gider Miktarı"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        InputProps={{
                                            startAdornment: (<InputAdornment position="start">₺</InputAdornment>),
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={onAddExpense}
                                        startIcon={<AddIcon/>}
                                        disabled={!amount}
                                        sx={{mt: 1}}
                                    >
                                        Yeni Gider Ekle
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Yeni Gelir Ekle
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Gelir Miktarı"
                                        type="number"
                                        value={incomeAmount}
                                        onChange={(e) => setIncomeAmount(e.target.value)}
                                        InputProps={{
                                            startAdornment: (<InputAdornment position="start">₺</InputAdornment>),
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={onAddIncome}
                                        startIcon={<AddIcon/>}
                                        disabled={!incomeAmount}
                                        sx={{mt: 1}}
                                    >
                                        Yeni Gelir Ekle
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <AAComp
                data={expensesData.map(e => ({ ...e, id: e.id.toString() + "expense" }))}
                isLoading={expenseLoading}
                isError={expenseError}
                total={totalExpenseSum}
                totalLabel="Giderler Toplamı"
                title="Gider Listesi"
            />

            <AAComp
                data={incomeData.map(i => ({ ...i, id: i.id.toString() + "income" }))}
                isLoading={incomeLoading}
                isError={incomeError}
                total={totalIncomeSum}
                totalLabel="Gelirler Toplamı"
                title="Gelir Listesi"
            />

            {/* Genel toplam (Gelirler - Giderler) */}
            <Box sx={{mt: 4}}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" align="right">
                            Genel Toplam: {generalSum.toFixed(2)} ₺
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

        </Box>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={snackbar.severity}
                sx={{width: '100%'}}
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
    </Container>);
}

export default ExpenseList;