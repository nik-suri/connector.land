import React from 'react';
import {
  Modal,
  Button
} from 'antd';
import 'antd/dist/antd.css';
import './About.css';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <span id="app-about">
        <Button type="primary" onClick={this.showModal}>
          What is this?
        </Button>
        <Modal
          title="What is this?"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
					<p>This website lists the connectors that make up <a href="https://interledger.org/" target="_blank" rel="noopener noreferrer">Interledger</a>.</p>
					<p>A connector connects to one or more other connectors in a similar manner to how Internet Switches link two or more computers.</p>
					<p>To learn more about joining the ILP Network, follow our <a href="https://medium.com/interledger-blog" target="_blank" rel="noopener noreferrer">Medium Blog</a>, where you can find a number of tutorials that will show you ways to connect to the ILP network.</p>
					<h3>How does it work?</h3>
					<p>ILP Monitor acquires data by pulling data from a particular tier-1 connector on the network. This connector receives routing information from its peers among the other tier-1 connectors, which are in turn receiving routing information from their client connectors. This broadcasting of routing information propagates up from the deepest connectors on the network to their parents, creating a network topology that this site displays.</p>
          <p>ILP Monitor checks the addresses by establishing a connection with the destination address using <a href="https://github.com/interledgerjs/ilp-plugin">ilp-plugin</a> and sending a test packet to the address with a condition, expecting to receive a fulfillment. When the fulfillment is received, the target connector is considered live and is listed as such here.</p>
          <p>This website and the scripts that generate the data displayed here are <a href="https://github.com/nik-suri/ilp-monitor" target="_blank" rel="noopener noreferrer">open source</a>.</p>
					<h3>Tips for connectors</h3>
					<p>If you wish to deploy your own connector, you may follow the tutorial found at the <a href="https://github.com/interledgerjs/tf-connector">tf-connector</a> repository at the Interledgerjs organization. If you get in touch with someone who owns a tier 1 connector, you can peer with each other and lauch a tier 1 yourself. Otherwise, launch a tier 2 and establish a parent relationship with any of the connectors you see here.</p>
					<p>Take into account that most connectors on ILP Monitor are running software that still changes often, and most maintainers will take their connector into (extended) maintenance mode without warning and probably without refunds, so it's probably wise to avoid putting more money onto any connectors than you are willing to lose.</p>
        </Modal>
      </span>
    );
  }
}

export default About;
