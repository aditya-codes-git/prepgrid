const { PDFParse } = require('pdf-parse');

async function test() {
  try {
    console.log('Testing pdf-parse v2...');
    // PDFParse expects a buffer or URL in the constructor options
    const parser = new PDFParse({ data: Buffer.from('%PDF-1.1\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Size 1 >>\n%%EOF') });
    
    const result = await parser.getText();
    console.log('PDF Parse result:', result);
    
    await parser.destroy();
    console.log('Destroyed parser.');
  } catch (err) {
    console.error('PDF Parse error:', err);
  }
}

test();
