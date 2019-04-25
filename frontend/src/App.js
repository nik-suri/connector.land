import React from 'react';
import axios from 'axios';
import { Icon, Button } from 'antd';
import 'antd/dist/antd.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    console.log(routeInfos);
    this.setState({ routes: routeInfos });
  }

  displayConnectorStats = e => {
    console.log(e.target);
    this.setState({ activeConnectorStats: parseInt(e.target.name) });
  }

  render() {
    console.log(this.state);
    let connectorButtons;
    let connectorStats;
    if (this.state.routes) {
      connectorButtons = this.state.routes.map((routeInfo, i) => {

        let status;
        if (routeInfo.stats.loss === 0) {
          status = "green";
        } else if (routeInfo.stats.loss === 1) {
          status = "red";
        } else {
          status = "yellow";
        }

        return (
          <div>
            <Button
              name={i}
              onClick={this.displayConnectorStats}
              block>
              <Icon type="laptop"
                style={{
                  color: status,
                  fontSize: '28px',
                  float: "left"
                }}
              />
              {routeInfo.route}
            </Button>
          </div>
        );
      });

      connectorStats = JSON.stringify(this.state.routes[this.state.activeConnectorStats]);
    } else {
      connectorButtons = <Icon type="loading" />;
      connectorStats = '';
    }

    return (
      <div>
        <div class="connector-list">
          {connectorButtons}
        </div>
        <div>
          {connectorStats}
        </div>
      </div>
    );
  }
}

export default App;
