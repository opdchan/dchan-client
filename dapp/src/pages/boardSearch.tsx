import Footer from "components/Footer";
import BoardList from "components/board/list";
import GenericHeader from "components/header/generic";
import useWeb3 from "hooks/useWeb3";
import Card from "components/Card";
import BOARDS_SEARCH from "dchan/graphql/queries/boards/search";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

export default function BoardListPage({
  match: {
    params: { boardName: name },
  },
}: any) {
  const { loading, data } = useQuery(BOARDS_SEARCH, { variables: { name } });

  return (
    <div>
      <GenericHeader title="Boards"></GenericHeader>

      <Link
        className="text-blue-600 visited:text-purple-600 hover:text-blue-500 py-1 px-4"
        to="/boards"
      >
        All boards
      </Link>
      <div className="center flex">
        <Card
          title={<span>{`/${name}/`}</span>}
          body={<BoardList boards={data?.boards}></BoardList>}
        />
      </div>

      <Footer></Footer>
    </div>
  );
}
