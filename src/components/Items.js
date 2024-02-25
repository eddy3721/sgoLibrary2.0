import React, { useState, useEffect } from 'react';
import '../App.scss';
import { Divider, Avatar, Badge, Typography, Card, Table, Spin, Flex, Button } from 'antd';
import { getZone } from '../main.js';

const { Title, Text } = Typography;

export default function Items(props) {
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

    return (
        <>
            <Card className='myCard'>
                <Table
                    size="small"
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Flex vertical style={{ marginLeft: '55px', marginRight: '55px', marginBottom: '8px' }}>
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
                    dataSource={Data.items}
                    expandRowByClick={true}
                    pagination={false}
                />
            </Card>
        </>
    )
}