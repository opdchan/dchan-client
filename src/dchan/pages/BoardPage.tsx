import { useLastBlock, useSettings } from "dchan/hooks";
import { parse as parseQueryString } from "query-string";
import { Board, BoardRef, Thread } from "dchan/subgraph/types";
import { useEffect, useMemo } from "react";
import { Router } from "router";
import { BOARD_GET, BOARD_CATALOG } from "dchan/subgraph/graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { isLowScore } from "dchan/subgraph/entities/thread";
import {
  Footer,
  ContentHeader,
  Loading,
  Anchor,
  CatalogView,
  IndexView,
  Paging
} from "dchan/components";
import { useHistory } from "react-router-dom";
import { useTitle } from "react-use";
import useTimeTravel from "dchan/hooks/useTimeTravel";

interface BoardCatalogData {
  board: Board;
  pinned: Thread[];
  threads: Thread[];
}
interface BoardCatalogVars {
  board: string;
  block: number;
  limit: number;
  skip: number;
}

interface BoardData {
  board: Board;
  boardRef: BoardRef;
}
interface BoardVars {
  board: string;
  block: number;
}

export const BoardPage = ({
  location,
  match: { params },
  pageTheme,
  setPageTheme
}: {
  location: any,
  match: {params: any},
  pageTheme: string,
  setPageTheme: (theme: string) => void,
}) => {
  let { board_id, board_name } = params;
  board_id = board_id ? `0x${board_id}` : undefined;

  const { timeTraveledToBlockNumber } = useTimeTravel()
  const query = parseQueryString(location.search);
  const page = parseInt(`${query.page || "1"}`);

  const history = useHistory();
  const [settings] = useSettings();
  const {lastBlock} = useLastBlock();
  const block = Number(timeTraveledToBlockNumber || lastBlock?.number || 0)
  const boardMode: string =
    params.view_mode ||
    settings?.content_view?.board_default_view_mode ||
    "catalog";
  const orderBy =
    settings?.content_view?.board_sort_threads_by || "lastBumpedAt";
  const limit = parseInt(`${settings?.content_view?.page_size || "100"}`);

  const variables = {
    board: board_id,
    block,
    orderBy,
    orderDirection: settings?.content_view?.board_sort_direction || "desc",
    limit,
    skip: limit * (page - 1),
  };

  const {
    refetch,
    data: catalogData,
    loading: catalogLoading,
  } = useQuery<BoardCatalogData, BoardCatalogVars>(BOARD_CATALOG, {
    variables,
  });

  const { loading: boardLoading, data: boardData } = useQuery<
    BoardData,
    BoardVars
  >(BOARD_GET, {
    skip: !block,
    variables: {
      board: board_id,
      block,
    },
  });

  const board: Board | undefined | null = boardData?.board;
  const threads = useMemo(
    () => [...(catalogData?.pinned || []), ...(catalogData?.threads || [])],
    [catalogData]
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [board?.id]);

  useEffect(() => {
    if(board && board.name !== board_name) {
      history.replace(`/${board.id}`);
    }
  }, [board, board_name, history]);

  useEffect(() => {
    refetch();
  }, [block, orderBy, refetch]);

  const filteredThreads = (threads || []).filter((thread: Thread) => {
    return (
      settings?.content_filter?.show_below_threshold ||
      !isLowScore(thread, settings?.content_filter?.score_threshold)
    );
  });

  // @TODO usePagination?
  const maxPage = useMemo(() => {
    const threadCount = parseInt(`${board?.threadCount || 0}`);
    return Math.max(Math.ceil(board ? threadCount / limit : 0), 1);
  }, [board, limit]);

  useTitle(
    !boardLoading
      ? board
        ? `/${board.name}/ - dchan.network - [${board.id}]`
        : `??? - dchan.network - [${board_id}]`
      : `Loading... - dchan.network - [${board_id}]`
  );

  useEffect(() => {
    if (!board) {
      // persist theme until we know for sure it's different for this board
      // this is to prevent the theme changing back to default for every
      // loading screen, e.g. during time travels or when switching between
      // boards
      return;
    }
    setPageTheme(board?.isNsfw ? "nsfw" : "blueboard");
  }, [board, setPageTheme]);

  return (
    <div
      className="bg-primary min-h-100vh flex flex-col"
      data-theme={pageTheme}
    >
      <div>
        <ContentHeader
          board={board}
          baseUrl={
            board
              ? Router.board(board, boardMode)
              : location.pathname + location.hash
          }
          summary={
            catalogLoading ? (
              <span>...</span>
            ) : (
              <span>
                Threads: {threads.length} (Hidden:{" "}
                {threads.length - filteredThreads.length}
                ), Posts: {board?.postCount}
              </span>
            )
          }
          onRefresh={refetch}
        />
        <div>
          {board === null ? (
            <div className="center grid p-8">
              Board does not exist.
              {!isNaN(block) ? (
                <>
                  <br />
                  You may have time traveled to before it was created, or after
                  it was deleted.
                </>
              ) : (
                ""
              )}
            </div>
          ) : catalogLoading && !catalogData ? (
            <div className="center grid">
              <Loading />
            </div>
          ) : board && threads ? (
            threads.length === 0 ? (
              <div className="center grid p-8">No threads.</div>
            ) : (
              <div>
                {
                  {
                    catalog: (
                      <CatalogView
                        board={board}
                        threads={filteredThreads}
                      />
                    ),
                    index: (
                      <IndexView
                        board={board}
                        threads={filteredThreads}
                      />
                    ),
                  }[boardMode]
                }
              </div>
            )
          ) : (
            <div />
          )}

          {board ? (
            <div>
              <hr />
              <Paging url={location.pathname} page={page} maxPage={maxPage} />

              <Anchor to="#board-header" label="Top" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <Footer showContentDisclaimer={true}></Footer>
    </div>
  );
}
