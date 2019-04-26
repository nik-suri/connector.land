import React from 'react';
import { Table, PageHeader } from 'antd';
import 'antd/dist/antd.css';

class ConnectorContent extends React.Component {
  constructor(props) {
    super(props);
  }

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

    return (
      <div>
        <PageHeader
          className="connector-content-title"
          title={this.props.name}
        />
        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

export default ConnectorContent;
