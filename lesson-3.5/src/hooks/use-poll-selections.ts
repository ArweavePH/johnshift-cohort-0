import Query from '@irys/query/node';
import { useQuery } from '@tanstack/react-query';

import { APP_FEATURES, APP_NAME, APP_VERSION } from '@/core/constants';
import { queryKeys } from '@/core/query-keys';
import { PollSelection } from '@/core/types';

const getPollSelectionsTxs = async (pollId: string) => {
  const query = new Query({ network: 'arweave' });
  const transactions = await query.search('arweave:transactions').tags([
    { name: 'app-name', values: [APP_NAME] },
    { name: 'app-version', values: [APP_VERSION] },
    { name: 'app-feature', values: [APP_FEATURES.POLL_SELECTION] },
    { name: 'poll-id', values: [pollId] },
  ]);
  return transactions.map((tx) => ({
    id: tx.id,
    owner: tx.owner.address,
    txTimestamp: tx.block?.timestamp || null,
  }));
};

export const getPollSelections = async (pollId: string) => {
  const transactions = await getPollSelectionsTxs(pollId);

  const promises: Promise<PollSelection>[] = [];
  for (const tx of transactions) {
    promises.push(
      fetch(`https://arweave.net/${tx.id}`)
        .then((res) => res.json())
        .then((data) => ({ ...data, ...tx } as PollSelection)),
    );
  }

  return Promise.all(promises);
};

export const usePollSelections = (pollId: string) => {
  return useQuery({
    queryKey: queryKeys.getPollSelections(pollId),
    queryFn: () => getPollSelections(pollId),
    select: (data) => {
      const seenIds = new Set<string>();
      const selectionCount: Record<string, number> = {};
      for (const pollSelection of data) {
        const { owner, selection } = pollSelection;
        if (!seenIds.has(owner)) {
          seenIds.add(owner);
          if (selectionCount[selection]) {
            selectionCount[selection]++;
          } else {
            selectionCount[selection] = 1;
          }
        }
      }
      const totalCount =
        data.length > 0
          ? Object.values(selectionCount).reduce((sum, value) => sum + value, 0)
          : 0;

      return {
        selections: data.sort((a, b) => b.timestamp - a.timestamp),
        selectionCount,
        totalCount,
      };
    },
  });
};
