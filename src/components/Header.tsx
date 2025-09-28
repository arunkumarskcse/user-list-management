import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Layout, message, Space, Typography } from 'antd';

const HeaderComponent = () => {

    const { Header } = Layout;
    const { Title } = Typography;


    const [messageApi, contextHolder] = message.useMessage();

    const Logout = () => {
        localStorage.removeItem('token');
        messageApi.success('Logged out successfully!');
        // setTimeout(() => {
        //     navigate('/');
        // }, 2000);
        window.location.reload();
    }

    return (

        <>
            {contextHolder}
            <Header
                style={{
                    background: "#001529",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 20px",
                }}
            >
                <Title style={{ color: "#fff", margin: 0 }} level={4}>
                    {/* User Management */}
                </Title>

                <Space align="center">
                    <span style={{ color: "#fff" }}>Elon Musk</span>
                    <Avatar
                        style={{ backgroundColor: "#f5222d", cursor: "pointer" }}
                        icon={<LogoutOutlined />}
                        onClick={() => Logout()}
                    />
                </Space>
            </Header>
        </>
    )

}

export default HeaderComponent;