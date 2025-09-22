import React, { useRef } from "react";
import ReactToPdf from "react-to-pdf";

function InvoicePreviewDialog({ open, onClose }) {
    const pdfRef = useRef();

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 9999
            }}
        >
            <div style={{ background: "#fff", padding: 32, borderRadius: 10, minWidth: 400 }}>
                <h3>Fatura Önizleme</h3>
                <div ref={pdfRef} style={{ background: "#fafafa", padding: 24, marginBottom: 20 }}>
                    <p><b>Müşteri:</b> Deneme Müşteri</p>
                    <p><b>Hizmet:</b> Danışmanlık</p>
                    <p><b>Tutar:</b> 1000 ₺</p>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                    <button onClick={onClose}>Kapat</button>
                    <ReactToPdf targetRef={pdfRef} filename="ornek-fatura.pdf" scale={1}>
                        {({ toPdf }) => (
                            <button onClick={toPdf} style={{ background: "#1565c0", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 4, cursor: "pointer" }}>
                                PDF Olarak İndir
                            </button>
                        )}
                    </ReactToPdf>
                </div>
            </div>
        </div>
    );
}

export default InvoicePreviewDialog;