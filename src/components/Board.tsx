import {Droppable} from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ITodo, toDoState } from '../atoms';
import DraggableCard from './DraggableCard';

interface IBoard{
    toDos:ITodo[];
    boardId:string;
}

const Wrapper=styled.div`
padding-top:10px;
background-color:${(props)=>props.theme.boardColor};
border-radius:5px;
min-height:300px;
display:flex;
flex-direction:column;
overflow:hidden;
`;

interface IAreaProps{
    isDraggingFromThis: boolean;
    isDraggingOver: boolean; 
}

const Area=styled.div<IAreaProps>`
background-color:${(props)=>
    props.isDraggingOver ? "#F8D7D6" : props.isDraggingFromThis ? "#85B8C5" : "#194063" 
};
flex-grow:1;
transition:background-color 0.3s ease-in-out;
padding:20px;
`;

const Form=styled.div`
width:100%;
display:flex;
justify-content:center;
padding-bottom:10px;
input{
    width:100%;
    font-size:16px;
    border:0;
    background-color:white;
    width:80%;
    padding:10px;
    border-radius:5px;
    text-align:center;
    maring:0 auto;
}
`;

interface IForm{
    toDo:string;
}

function Board({toDos,boardId}:IBoard){
    const setToDos=useSetRecoilState(toDoState);
    const{register, setValue, handleSubmit}=useForm<IForm>();
    const onValid=({toDo}:IForm)=>{
        const newToDo={
            id:Date.now(),
            text:toDo,
        }
        setToDos((allBoards)=>{
            return{
                ...allBoards,
                [boardId]:[
                    ...allBoards[boardId],
                    newToDo,
                ]
            }
        });
        setValue("toDo","");
    };
    return(
        <Wrapper>
            <Form onSubmit={handleSubmit(onValid)}>
                <input {...register("toDo",{required:true})} type="text" placeholder={`Add task on ${boardId}`}/>
            </Form>
            <Droppable droppableId={boardId}>
                {(provided, info)=>(
                    <Area isDraggingOver={info.isDraggingOver} isDraggingFromThis={Boolean(info.draggingFromThisWith)} ref={provided.innerRef} {...provided.droppableProps}>
                        {toDos.map((toDo,index)=>(
                            <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text}/>
                        ))}
                        {provided.placeholder}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    )
}

export default Board;