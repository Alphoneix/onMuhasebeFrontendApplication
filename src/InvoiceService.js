// src/InvoiceService.js
import { jsPDF } from "jspdf";

export function generateInvoicePDF(paymentRecord) {
    const doc = new jsPDF();

    // Placeholder bilgiler
    const companyName = "Şirket Adı";
    const companyAddress = "Adres, Şehir, Türkiye";
    const companyTaxNo = "Vergi No: 1234567890";
    const logoUrl = ""; // Varsa logo ekleyebilirsiniz

    // Fatura başlığı
    doc.setFontSize(18);
    doc.text("FATURA", 105, 20, { align: "center" });

    // Şirket bilgileri
    doc.setFontSize(12);
    doc.text(companyName, 20, 35);
    doc.text(companyAddress, 20, 42);
    doc.text(companyTaxNo, 20, 49);

    // Müşteri bilgileri
    doc.text(`Müşteri: ${paymentRecord.item?.customerName || ""}`, 20, 60);
    doc.text(`Ürün/Hizmet: ${paymentRecord.item?.productName || ""}`, 20, 67);

    // Fatura detayları
    doc.text(`Fatura Tarihi: ${paymentRecord.paymentDate || paymentRecord.dueDate || ""}`, 20, 80);
    doc.text(`Tutar: ${Number(paymentRecord.amount).toFixed(2)} ₺`, 20, 87);

    // Fatura numarası (örnek)
    doc.text(`Fatura No: INV-${paymentRecord.id}`, 150, 35);

    // Alt bilgi
    doc.setFontSize(10);
    doc.text("Bu fatura dijital olarak oluşturulmuştur.", 20, 270);

    // PDF'i indir
    doc.save(`Fatura_${paymentRecord.id}.pdf`);
}