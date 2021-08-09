import Footer from 'components/Footer'
import BoardList from 'components/board/list'
import GenericHeader from 'components/header/generic'
import useWeb3 from 'hooks/useWeb3';

export default function BoardListPage() {
    const useWeb3Result = useWeb3()

    return (<div>
        <GenericHeader title="Boards"></GenericHeader>

        <BoardList create={true} useWeb3={useWeb3Result}></BoardList>

        <Footer></Footer>
    </div>)
}