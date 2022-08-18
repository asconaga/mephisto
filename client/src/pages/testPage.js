import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';

const TestPage = () => {

    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFill = () => {
        form.setFieldsValue({
            uri: 'api/services',
            method: 'get'
        });
    };

    onFill();

    return (
        <main className="TestPage">
            <div className="block">
                <div className="titleHolder">
                    <h2>Test</h2>
                    <p style={{ marginTop: "1rem" }}>Test the backend features of the API with this web thog client</p>
                    <div>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
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
                                        remember: true,
                                    }}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="URI"
                                        name="uri"
                                    >
                                        <Input defaultValue="/api/services" />
                                    </Form.Item>

                                    <Form.Item name="method" label="Select">
                                        <Select style={{ width: '20%' }} value="get">
                                            <Select.Option value="get">Get</Select.Option>
                                            <Select.Option value="post">Post</Select.Option>
                                            <Select.Option value="delete">Delete</Select.Option>
                                            <Select.Option value="put">Put</Select.Option>
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
                                </Form>
                            </Col>
                            <Col span={8}>
                                <Form>
                                    <Form.Item label="Payload">
                                        <TextArea rows={8} />
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col span={8}>
                                <Form>
                                    <Form.Item label="Result">
                                        <TextArea rows={8} />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </main >
    );
};

export default TestPage;
