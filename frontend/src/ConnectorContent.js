import React from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';

class ConnectorContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <div>
        {this.props.name}
        {JSON.stringify(this.props.stats)}
      </div>
    );
  }
}

export default ConnectorContent;
