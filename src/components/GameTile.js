import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';

const COLOR_LABELS = {
  green: 'சரியான இடத்தில் உள்ளது',
  yello: 'சொல்லில் உள்ளது, வேறு இடத்தில்',
  'green-partial': 'பாதி சரியானது',
  'yello-partial': 'பாதி சரியானது, வேறு இடத்தில்',
  gray: 'சொல்லில் இல்லை',
};

export class GameTile extends React.Component {
  constructor(props) {
    super(props);
  }

  getStyle = { animationDelay: this.props.id * 500 + 'ms' };

  render() {
    const darkMode = this.props.darkMode ? "true" : "false";
    const colorLabel = this.props.color && COLOR_LABELS[this.props.color];
    const ariaLabel = this.props.value
      ? `${this.props.value}${colorLabel ? ' - ' + colorLabel : ''}`
      : 'வெற்று';
    return <div key={this.props.key} className="tile" style={this.props.color ? this.getStyle : {}}
      value={this.props.value || 'empty'} color={this.props.color} darkmode={darkMode}
      role="img" aria-label={ariaLabel}>{this.props.value}
      {this.props.star && <div className='star'>
        <AiFillStar />
      </div>}
      {this.props.heart && <div className='heart'>
        <FaHeart />
      </div>}
    </div>;
  }
}
