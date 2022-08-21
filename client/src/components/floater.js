import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AppFloater = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const content = (
        <div>
            <p>this is going to be some good stuff - <Link to='/photos/'>Maya Hawke Photos</Link> </p>
        </div>
    );

    return (
        <div>
            <div className='floater'>
                <Button onClick={showModal}><FaInfoCircle /></Button>
            </div>

            <Modal title="Quck Help" visible={isModalVisible} okText='Cancel'
                cancelText='OK'
                okButtonProps={{
                    type: 'default'
                }}
                cancelButtonProps={{
                    type: 'primary'
                }}
                onOk={handleOk}
                onCancel={handleCancel}>
                {content}
            </Modal>
        </div>
    );
};

export default AppFloater;
