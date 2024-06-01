import Query from '@irys/query/node';
import { useQuery } from '@tanstack/react-query';

import { APP_FEATURES, APP_NAME, APP_VERSION } from '@/core/constants';
import { queryKeys } from '@/core/query-keys';
import { PollItem } from '@/core/types';

const getPollFeedTxs = async () => {
  const query = new Query({ network: 'arweave' });
  const transactions = await query.search('arweave:transactions').tags([
    { name: 'app-name', values: [APP_NAME] },
    { name: 'app-version', values: [APP_VERSION] },
    { name: 'app-feature', values: [APP_FEATURES.FEED] },
  ]);
  return transactions.map((tx) => ({
    id: tx.id,
    owner: tx.owner.address,
    txTimestamp: tx.block?.timestamp || null,
  }));
};

const getPolls = async () => {
  const transactions = await getPollFeedTxs();

  const promises: Promise<PollItem>[] = [];
  for (const tx of transactions) {
    promises.push(
      fetch(`https://arweave.net/${tx.id}`)
        .then((res) => res.json())
        .then((data) => ({ ...data, ...tx } as PollItem)),
    );
  }

  return Promise.all(promises);
};

export const usePollFeed = () => {
  return useQuery({
    queryKey: queryKeys.getPosts(),
    queryFn: () => getPolls(),
    select: (data) => {
      return data.sort((a, b) => b.timestamp - a.timestamp);
    },
    refetchInterval: 5000,
  });
};
