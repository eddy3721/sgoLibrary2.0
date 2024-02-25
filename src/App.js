import React, { useState, useEffect } from 'react';
import './App.scss';
import supabase from './supabase.js';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Divider, Avatar, notification, Spin, Flex, Button, ConfigProvider, theme } from 'antd';
import { GiHunterEyes } from "react-icons/gi";
import { TbMoneybag } from "react-icons/tb";
import { HiLightningBolt } from "react-icons/hi";
import Items from './components/Items';
import { getZone } from './main.js';
import { AiFillHome, AiOutlineSetting, AiOutlineCalculator } from "react-icons/ai";
import Monsters from './components/Monsters.js';
import Skills from './components/Skills.js';
import Edit from './components/Edit.js';
import Setting from './components/Setting.js';
import { FaRegEdit } from "react-icons/fa";

const { Title, Text } = Typography;

function App() {
  const [api, contextHolder] = notification.useNotification({
    stack: {
      threshold: 1
    },
    maxCount: 2,
    message: '',
    placement: 'bottom',
    duration: 4.5
  });
  const [Data, setData] = useState(null);

  const getData = async () => {
    try {
      let { data: monsters } = await supabase
        .from('monsters')
        .select(`*,drops (*,items (*))`);

      monsters = monsters.map(e => {
        return {
          ...e,
          drops: e.drops.map(drop => drop.items),
          key: e.id
        };
      });

      let { data: items } = await supabase
        .from('items')
        .select(`*,drops (*,monsters (*))`);

      items = items.map(e => {
        return {
          ...e,
          drops: e.drops.map(drop => drop.monsters),
          key: e.id
        };
      });

      const newData = { monsters, items };
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate(); //導航
  const location = useLocation();

  //怪物通知
  const monsterNotification = (id) => {
    const monster = Data.monsters.find(e => e.id === id);
    if (monster) {
      api.open({
        description:
          <>
            <Flex gap='middle'>
              <Avatar shape="square" size={128} src={<img src={`/images/monsters/${monster.name}.webp`} alt='unKnown' />} />
              <Flex vertical>
                <Text strong>{monster.name}</Text>
                <Text>地點: {getZone(monster.zone) + monster.stage}</Text>
              </Flex>
            </Flex>
            <Divider orientation="left">
              <Title level={5} className='title'>掉落</Title>
            </Divider>
            <Flex vertical style={{ marginBottom: '8px' }}>
              <Flex gap='middle' wrap='wrap'>
                {
                  monster.drops.map((item, index) => (
                    <Button onClick={() => itemNotification(item.id)} size='small' style={{ fontSize: '14px' }} key={index} >
                      {item.name}
                    </Button>
                  ))
                }
              </Flex>
            </Flex>
          </>
      });
    } else {
      api.open({
        message: '資料暫不存在'
      });
    }
  };

  //道具通知
  const itemNotification = (id) => {
    const item = Data.items.find(e => e.id === id);
    if (item) {
      api.open({
        description:
          <>
            <Flex gap='middle'>
              <Avatar shape="square" size={128} icon={<TbMoneybag />} />
              <Flex vertical>
                <Text strong>{item.name}</Text>
                {
                  (item.type === 'mine') &&
                  <Text>類型: 礦物</Text>
                }
                {
                  (item.type === 'consumable') &&
                  <Text>類型: 消耗品</Text>
                }
              </Flex>
            </Flex>
            <Divider orientation="left">
              <Title level={5} className='title'>掉落</Title>
            </Divider>
            <Flex vertical style={{ marginBottom: '8px' }}>
              <Flex gap='middle' wrap='wrap'>
                {
                  item.drops.map((monster, index) => (
                    <Button onClick={() => monsterNotification(monster.id)} size='small' style={{ fontSize: '14px' }} key={index} >
                      {monster.name}
                    </Button>
                  ))
                }
              </Flex>
            </Flex>
          </>
      });
    } else {
      api.open({
        message: '資料暫不存在'
      });
    }
  }

  //分頁
  const pages = [
    {
      label: '怪物',
      key: 'monsters',
      icon: <GiHunterEyes />,
      element: <Monsters
        Data={Data}
        api={api}
        monsterNotification={monsterNotification}
        itemNotification={itemNotification}
      />,
    },
    {
      label: '道具',
      key: 'items',
      icon: <TbMoneybag />,
      element: <Items
        Data={Data}
        api={api}
        monsterNotification={monsterNotification}
        itemNotification={itemNotification}
      />,
    },
    {
      label: '技能',
      key: 'skills',
      icon: <HiLightningBolt />,
      element: <Skills
        Data={Data}
        api={api}
        monsterNotification={monsterNotification}
        itemNotification={itemNotification}
      />,
    },
    {
      label: '計算',
      key: 'calculate',
      icon: <AiOutlineCalculator />,
      element: <>還沒做好或根本不會做</>,
    },
    {
      label: '編輯',
      key: 'edit',
      icon: <FaRegEdit />,
      element: <Edit
        Data={Data}
        api={api}
        monsterNotification={monsterNotification}
        itemNotification={itemNotification}
      />,
    },
    {
      label: '設定',
      key: 'setting',
      icon: <AiOutlineSetting />,
      element: <Setting
        Data={Data}
        api={api}
        monsterNotification={monsterNotification}
        itemNotification={itemNotification}
      />,
    }
  ];
  const switchPage = (e) => {
    setCurrentPage(e.key);
    navigate(`/${e.key}`);
  }

  //回首頁
  const goHome = () => {
    navigate(`/`);
  }

  return (
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorBgBase: '#333333',
        colorTextBase: '#d2d2d2',
        colorPrimary: '#7ff5db',
        colorBgContainer: '#0000002f',
        colorBorderSecondary: '#ffffff33',
        fontSize: 14
      },
      components: {
        Select: {
          optionSelectedBg: '#424041',
          optionSelectedColor: '#7ff5db'
        },
        Menu: {
          horizontalLineHeight: '48px',
          itemPaddingInline: '20px',
        },
        Card: {
          headerHeight: 48
        },
      },
    }}>
      {contextHolder}
      <>
        {
          (Data) ?
            <>
              {
                location.pathname === "/" ?
                  <Flex className='menu-flex' gap='middle' align='center' justify='center'>
                    {
                      pages.map((page) => {
                        return (
                          <Button className={`menu-btn menu-btn-${page.key}`} onClick={() => switchPage(page)} key={page.key}>
                            {page.icon}
                            {page.label}
                          </Button>
                        )
                      })
                    }
                  </Flex>
                  :
                  <Button className='home-btn' onClick={() => goHome()} size='large' type="primary" shape="circle" icon={<AiFillHome />}></Button>
              }
              <Routes>
                {
                  pages.map((page) => {
                    return <Route key={page.key} path={`/${page.key}`} element={page.element} />
                  })
                }
              </Routes>
            </>
            :
            <Spin tip="少女折壽中..." size="large" style={{ marginTop: '20%' }}>
              <></>
            </Spin>
        }
      </>
      <div className='footer' />
    </ConfigProvider >
  );
}

export default App;
