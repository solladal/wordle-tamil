import React from 'react';

export class GameTile extends React.Component {
  constructor(props) {
    super(props);
  }

  getStyle = {animationDelay: this.props.id * 200 + 'ms'};

  render() {
    return <div key={this.props.id} className="tile" style={this.props.color ? this.getStyle : {}} value={this.props.value || 'empty'} color={this.props.color}>{this.props.value} </div>;
  }
}
