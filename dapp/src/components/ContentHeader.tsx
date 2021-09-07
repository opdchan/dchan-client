import { useThrottleCallback } from "@react-hook/throttle";
import { Block, Board, Thread } from "dchan";
import useLastBlock from "hooks/useLastBlock";
import { DateTime } from "luxon";
import { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Router } from "router";
import Anchor from "./Anchor";
import BoardHeader from "./board/header";
import FormPost from "./form/FormPost";
import { RefreshWidget } from "./RefreshWidget";
import SearchWidget from "./SearchWidget";
import TimeTravelWidget from "./TimeTravelWidget";
import BoardViewSettings from "./settings/BoardViewSettings";
import FilterSettings from "./settings/FilterSettings";

export default function ContentHeader({
  board,
  thread,
  search,
  baseUrl,
  block,
  dateTime,
  summary,
  onRefresh,
}: {
  board?: Board;
  thread?: Thread;
  search?: string;
  baseUrl?: string;
  summary: ReactElement;
  block?: number;
  dateTime?: DateTime;
  onRefresh: () => void;
}) {
  const { lastBlock } = useLastBlock();
  const throttledRefresh = useThrottleCallback(onRefresh, 1, true);
  const [startBlock, setStartBlock] = useState<Block | undefined>();
  useEffect(() => {
    setStartBlock(
      thread ? thread.createdAtBlock : board ? board.createdAtBlock : undefined
    );
  }, [thread, board, setStartBlock]);

  return (
    <div>
      <BoardHeader board={board}></BoardHeader>

      <FormPost thread={thread} board={board}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="fixed z-20 top-4 right-4 opacity-50 hover:opacity-100 flex flex-wrap">
        <TimeTravelWidget
          baseUrl={baseUrl || ""}
          startBlock={startBlock}
          dateTime={dateTime}
          block={block}
          startRangeLabel={
            thread ? "Thread creation" : board ? "Board creation" : "?"
          }
        />
        <SearchWidget baseUrl={Router.posts()} search={search} />
      </div>

      <div className="text-center sm:text-left grid sm:grid-cols-3">
        <div className="mx-2 flex justify-center sm:justify-start">
          <Anchor to="#bottom" label="Bottom" />

          {!block || (lastBlock && `${lastBlock.number}` === `${block}`) ? (
            <RefreshWidget onRefresh={throttledRefresh} />
          ) : (
            ""
          )}
        </div>
        <div className="flex-grow center grid">
          <details className="">
            <summary className="text-xs text-gray-600">{summary}</summary>
            <div>
              {!thread ? <BoardViewSettings /> : ""}
              <FilterSettings />
            </div>
          </details>
        </div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>
    </div>
  );
}
