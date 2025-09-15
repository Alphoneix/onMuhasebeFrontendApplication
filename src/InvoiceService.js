import { jsPDF } from "jspdf";

function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    // GG.AA.YYYY
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

export function generateInvoicePDF(paymentRecord) {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal"); // TÜRKÇE karakterlerin tamamı olmaz ama PDF hatasız oluşur

    // Renkler
    const MAIN_BLUE = "#1565c0";
    const LIGHT_BLUE = "#e3f2fd";

    // Sayfa başlığı
    doc.setFillColor(MAIN_BLUE);
    doc.rect(0, 0, 210, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("PROFORMA FATURA", 105, 13, { align: "center" });

    // Firma adı
    doc.setFontSize(12);
    doc.setTextColor(MAIN_BLUE);
    doc.text("UzAI Teknoloji", 12, 28);

    // Fatura bilgiler
    const date = paymentRecord.paymentDate || paymentRecord.dueDate || "";
    const formattedDate = formatDate(date);
    const invoiceNo = paymentRecord.id ? `INV-${paymentRecord.id}` : "";

    // Sağ üst kutu
    doc.setTextColor(MAIN_BLUE);
    doc.text(`Fatura No:`, 160, 28);
    doc.text(`${invoiceNo}`, 185, 28, { align: "right" });
    doc.text(`Fatura Tarihi:`, 160, 34);
    doc.text(`${formattedDate}`, 185, 34, { align: "right" });
    doc.text(`Vade Tarihi:`, 160, 40);
    doc.text(`${formattedDate}`, 185, 40, { align: "right" });

    // Bill to (müşteri adı)
    doc.setTextColor(MAIN_BLUE);
    doc.text("Bill To:", 12, 45);
    doc.setTextColor(0, 0, 0);
    doc.text(`${paymentRecord.item?.customerName || ""}`, 12, 51);

    // Tablo başlığı
    doc.setFillColor(MAIN_BLUE);
    doc.setTextColor(255, 255, 255);
    doc.rect(12, 60, 186, 8, "F");
    doc.setFontSize(12);
    doc.text("#", 16, 66);
    doc.text("Hizmet", 30, 66);
    doc.text("Tutar (TL)", 186, 66, { align: "right" });

    // Tablo satırı (tek satır)
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.rect(12, 68, 186, 10);
    doc.text("1", 16, 75);
    doc.text(`${paymentRecord.item?.productName || ""}`, 30, 75);
    const tutar = paymentRecord.amount != null ? Number(paymentRecord.amount).toFixed(2) : "0.00";
    doc.text(`${tutar} TL`, 186, 75, { align: "right" });

    // Toplam kutusu
    doc.setFillColor(227, 242, 253); // LIGHT_BLUE
    doc.rect(120, 90, 78, 24, "F");
    doc.setDrawColor(MAIN_BLUE);
    doc.rect(120, 90, 78, 24);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Toplam Tutar:", 126, 100);
    doc.setTextColor(MAIN_BLUE);
    doc.setFontSize(16);
    doc.text(`${tutar} TL`, 192, 104, { align: "right" });
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Balance Due: ${tutar} TL`, 126, 113);

    // Terms ve footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Lütfen ödemeyi fatura tarihinden itibaren 1 is günü içinde tamamlayınız. Bu bir proforma faturadir ve odeme yapilmadan hizmet baslamaz.", 12, 130, { maxWidth: 186 });
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text("Bu belge dijital olarak olusturulmustur ve resmi bir fatura yerine gecmez.", 12, 200, { maxWidth: 186, align: "center" });

    doc.save(`ProformaFatura_${paymentRecord.id || ""}.pdf`);
}