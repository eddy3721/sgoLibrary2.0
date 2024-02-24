import React, { useState, useEffect } from 'react';
import '../App.scss';
import { Row, Col, Tabs, message, Input, Select, Space, Divider, Avatar, Badge, Typography, Card, Table, Spin, Flex, Button } from 'antd';
import { getZone, zones } from '../main.js';
import { TbMoneybag } from "react-icons/tb";
import { GiHunterEyes } from "react-icons/gi";
import { AiOutlineDown } from "react-icons/ai";
import supabase from '../supabase.js';
import { type } from '@testing-library/user-event/dist/type/index.js';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Edit(props) {
    const { Data } = props;
    const tabs = [
        {
            key: '1',
            label: '新增/修改道具',
            icon: <TbMoneybag />,
            children: <ItemEdit />,
        },
        {
            key: '2',
            label: '新增/修改怪物',
            icon: <GiHunterEyes />,
            children: <MonsterEdit Data={Data} />,
        }
    ];
    return (
        <Card className='myCard'>
            <Text type="secondary" italic>請先確定有在"設定"頁面設定編輯權限，然後建議先把一隻怪物的掉落道具都新增完再新增怪物</Text>
            <Tabs defaultActiveKey="1" items={tabs} />
        </Card>
    )
}

function ItemEdit() {
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: null,
        type: 'mine',
        description: null,
        preview: null
    });

    const handleInputChange = (e, key) => {
        setFormData(prevState => ({
            ...prevState,
            [key]: e.target.value
        }));
    };

    const handletypeChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            type: value
        }));
    };

    //新增一行技能預覽
    const addPreview = () => {
        setFormData(prevState => ({
            ...prevState,
            preview: (prevState.preview) ? [...prevState.preview, ''] : ['']
        }));
    }

    //刪除一行技能預覽
    const handlePreviewDelete = (index) => {
        const newPreview = [...formData.preview];
        newPreview.splice(index, 1);
        setFormData({
            ...formData,
            preview: newPreview
        });
    };

    //修改一行技能預覽
    const handlePreviewChange = (e, index) => {
        const newPreview = [...formData.preview];
        newPreview[index] = e.target.value;
        setFormData({
            ...formData,
            preview: newPreview
        });
    }

    //新增資料
    const handleSave = async () => {
        const settings = JSON.parse(localStorage.getItem('settings'));
        setLoading(true);
        try {
            const newData = { ...formData };
            if (!newData.name || !newData.description || !newData.type) throw new Error('請輸入未填欄位');

            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: settings?.email,
                password: settings?.password
            });

            if (loginError) throw new Error('登入失敗');

            const { error: insertError } = await supabase.from('items').insert([newData]);
            if (insertError) throw new Error('新增資料失敗');
            message.success('新增/修改資料成功');
        } catch (error) {
            message.error(error.message);
        }
        setLoading(false);
    };

    /*useEffect(() => {
        console.log(formData);
    }, [formData]);*/
    return (
        <>
            <Flex style={{ marginBottom: '16px' }} gap='middle' wrap='wrap' vertical>
                <Input onChange={(e) => handleInputChange(e, 'name')} style={{ maxWidth: '450px' }} addonBefore="名稱:" placeholder='ex.緋緋色金' addonAfter={
                    <Select onChange={handletypeChange} defaultValue='mine' style={{ width: '150px' }} options={
                        [
                            { value: 'mine', label: '礦物' },
                            { value: 'consumable', label: '道具(消耗品)' },
                            { value: 'skill', label: '技能' }
                        ]
                    }
                    />
                } />
                <TextArea onChange={(e) => handleInputChange(e, 'description')} placeholder='輸入說明&#13;ex.比鑽石更堅硬、不會生鏽的神秘金屬，甚至能夠成為靈魂、情感或精神能量的導體' rows={4} />
                {
                    formData.type === 'skill' &&
                    <Button onClick={() => addPreview()}>新增1行技能預覽</Button>
                }
                {
                    formData.preview &&
                    formData.preview.map((msg, index) => (
                        <Flex justify='center' align='center' key={index + 1} gap={12} className='report-text'>
                            <Col className='report-number'>{index + 1}</Col>
                            <Input onChange={(e) => handlePreviewChange(e, index)} value={msg} placeholder="A對B使出了痛扁阿淚" />
                            <Button type="text" onClick={() => handlePreviewDelete(index)} style={{ fontWeight: '700' }}>-</Button>
                        </Flex>
                    ))
                }
            </Flex>
            <Button loading={isLoading} onClick={() => handleSave()} type='primary'>確認新增/修改</Button>
        </>
    )
}

function MonsterEdit(props) {
    const { Data } = props;
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: null,
        zone: 1,
        stage: null,
        drops: null
    });

    const handleInputChange = (e, key) => {
        setFormData(prevState => ({
            ...prevState,
            [key]: e.target.value
        }));
    };

    const handleZoneChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            zone: value
        }));
    };

    //修改掉落物
    const handleDropChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            drops: value
        }));
    };

    //新增資料
    const handleSave = async () => {
        const settings = JSON.parse(localStorage.getItem('settings'));
        setLoading(true);
        try {
            let newData = { ...formData };
            let drops = newData.drops;
            delete newData.drops;
            if (!newData.name || !newData.zone || !newData.stage) throw new Error('請輸入未填欄位');

            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: settings?.email,
                password: settings?.password
            });

            if (loginError) throw new Error('登入失敗');

            const { data, error: insertError } = await supabase.from('monsters').insert([newData]).select();
            if (insertError) throw new Error('新增怪物失敗');

            if (drops) {
                const { id: monsterId } = data[0];
                const newDrops = drops.map(item => ({ monsterId, itemId: item }));

                //新增掉落表
                const { error: dropsError } = await supabase.from('drops').insert(newDrops);
                if (dropsError) throw new Error('新增掉落表失敗');
            }

            message.success('新增/修改資料成功');
        } catch (error) {
            message.error(error.message);
        }
        setLoading(false);
    };

    /*useEffect(() => {
        console.log(formData);
    }, [formData]);*/
    return (
        <>
            <Flex style={{ marginBottom: '16px' }} gap='middle' wrap='wrap' vertical>
                <Input onChange={(e) => handleInputChange(e, 'name')} style={{ maxWidth: '450px' }} addonBefore="名稱:" placeholder='ex.啵啵怪' />
                <Input onChange={(e) => handleInputChange(e, 'stage')} style={{ maxWidth: '450px' }} type='number' placeholder='層數' addonBefore={
                    <Select onChange={handleZoneChange} defaultValue={formData.zone} style={{ width: '150px' }} options={
                        zones.map((zone, index) => ({ value: index, label: zone }))
                    }
                    />
                } />
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="請選擇掉落物"
                    maxTagTextLength={12}
                    onChange={handleDropChange}
                    options={
                        Data.items.map((item) => ({ label: item.name, value: item.id }))
                    }
                />
            </Flex>
            <Button loading={isLoading} onClick={() => handleSave()} type='primary'>確認新增/修改</Button>
        </>
    )
}