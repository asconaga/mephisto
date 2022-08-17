import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const MissingPage = () => {
    return (
        <main className='Missing'>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, something went horribly wrong..."
                extra={
                    <Button type="primary" key="console">
                        <Link to='/'>Visit Our Homepage</Link>
                    </Button>
                } />
        </main>
    );
};

export default MissingPage;


