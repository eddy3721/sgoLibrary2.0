import React, { useState, useEffect } from 'react';
import '../App.scss';
import { Select, Space, Divider, Avatar, Badge, Typography, Card, Table, Spin, Flex, Button } from 'antd';
import { getZone, zones } from '../main.js';
import { TbMoneybag } from "react-icons/tb";
import { AiOutlineDown } from "react-icons/ai";

const { Title, Text } = Typography;

export default function Monsters(props) {
    const { Data, api, monsterNotification, itemNotification } = props;
    const columns = [
        {
            title: '名稱',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: '地點',
            dataIndex: 'zone',
            key: 'zone',
            render: (text, record) => (
                <>{getZone(record.zone) + record.stage}</>
            )
        }
    ];
    const [monsters, setMonsters] = useState(Data.monsters);

    //篩選器
    const zoneFilter = (value) => {
        let newMonsters;
        if (value >= 0) {
            newMonsters = Data.monsters.filter(monster => monster.zone === value);
        } else {
            newMonsters = Data.monsters;
        }

        setMonsters(newMonsters);
    }

    return (
        <>
            <Card className='myCard'>
                <Table
                    size="small"
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <Flex>
                                <Avatar shape="square" size={128} src={<img src={`/images/monsters/${record.name}.webp`} alt='unKnown' />} />
                                <Flex vertical style={{ marginLeft: '55px', marginRight: '55px', marginBottom: '8px' }}>
                                    <Title level={5} className='title'>掉落</Title>
                                    <Flex gap='large' wrap='wrap'>
                                        {
                                            record.drops.map((item, index) => (
                                                <Badge.Ribbon text={<TbMoneybag />} key={index}>
                                                    <Button onClick={() => itemNotification(item.id)} type="dashed" className='badge-btn'>
                                                        {`${item.name}`}
                                                    </Button>
                                                </Badge.Ribbon>
                                            ))
                                        }
                                    </Flex>
                                </Flex>
                            </Flex>
                        )
                    }}
                    dataSource={monsters}
                    expandRowByClick={true}
                    pagination={false}
                />
            </Card>
            <Card className='filter'>
                <Flex justify='center' wrap='wrap' gap={5}>
                    <Select
                        size='large'
                        placeholder="選擇地點"
                        allowClear={true}
                        options={zones.map((zone, index) => ({ label: zone, value: index }))}
                        onChange={zoneFilter}
                    />
                </Flex>
            </Card>
        </>
    )
}