import QRCode from 'qrcode';

export class QrService {
  async toDataUrl(qrRaw: string) {
    return QRCode.toDataURL(qrRaw, { margin: 1, width: 280 });
  }
}
