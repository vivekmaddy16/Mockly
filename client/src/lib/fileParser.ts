/**
 * Client-side file parser helper that dynamically loads external parsing libraries via CDNs
 * to extract text from PDF and DOCX files, keeping mockly serverless and lightweight.
 */

// Helper to dynamically load a script from CDN
const loadScript = (src: string, globalName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Browser environment required'));
      return;
    }
    
    // If global is already loaded, resolve immediately
    if ((window as any)[globalName]) {
      resolve((window as any)[globalName]);
      return;
    }

    // Check if script is already present
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any)[globalName]));
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve((window as any)[globalName]);
    script.onerror = (e) => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

/**
 * Extracts plain text from a PDF file using PDF.js via CDN.
 */
export const parsePdf = async (file: File): Promise<string> => {
  try {
    const pdfjs: any = await loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
      'pdfjsLib'
    );

    // Configure worker
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (err: any) {
    console.error('Error parsing PDF:', err);
    throw new Error(`Failed to parse PDF document: ${err.message || err}`);
  }
};

/**
 * Extracts plain text from a DOCX file using Mammoth.js via CDN.
 */
export const parseDocx = async (file: File): Promise<string> => {
  try {
    const mammoth: any = await loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
      'mammoth'
    );

    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.value) {
      return result.value.trim();
    }
    
    throw new Error('No text extracted from document');
  } catch (err: any) {
    console.error('Error parsing Word Doc:', err);
    throw new Error(`Failed to parse Word Document: ${err.message || err}`);
  }
};
