import https from 'node:https';

// Wraps the https.get method provided by Node in a promise
export function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    https.get(url, res => {
      res.on('data', chunk => chunks.push(chunk));
      res.on('error', reject);
      res.on('close', () => resolve(Buffer.concat(chunks)));
    });
  });
}
