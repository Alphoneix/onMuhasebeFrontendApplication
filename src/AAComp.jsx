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

export function AAComp({data, isLoading, isError, total, totalLabel, title}) {
    return (
        <Card sx={{my: 2}}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                {isLoading ? (
                    <Typography>Yükleniyor...</Typography>
                ) : isError ? (
                    <Typography color="error">Veri yüklenirken bir hata oluştu!</Typography>
                ) : data.length === 0 ? (
                    <Typography>Henüz hiç kayıt yok.</Typography>
                ) : (
                    <>
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
                                    {data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.description || ""}</TableCell>
                                            <TableCell align="right">{Number(item.amount).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Typography variant="h6" align="right">
                            {totalLabel ? `${totalLabel}: ` : "Toplam: "}{Number(total).toFixed(2)} ₺
                        </Typography>
                    </>
                )}
            </CardContent>
        </Card>
    );
}