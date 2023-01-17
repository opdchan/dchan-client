import { useQuery } from "@apollo/react-hooks";
import { Client } from "services/dchan/types";
import { fromBigInt } from "services/datetime";
import { IPFS_CLIENT } from "graphql/queries";
import { DateTime } from "luxon";

type Channel = Client[];

interface IPFSClientData {
  stable: Channel;
  dev: Channel;
}

interface IPFSClientVars {
  id: string;
}

export default function IPFSClientWidget() {
  const { data } = useQuery<IPFSClientData, IPFSClientVars>(IPFS_CLIENT, {});

  const stable = data?.stable?.[0];
  const dev = data?.dev?.[0];

  return (
    <details className="inline">
      <summary>IPFS clients</summary>
      {stable ? (
        <div>
          <span>{`Latest stable version, published @ ${fromBigInt(
            stable.publishedAtBlock.timestamp
          ).toLocaleString(DateTime.DATETIME_SHORT)}`}</span>
          <a
            className="dchan-link border border-black px-2 mx-1 bg-white"
            href={`//ipfs.io/ipfs/${stable.ipfsHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {stable.version}
          </a>
          <hr/>
        </div>
      ) : (
        <span />
      )}
      {dev ? (
        <div>
          <span>{`Latest dev version, published @ ${fromBigInt(
            dev.publishedAtBlock.timestamp
          ).toLocaleString(DateTime.DATETIME_SHORT)}`}</span>
          <a
            className="dchan-link border border-black px-2 mx-1 bg-white"
            href={`//ipfs.io/ipfs/${dev.ipfsHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {dev.version}
          </a>
          <hr/>
        </div>
      ) : (
        <span />
      )}
    </details>
  );
}
