import React, { useState, useEffect } from 'react';
import '../App.scss';
import { message, Input, Select, Space, Divider, Avatar, Badge, Typography, Card, Table, Spin, Flex, Button } from 'antd';

const { Title, Text } = Typography;

export default function Setting(props) {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const newSettings = JSON.parse(localStorage.getItem('settings'));
        setSettings(newSettings);
    }, []);

    /*useEffect(() => {
        console.log(settings);
    }, [settings]);*/

    //儲存
    const saveSetting = () => {
        localStorage.setItem('settings', JSON.stringify(settings));
        message.success('儲存成功');
    }

    //變更
    const handleChangeSetting = (e, key) => {
        setSettings(prev => {
            return { ...prev, [key]: e.target.value };
        });
    };
    return (
        <Card className='myCard'>
            <Title level={5} className='title'>編輯權限</Title>
            <Text type="secondary" italic>如欲成為編輯者請去DC找eddy3721要郵箱跟密碼</Text>
            <Flex gap='middle' wrap='wrap'>
                <Input onChange={(e) => handleChangeSetting(e, 'email')} style={{ maxWidth: '300px' }} addonBefore="郵箱:" value={settings?.email} />
                <Input onChange={(e) => handleChangeSetting(e, 'password')} style={{ maxWidth: '300px' }} addonBefore="密碼:" value={settings?.password} />
                <Button type='primary' onClick={() => saveSetting()}>儲存</Button>
            </Flex>
            <Divider dashed />
            <Title level={5} className='title'>主題</Title>
        </Card>
    )
}