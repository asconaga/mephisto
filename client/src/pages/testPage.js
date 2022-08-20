import { AutoComplete, Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import JSONParser from '../components/jsonparser';

const AppPayload = ({ payloadDisabled }) => {

    return (
        <div className='contentor'>
            <Form.Item name="payload" label="Payload">
                <TextArea disabled={payloadDisabled} rows={16} />
            </Form.Item>
        </div>
    );
};

AppPayload.propTypes = {
    payloadDisabled: PropTypes.bool
};

const TestPage = () => {

    let todos =
        { "admin": { "user": [{ "email": "asconaga@gmail.com", "key": "dff7ef8d-f7cb-447e-a4c8-45e549345321" }, { "email": "kennywoof@gmail.com", "key": "0ce92734-0068-466b-abf9-42999a241082" }, { "email": "jack@gmail.com", "key": "c29bdb39-8194-44a2-ab60-baa8a837bd84" }] } };

    todos = {
        "incident": {
            "id": 21012,
            "name": "Thailand Test 1",
            "modelId": 1,
            "notes": "MRCC received information",
            "userName": "Ian Smith",
            "times": {
                "driftStart": 1550466000,
                "datum": 1550487600
            },
            "position": {
                "lat": 12.65,
                "lon": 100.8
            },
            "targets": {
                "target": [{
                    "id": 45871325,
                    "name": "Alpha Bravo",
                    "type": 7
                },
                {
                    "id": 45871325,
                    "name": "Alpha Bravo",
                    "type": 7
                }

                ]
            }
        }
    };



    // todos =
    //     { "services": { "service": [{ "name": "custard", "description": "Information on the services available along with their associated methods and associated posts are available below" }, { "name": "sarIncident" }, { "name": "jill" }, { "name": "jack" }] } };

    const [form] = Form.useForm();
    const [payloadDisabled, setPayloadDisabled] = useState(true);
    const [resultsData, setResultsData] = useState(todos);

    const methodOptions = [
        { value: 'api/services', },
        { value: 'api/services?complete=true' },
        { value: 'api/services/sarIncident' },
        { value: 'api/services/sarIncident/config' },
        { value: 'api/services/jack' },
        { value: 'api/services/jack/off' },
        { value: 'api/services/jack/off/register' },
        { value: 'api/admin/register' },
        { value: 'api/admin/reset' },
        { value: 'api/admin/message?key=vans' }
    ];

    const onFinish = async (values) => {
        console.log('Success:', values);

        let retVal = {
            result: 'pigglet',
            status: 400
        };

        let request = {
            method: values.method,
            mode: 'cors',
            headers: { "Content-type": "application/json" }
        };

        if (values.method !== 'GET') {
            request['body'] = values.payload;
        }

        try {
            const response = await fetch(values.uri, request);

            retVal.status = response.status;

            if (retVal.status !== 404) {
                const resObj = await response.json();

                retVal.result = resObj;
            }
            else {
                retVal.result = { message: `Cannot ${values.method} on ${values.uri}` };
            }
        } catch (err) {
            retVal.result = err.message;
        } finally {
            // retVal.result = "we in a finally dude";
        }

        setResultsData(retVal.result);

        form.setFieldsValue(retVal);
    };

    const onFill = () => {
        form.setFieldsValue({
            uri: 'api/services',
            method: 'GET'
        });
    };

    const onMethodChange = () => {
        const methodVal = form.getFieldValue('method');

        setPayloadDisabled(methodVal === 'GET');
    };

    useEffect(() => {
        onFill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="testblock block">
            <div className="titleHolder">
                <h2>Test Page</h2>
                <p style={{ marginTop: "1rem" }}>Test the backend features of the API with this web thog client</p>
                <div>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: false,
                        }}
                        autoComplete="off"
                    >
                        <div className='mainTest'>
                            <div className='contentor'>
                                <Form.Item label="URI" name="uri">
                                    <AutoComplete options={methodOptions} />
                                </Form.Item>

                                <Form.Item name="method" label="Select">
                                    <Select onChange={onMethodChange} style={{ width: '50%' }} value="GET">
                                        <Select.Option key={0} value="GET">Get</Select.Option>
                                        <Select.Option key={1} value="POST">Post</Select.Option>
                                        <Select.Option key={2} value="DELETE">Delete</Select.Option>
                                        <Select.Option key={3} value="PUT">Put</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        Fetch
                                    </Button>
                                </Form.Item>
                            </div>
                            <AppPayload payloadDisabled={payloadDisabled} />

                            <div className='contentor'>
                                <Form.Item
                                    label="Status"
                                    name="status">
                                    <Input />
                                </Form.Item>

                                <Form.Item name="result" label="Result">
                                    <JSONParser json={resultsData} />
                                </Form.Item>
                            </div>
                        </div>
                    </Form>

                </div>
            </div>
        </div >
    );
};

export default TestPage;
