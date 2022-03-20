import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState} from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from './components/Board';

const Wrapper=styled.div`
display:flex;
max-width:680px;
width:100%;
margin:0 auto;
justify-content:center;
align-items:center;
height:100vh;
`

const Boards=styled.div`
display:grid;
width:100%;
gap:11px;
grid-template-columns:repeat(3,1fr);
`;

function App(){
    const [toDos, setTodo]=useRecoilState(toDoState);
    const onDragEnd=(info:DropResult)=>{
        const {destination, source}=info;
        if(!destination) return ;
        if(destination?.droppableId===source.droppableId){
            // same board movement.
            setTodo((allBoards)=>{
                const newToDo=[...allBoards[source.droppableId]];
                const taskObj=newToDo[source.index];
                // 1) delete item on source.index
                // 2) input destination to draggableId
                newToDo.splice(source.index,1);
                newToDo.splice(destination?.index,0,taskObj);
                return {
                    ...allBoards,
                    [source.droppableId]:newToDo,
                };
            });
        }
        if(destination.droppableId!==source.droppableId){
            // cross board movement
            setTodo((allBoards)=>{
                const sourceBoard=[...allBoards[source.droppableId]];
                const targetBoard=[...allBoards[destination.droppableId]];
                const taskObj=sourceBoard[source.index];
                sourceBoard.splice(source.index,1);
                targetBoard.splice(destination?.index, 0, taskObj);
                return{
                    ...allBoards,
                    [source.droppableId]:sourceBoard,
                    [destination.droppableId]:targetBoard,
                }
            })
        }
    };
    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <Wrapper>
                <Boards>
                    {Object.keys(toDos).map((boardId)=>(
                        <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
                    ))}
                </Boards>
            </Wrapper>
        </DragDropContext>
    );
}

export default App;