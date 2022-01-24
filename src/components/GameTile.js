import React from 'react';

export class GameTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div class="tile" value={this.props.value || 'empty'} color={this.props.color}>{this.props.value}</div>;
  }
}
