import {Draggable} from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";

const Card=styled.div<{isDragging:boolean}>`
border-radius:5px;
margin-bottom:5px;
padding:10px;
background-color:${(props)=>
    props.isDragging ? "#e4f2ff" : props.theme.cardColor};
box-shadow:${(props)=>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)":"none"
};
`;

interface IDragabbleCradProps{
    toDoId:number;
    toDoText:string;
    index:number;
}

function DraggableCard({toDoId, toDoText, index}:IDragabbleCradProps){
    return(
        <Draggable draggableId={toDoId+""} index={index}>
            {(provided, info)=>(
                <Card isDragging={info.isDragging} ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>{toDoText}</Card>
            )}
        </Draggable>
    )
}

export default React.memo(DraggableCard);
