import React, { useState } from 'react';
import './css/Message.css';

interface MessageProps {
    message: string,
    type: string
}

const Message: React.FC<MessageProps> = ({message, type}) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className={`message-container ${type === 'error' ? 'error' : 'success'}`}>
            <span className='icon' onClick={()=> setVisible(!visible)}>X</span>
            <div className='message'>{message}</div>
        </div>
    );
};

export default Message;