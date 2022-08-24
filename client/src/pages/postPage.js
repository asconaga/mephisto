import { message } from 'antd';
import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const PostPage = () => {
    const { id } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const [fetchItems, setFetchItems] = useState(null);

    const params = [];

    params.push(searchParams.get('service'));
    params.push(searchParams.get('method'));

    const info = (msg, status) => {
        if (status)
            message.success(msg);
        else
            message.error(msg);
    };

    useEffect(() => {
        async function reqCallback(response) {
            if (response.ok) {
                const resObj = await response.json();

                console.log(resObj);

                setFetchItems(resObj);

                const nServices = resObj.length;

                const szServiceMsm = "Service" + ((nServices !== 1) ? "s" : "");

                info(`${resObj.post.name} & ${resObj.post.date} successfully fetched`, true);
            }
            else {
                info("Cannot communicate with server", false);
            }
        }

        let request = {
            method: 'GET',
            mode: 'cors',
            headers: { "Content-type": "application/json" }
        };

        const doFetchItems = async () => {
            const serviceName = searchParams.get('service');
            const methodName = searchParams.get('method');

            const queryString = `/api/services/${serviceName}/${methodName}/${id}`;

            await fetch(queryString, request)
                .then(reqCallback)
                .catch(function (error) {
                    console.log('Request failed', error);
                });
        };

        (async () => await doFetchItems())();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
            <p>details for post [{id}]</p>
            {params.map((params) => (
                <p key={params}>{params}</p>
            ))}
        </div>
    );
};


// PostPage.propTypes = {
//     id: PropTypes.any.isRequired,
// };

export default PostPage;
