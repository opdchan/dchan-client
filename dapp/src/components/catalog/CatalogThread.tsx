import { Thread } from "dchan";
import IPFSImage from "components/IPFSImage";
import PostBody from "components/post/PostBody";
import LowScoreDisclaimer from "components/LowScoreDisclaimer";
import { isLowScore as isLowScoreThread } from "dchan/entities/thread";
import useSettings from "hooks/useSettings";
import { Link } from "react-router-dom";
import { Router } from "router";
import { DateTime } from "luxon";

const CatalogThread = ({
  thread,
  isFocused,
  onFocus,
}: {
  thread: Thread;
  isFocused: boolean;
  onFocus: (id: string) => void;
}) => {
  const {
    id,
    n,
    isPinned,
    isLocked,
    subject,
    op: { comment, image },
    replyCount,
    imageCount,
    replies,
  } = thread;

  const { ipfsHash, isNsfw, isSpoiler } = image || {
    ipfsHash: "",
    isNsfw: false,
    isSpoiler: false,
  };

  const imgClassName =
    "w-full pointer-events-none shadow-xl object-contain max-h-320px";
  const [settings] = useSettings();
  const isLowScore = isLowScoreThread(
    thread,
    settings?.content?.score_threshold
  );

  return (
    <article
      id={id}
      className="dchan-post justify-self-center relative text-decoration-none leading-4 text-black m-0.5 border-black overflow-hidden min-h-12rem max-h-320px max-w-150px break-word w-full h-full place-items-center flex"
      style={
        isFocused
          ? {
              maxHeight: "initial",
              maxWidth: "initial",
              zIndex: 900,
              marginLeft: "-2rem",
              marginRight: "-2rem",
              width: "14rem"
            }
          : {}
      }
    >
      {isLowScore && !isFocused ? (
        <LowScoreDisclaimer onClick={() => onFocus(n)}></LowScoreDisclaimer>
      ) : (
        ""
      )}
      <button className="h-full w-full" onClick={() => onFocus(n)}>
        <div
          className={[
            "relative",
            isFocused ? "bg-tertiary border border-black" : "",
            !isFocused && isLowScore ? "dchan-censor" : "",
          ].join(" ")}
        >
          <div className="absolute top-0 right-0 z-10">
            {isPinned ? (
              <span title="Thread pinned. This might be important.">📌</span>
            ) : (
              ""
            )}
            {isLocked ? (
              <span title="Thread locked. You cannot post.">🔒</span>
            ) : (
              ""
            )}
          </div>
          {ipfsHash && (!isLowScore || isFocused) ? (
            <div>
              <IPFSImage
                className={imgClassName}
                hash={ipfsHash}
                expandable={false}
                thumbnail={false}
                isSpoiler={isSpoiler}
                isNsfw={isNsfw}
              />
            </div>
          ) : (
            ""
          )}
          <div className="p-1">
            <div>
              R:<strong>{replyCount}</strong>, I:<strong>{imageCount}</strong>
            </div>
            <div className="word-wrap">
              <div>
                <strong>{subject}</strong>
              </div>
              <PostBody
                style={{
                  minWidth: isFocused ? "12rem" : "initial",
                  textAlign: "center",
                }}
              >
                {comment}
              </PostBody>
              {isFocused &&
                replies &&
                [...replies].reverse().map((post) => (
                  <div className="mt-1 p-1 border-0 border-t border-black border-solid text-xs text-left" key={post.id}>
                    <div>{DateTime.fromSeconds(parseInt(post.createdAtBlock.timestamp)).toRelative()}</div>
                    <Link className="text-blue-600 visited:text-purple-600 hover:text-blue-500" to={Router.post(post) || ""}><PostBody>{post.comment}</PostBody></Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </button>
    </article>
  );
};

export default CatalogThread;
