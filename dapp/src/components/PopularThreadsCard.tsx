import { useQuery } from "@apollo/react-hooks";
import { Board, Thread } from "dchan/subgraph/types";
import { THREADS_LIST_MOST_POPULAR, THREADS_LIST_MOST_POPULAR_BLOCK } from "dchan/subgraph/graphql/queries";
import { IndexView, Loading } from ".";
import { useTraveledBlock } from "./TimeTravelWidget";
import { DateTime } from "luxon";
import { useMemo } from "react";

export const PopularThreadsCard = ({block, board} : {block?: number, board?: Board}) => {
  const currentBlock = useTraveledBlock();
  const cutoff = useMemo(
    () => Math.floor(
      (currentBlock ? parseInt(currentBlock.timestamp) : DateTime.now().toSeconds()) - 604800
    ),
    [currentBlock]
  );

  const query = block ? THREADS_LIST_MOST_POPULAR_BLOCK : THREADS_LIST_MOST_POPULAR;
  const { loading, data } = useQuery<{ threads: Thread[] }, any>(query, {
    pollInterval: 30_000,
    fetchPolicy: block ? "cache-first" : "network-only",
    variables: {
      cutoff,
      block: currentBlock ? parseInt(currentBlock.number) : block,
      board: board?.id || ""
    },
  });

  return loading
    ? <Loading />
    : data?.threads.length ? <IndexView threads={data.threads} showBoard={true} block={block} /> : <span>No active threads.</span>;
}
