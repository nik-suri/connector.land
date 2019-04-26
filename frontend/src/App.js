import React from 'react';
import axios from 'axios';
import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import ILPLogo from './logo.png';
import ConnectorContent from './ConnectorContent';

const {
  Header, Content, Footer, Sider,
} = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeConnectorStats: 0 };
  }

  componentDidMount() {
    this.loadConnectors();
  }

  async loadConnectors() {
    const promise = await axios.get('/routing');
    const connectors = promise.data.filter(e => !e.includes('g.feraltc.'));
    const routeInfos = await Promise.all(connectors.map(async (destination) => {
      const promise = await axios.post('/pingroute', {
        destination: destination
      });
      return promise.data;
    }));
    this.setState({ routes: routeInfos });
  }

  displayConnectorStats = item => {
    this.setState({ activeConnectorStats: parseInt(item.key) });
  }

  render() {
    console.log(this.state);
    let connectors;
    let connectorInfo;
    if (this.state.routes) {
      connectors = this.state.routes.map((routeInfo, i) => {

        let status;
        if (routeInfo.stats.loss === 0) {
          status = "green";
        } else if (routeInfo.stats.loss === 1) {
          status = "red";
        } else {
          status = "yellow";
        }

        return (
          <Menu.Item
            key={i}
            onClick={this.displayConnectorStats}
          >
            <Icon type="laptop"
              style={{
                color: status,
                fontSize: '28px',
                float: "left"
              }}
            />
            <span className="nav-text">{routeInfo.route}</span>
					</Menu.Item>
        );
      });

      connectorInfo = this.state.routes[this.state.activeConnectorStats];
    } else {
      connectors = <Icon type="loading" />;
      connectorInfo = '';
    }

    return (
      <div>
        <Layout>
          <Header id="connector-land-header">
            <img id="ILPLogo" alt="Interledger" src={ILPLogo} />
            <span id="connector-land-title">Connector.land</span>
          </Header>
          <Layout>
            <Sider id="connector-land-sider" width="auto">
              <Menu
                mode="inline"
                defaultSelectedKeys={['0']}
              >
                {connectors}
              </Menu>
            </Sider>
            <Content id="connector-land-content">
              <ConnectorContent
                name={connectorInfo.route}
                stats={connectorInfo.stats}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
