import React, { useState, useEffect } from 'react';
import '../App.scss';
import { Col, Row, Select, Space, Divider, Avatar, Badge, Typography, Card, Table, Spin, Flex, Button } from 'antd';
import { getZone, zones, weapons } from '../main.js';
import { TbMoneybag } from "react-icons/tb";
import { AiOutlineDown } from "react-icons/ai";

const { Title, Text } = Typography;

export default function Skills(props) {
    const { Data, api, monsterNotification, itemNotification } = props;
    const columns = [
        {
            title: '名稱',
            dataIndex: 'name',
            key: 'name',
            width: 250
        },
        {
            title: '說明',
            dataIndex: 'description',
            key: 'description',
        }
    ];
    const [skills, setSkills] = useState(
        Data.items.filter(item => item.type === 'skill')
    );

    //篩選器
    const weaponFilter = (value) => {
        let newMonsters;
        if (value) {
            const regex = /【([^【】]*)】/;
            newMonsters = Data.items.filter(item => {
                const match = item.description.match(regex);
                return match && match[1] === value;
            });
        } else {
            newMonsters = Data.items.filter(item => item.type === 'skill');
        }

        setSkills(newMonsters);
    }

    return (
        <>
            <Card className='myCard'>
                <Table
                    size="small"
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Flex vertical style={{ marginLeft: '55px', marginRight: '55px', marginBottom: '8px' }}>
                                <Title level={5} className='title'>預覽</Title>
                                <Flex wrap='wrap' vertical>
                                    {
                                        record.preview &&
                                        record.preview.map((msg, index) => (
                                            <Row key={index + 1} gutter={16} className='report-text'>
                                                <Col className='report-number'>{index + 1}</Col>
                                                <Col className='report-level-1'>{msg}</Col>
                                            </Row>
                                        ))
                                    }
                                </Flex>
                                <Title level={5} className='title'>掉落</Title>
                                <Flex gap='large' wrap='wrap'>
                                    {
                                        record.drops.map((monster, index) => (
                                            <Badge.Ribbon text={getZone(monster.zone) + monster.stage} key={index}>
                                                <Button onClick={() => monsterNotification(monster.id)} type="dashed" className='badge-btn'>
                                                    {`${monster.name}${Array((getZone(monster.zone) + monster.stage).length).join('\u2003')}`}
                                                </Button>
                                            </Badge.Ribbon>
                                        ))
                                    }
                                </Flex>
                            </Flex>
                        )
                    }}
                    dataSource={skills}
                    expandRowByClick={true}
                    pagination={false}
                />
            </Card>
            <Card className='filter'>
                <Flex justify='center' wrap='wrap' gap={5}>
                    <Select
                        size='large'
                        placeholder="選擇武器"
                        allowClear={true}
                        options={weapons.map((e, index) => ({ label: e, value: e }))}
                        onChange={weaponFilter}
                    />
                </Flex>
            </Card>
        </>
    )
}