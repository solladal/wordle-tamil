import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
export class GameTile extends React.Component {
  constructor(props) {
    super(props);
  }

  getStyle = { animationDelay: this.props.id * 200 + 'ms' };

  render() {
    const darkMode = this.props.darkMode ? "true" : "false";
    return <div key={this.props.key} className="tile" style={this.props.color ? this.getStyle : {}}
      value={this.props.value || 'empty'} color={this.props.color} darkmode={darkMode}>{this.props.value}
      {this.props.star && <div className='star'>
        <AiFillStar />
      </div>}
      {this.props.heart && <div className='heart'>
        <FaHeart />
      </div>}
    </div>;
  }
}
