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
      <Step title={address} status="process" />
    ));;

    return (
      <div>
        <PageHeader
          className="connector-content-title"
          title={this.props.address}
        />
        <Steps className="connector-route-steps">
          {path}
        </Steps>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

export default ConnectorContent;
