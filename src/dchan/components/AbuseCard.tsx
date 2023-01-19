import { Card, Overlay } from "dchan/components";
import { useState } from "react";
import { singletonHook } from "react-singleton-hook";

export function AbuseCard() {
  return (
    <Card title={<div className="">Abuse (DMCA/CSAM)</div>} collapsible={false}>
      <div className="text-left p-4">
        This is a decentralized application: the content shown here is not
        hosted on this website's servers, but is instead retrieved via{" "}
        <a
          className="dchan-link"
          href="https://ipfs.io/"
          target="_blank"
          rel="noreferrer"
        >
          IPFS
        </a>
        .
        <br />
        Please refer to the IPFS Gateway Service's{" "}
        <a
          className="dchan-link"
          href="https://ipfs.io/legal/"
          target="_blank"
          rel="noreferrer"
        >
          legal page
        </a>{" "}
        to report any offending content.
      </div>
    </Card>
  );
}

export const useAbuse = singletonHook<[boolean, (open: boolean) => void]>(
  [false, () => {}],
  () => {
    return useState<boolean>(false);
  }
);

export function AbuseCardOverlay() {
  const [openAbuse, setOpenAbuse] = useAbuse();
  return openAbuse ? (
    <Overlay onExit={() => setOpenAbuse(false)}>
      <AbuseCard />
    </Overlay>
  ) : null;
}

export const AbuseButton = ({ className = "" }: { className?: string }) => {
  const [, setOpenAbuse] = useAbuse();
  return (
    <>
      <span
        className={`${className} cursor-pointer dchan-link`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenAbuse(true);
        }}
      >
        Abuse (DMCA/CSAM)
      </span>
    </>
  );
};
