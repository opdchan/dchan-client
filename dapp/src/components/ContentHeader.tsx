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
import { Link } from "react-router-dom";
import FavoritesWidget from "./FavoritesWidget";

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

      <FormPost baseUrl={baseUrl} thread={thread} board={board}></FormPost>

      <div className="p-2">
        <hr></hr>
      </div>

      <div className="fixed z-20 top-0 right-4 opacity-50 hover:opacity-100 flex flex-wrap text-right">
        <details open={true}>
          <summary></summary>
          <div className="bg-primary">
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
            <FavoritesWidget />
          </div>
        </details>
      </div>

      <div className="text-center sm:text-left grid md:grid-cols-3">
        <div className="mx-2 flex flex-wrap sm:flex-nowrap justify-center md:justify-start items-center">
          <span className="whitespace-nowrap sm:flex">
            {!!board ? (
              <span>
                <span>
                  [
                  <Link
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                    to={`${Router.board(board)}/index`}
                  >
                    Index
                  </Link>
                  ]
                </span>
                <span>
                  [
                  <Link
                    className="text-blue-600 visited:text-purple-600 hover:text-blue-500"
                    to={`${Router.board(board)}/catalog`}
                  >
                    Catalog
                  </Link>
                  ]
                </span>
              </span>
            ) : (
              ""
            )}
            <Anchor to="#bottom" label="Bottom" />
          </span>

          {!block || (lastBlock && `${lastBlock.number}` === `${block}`) ? (
            <RefreshWidget onRefresh={throttledRefresh} />
          ) : (
            ""
          )}
        </div>
        <div className="center grid">
          <details>
            <summary className="py-2 text-xs text-gray-600">{summary}</summary>
            <div>
              <FilterSettings />
            </div>
          </details>
        </div>
        <div className="flex justify-end">{!thread ? <BoardViewSettings /> : ""}</div>
      </div>

      <div className="p-2">
        <hr></hr>
      </div>
    </div>
  );
}
