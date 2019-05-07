import React from 'react';
import {
  Table,
  PageHeader,
  Steps
} from 'antd';
import 'antd/dist/antd.css';
import './ConnectorContent.css';

const Step = Steps.Step;

class ConnectorContent extends React.Component {
  render() {
    const columns = [{
      title: 'Ping stat',
      dataIndex: 'statName',
      key: 'statName'
    }, {
      title: 'Value',
      dataIndex: 'statValue',
      key: 'statValue'
    }];

    const dataSource = Object.keys(this.props.stats).map((key, index) => {
      return {
        key: index,
        statName: key,
        statValue: this.props.stats[key]
      };
    });

    const path = this.props.path.map(address => (
      <Step title={address} />
    ));;

    return (
      <div>
        <PageHeader
          className="connector-content-title"
          title={this.props.address}
        />
        <Table dataSource={dataSource} columns={columns} />
        <Steps status="finish">
          {path}
        </Steps>
      </div>
    );
  }
}

export default ConnectorContent;
