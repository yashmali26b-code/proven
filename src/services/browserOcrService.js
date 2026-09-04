import { createWorker } from 'tesseract.js';

let browserWorker = null;
let initPromise = null;

export async function getBrowserOcrWorker(onProgress = () => {}) {
  if (browserWorker) return browserWorker;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            onProgress(Math.round(m.progress * 100));
          }
        }
      });
      browserWorker = worker;
      return worker;
    } catch (err) {
      console.warn('[Browser OCR] Worker init warning:', err);
      throw err;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

function scoreGovText(text, confidence = 0) {
  if (!text) return 0;
  let score = 0;
  const upper = text.toUpperCase();
  const keywords = [
    'GOVERNMENT', 'INDIA', 'BHARAT', 'SARKAR', 'AADHAAR', 'INCOME', 'TAX',
    'DEPARTMENT', 'DOB', 'DATE OF BIRTH', 'MALE', 'FEMALE', 'FATHER', 'PERMANENT', 'ACCOUNT', 'PASSPORT',
    'REPUBLIC', 'PROOF', 'IDENTITY'
  ];
  for (let i = 0; i < keywords.length; i++) {
    if (upper.includes(keywords[i])) score += 15;
  }
  if (/\b\d{4}\s?\d{4}\s?\d{4}\b/.test(text)) score += 40;
  if (/\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(text)) score += 40;
  if (/\b\d{2}[/-]\d{2}[/-]\d{4}\b/.test(text)) score += 25;
  score += Math.min(20, confidence * 0.2);
  return score;
}

export async function fileToEnhancedCanvas(file, angle = 0, highPass = false) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const isRotated90or270 = angle === 90 || angle === 270;
      const targetWidth = isRotated90or270 ? img.height : img.width;
      const targetHeight = isRotated90or270 ? img.width : img.height;

      let scale = 1.0;
      const maxDim = Math.max(targetWidth, targetHeight);
      if (maxDim > 2200) {
        scale = 2200 / maxDim;
      } else if (maxDim < 1000) {
        scale = 1400 / maxDim;
      }

      canvas.width = Math.round(targetWidth * scale);
      canvas.height = Math.round(targetHeight * scale);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);

      const drawW = Math.round(isRotated90or270 ? canvas.height : canvas.width);
      const drawH = Math.round(isRotated90or270 ? canvas.width : canvas.height);

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        const contrastFactor = highPass ? 1.6 : 1.35;

        for (let i = 0; i < d.length; i += 4) {
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          let val = (gray - 128) * contrastFactor + 128;
          if (highPass) {
            val = val > 140 ? 255 : (val < 110 ? 0 : val);
          }
          const contrasted = Math.min(255, Math.max(0, val));
          d[i] = contrasted;
          d[i + 1] = contrasted;
          d[i + 2] = contrasted;
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {}

      resolve(canvas);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

export async function extractClientOcr(file, onProgress = () => {}) {
  if (!file) return null;
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return null;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const isPortrait = img.height > img.width;
        const anglesToTest = isPortrait ? [0, 270, 90, 180] : [0, 90, 270, 180];

        const worker = await getBrowserOcrWorker(onProgress);

        let bestResult = null;
        let bestScore = -1;

        for (const angle of anglesToTest) {
          const canvas = await fileToEnhancedCanvas(file, angle, false);
          const res = await worker.recognize(canvas);
          const rawText = res.data.text ? res.data.text.trim() : '';
          const conf = typeof res.data.confidence === 'number' ? res.data.confidence : 0;
          const score = scoreGovText(rawText, conf);

          if (score > bestScore || !bestResult) {
            bestScore = score;
            bestResult = {
              rawText,
              confidence: Number((conf / 100).toFixed(2)),
              blocks: (res.data.blocks || []).map(b => ({
                text: b.text ? b.text.trim() : '',
                confidence: Number(((b.confidence || conf) / 100).toFixed(2))
              })).filter(b => b.text.length > 0)
            };

            if (score >= 45 && rawText.length >= 40) break;
          }
        }

        resolve(bestResult);
      } catch (err) {
        console.warn('[Browser OCR] Extraction failed, falling back to server:', err);
        resolve(null);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };

    img.src = objectUrl;
  });
}
