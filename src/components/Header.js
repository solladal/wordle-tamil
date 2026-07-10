import React from 'react';
import { BiHelpCircle, BiBarChartAlt2 } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5'
import Badge from '@mui/material/Badge';

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const darkMode = this.props.darkMode ? "true" : "false";
    return (
      <div className="header" darkmode={darkMode}>
        <div className="menu" >
          <Badge color="primary" variant="dot" invisible={true}>
            <button className="iconButton" aria-label="எப்படி விளையாடுவது - How to play" onClick={this.props.onHelp}>
              <BiHelpCircle className="icon" darkmode={darkMode} />
            </button>
          </Badge>
        </div>
        <div className="title">வேடல்<div className="titleSubText">(சொல் வேட்டை)</div></div>
        <div className="menu" darkmode={darkMode}>
          <Badge color="primary" variant="dot" invisible={true}>
            <button className="iconButton" aria-label="புள்ளிவிவரங்கள் - Statistics" onClick={this.props.onStats}>
              <BiBarChartAlt2 className="icon" darkmode={darkMode} />
            </button>
          </Badge>
          <Badge color="primary" variant="dot" invisible={this.props.badgeInvisible}>
            <button className="iconButton" aria-label="அமைப்பு - Settings" onClick={this.props.onFeedback}>
              <IoSettingsOutline className="icon" darkmode={darkMode} />
            </button>
          </Badge>
        </div>
      </div>
    );
  }
}
