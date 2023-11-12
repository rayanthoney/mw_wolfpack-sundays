// Importing React for component creation
import React from "react";

// ChatRoomList component to display a list of available chat rooms, imports room list and joinRoom function
const ChatRoomList = ({ rooms, joinRoom }) => {
    return (
        <div>
            <h2>
                Chat Rooms
            </h2>

            <ul>
                {rooms.map((room,index) => (
                    <li key={index}>
                        <button onClick={() => joinRoom(room)}>Join {room}</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ChatRoomList;