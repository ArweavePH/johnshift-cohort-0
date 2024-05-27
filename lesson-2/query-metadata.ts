import Query from '@irys/query';

(async () => {
  const myQuery = new Query({ network: 'arweave' });
  const results = await myQuery
    .search('arweave:transactions')
    .tags([
      {
        name: 'Author',
        values: ['johnshift'],
      },
    ])
    .first();

  console.log('results ==>', results.id);
})();
