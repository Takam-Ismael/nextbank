package com.nextbank.accounts.service;

import org.springframework.stereotype.Service;

@Service
public class QrCodeService {

    /**
     * Generates a unique, secure token for a user that will be encoded into a QR code.
     */
    public String generateUserQrToken() {
        // In a real banking app, this might be a signed hash or a more complex token.
        // For now, we use a secure UUID.
        return java.util.UUID.randomUUID().toString();
    }

    /**
     * Generates a QR code image as a Base64 string.
     */
    public String generateQrCodeBase64(String text) {
        try {
            int width = 300;
            int height = 300;
            com.google.zxing.qrcode.QRCodeWriter qrCodeWriter = new com.google.zxing.qrcode.QRCodeWriter();
            com.google.zxing.common.BitMatrix bitMatrix = qrCodeWriter.encode(text, com.google.zxing.BarcodeFormat.QR_CODE, width, height);

            java.io.ByteArrayOutputStream pngOutputStream = new java.io.ByteArrayOutputStream();
            com.google.zxing.client.j2se.MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            return java.util.Base64.getEncoder().encodeToString(pngData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR Code", e);
        }
    }
}
