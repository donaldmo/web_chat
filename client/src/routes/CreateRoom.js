import React from "react";
import { v4 as uuidv4 } from 'uuid';

const CreateRoom = (props) => {
    function create() {
        const id = uuidv4();
        props.history.push(`/room/${id}`);
    }

    return (
        <button onClick={create}>Create Room</button>
    );
}

export default CreateRoom;