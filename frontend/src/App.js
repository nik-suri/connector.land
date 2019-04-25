import React from 'react';
import axios from 'axios';
import { Collapse } from 'antd';
import 'antd/dist/antd.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { routes: [] };
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

  render() {
    const Panel = Collapse.Panel;
    console.log(this.state);
    const panels = this.state.routes.map((routeInfo, i) => {

      let status;
      if (routeInfo.stats.loss === 0) {
        status = "green";
      } else if (routeInfo.stats.loss === 1) {
        status = "red";
      } else {
        status = "yellow";
      }

      const customPanelStyle = {
        background: status
      };

      return (
        <Panel header={routeInfo.route} key={i} style={customPanelStyle}>
          <p>{JSON.stringify(routeInfo.stats)}</p>
        </Panel>
      );
    });

    return (
      <div>
        <Collapse accordion>
          {panels}
        </Collapse>
      </div>
    )
  }
}

export default App;
