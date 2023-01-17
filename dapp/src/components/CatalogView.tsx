import { Board, Thread } from "dchan/subgraph/types";
import { CatalogThread } from ".";

export const CatalogView = ({
  threads,
  board,
  block,
  showBoard = false
}: {
  threads: Thread[];
  board?: Board,
  block?: number,
  showBoard?: boolean
}) => {
  return (
    <div className="flex flex-row flex-wrap justify-center place-items-start font-size-090rem px-2 sm:px-4 flex-grow">
      {threads.filter(t => !!t && !!t.board).map(thread => (
        <CatalogThread
          board={board}
          thread={thread}
          key={thread.id}
          block={block}
          showBoard={showBoard}
        />
      ))}
    </div>
  );
}
