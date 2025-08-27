import {
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import axios from "axios";



async function fetchExpenses() {
    const http = await axios.get('http://localhost:8080/api/expense');
    return http.data;
}

async function fetchIncomes() {
    const http = await axios.get('http://localhost:8080/api/income');
    return http.data;
}



export function AAComp({data,isLoading,isError, totalExpense, title}) {

    return <>
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                {isLoading ? (<Typography>Yükleniyor...</Typography>) : isError ? (
                    <Typography color="error">Veri yüklenirken bir hata
                        oluştu!</Typography>) : data.length === 0 ? (
                    <Typography>Henüz hiç gider eklenmemiş.</Typography>) : (<>
                    <TableContainer component={Paper} sx={{mb: 2}}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: 'primary.light'}}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Açıklama</TableCell>
                                    <TableCell align="right">Tutar (₺)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((item) => (<TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.description || ""}</TableCell>
                                    <TableCell
                                        align="right">{item.amount?.toFixed(2) * (item.id.endsWith("expense") ? -1 : 1)}</TableCell>
                                </TableRow>))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h6" align="right">
                        Toplam: {totalExpense.toFixed(2)} ₺
                    </Typography>
                </>)}
            </CardContent>
        </Card>
    </>;
}