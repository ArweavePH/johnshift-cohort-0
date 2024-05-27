import 'dotenv/config';

import fs from 'fs/promises';
import { DataItemCreateOptions, createData } from 'arbundles';
import { ArweaveSigner, TurboFactory } from '@ardrive/turbo-sdk';

import path from 'path';

(async () => {
  if (!process.env.PATH_TO_WALLET) {
    console.error('Missing PATH_TO_WALLET env');
    process.exit();
  }

  let data: Uint8Array;

  try {
    const imagePath = path.join(__dirname, 'arweave-ph.jpeg');
    const imgBuffer = await fs.readFile(imagePath);
    data = new Uint8Array(imgBuffer);
  } catch (err) {
    console.error('Error reading the file:', err);
    return;
  }

  let JWK;
  try {
    const jwkBuffer = await fs.readFile(process.env.PATH_TO_WALLET, 'utf-8');
    JWK = JSON.parse(jwkBuffer);
  } catch (err) {
    console.error('Error reading the wallet file:', err);
    return;
  }

  const signer = new ArweaveSigner(JWK);

  const opts: DataItemCreateOptions = {
    tags: [
      { name: 'Content-Type', value: 'image/jpeg' },
      { name: 'App-Name', value: 'ArweavePH-Cohort-0' },
      { name: 'App-Version', value: '0.0.1' },
      {
        name: 'Title',
        value: 'ArweavePH Logo',
      },
      {
        name: 'Author',
        value: 'johnshift',
      },
    ],
  };

  const signedDataItem = createData(data, signer, opts);

  await signedDataItem.sign(signer);

  const turbo = TurboFactory.authenticated({ privateKey: JWK });
  const uploadResult = await turbo.uploadSignedDataItem({
    dataItemStreamFactory: () => signedDataItem.getRaw(),
    dataItemSizeFactory: () => signedDataItem.getRaw().length,
    signal: AbortSignal.timeout(10_000),
  });

  console.log(JSON.stringify(uploadResult, null, 2));
})();
