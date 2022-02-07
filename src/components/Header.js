import React from 'react';
import { BiHelpCircle,BiBarChartAlt2 } from 'react-icons/bi';
import {IoSettingsOutline} from 'react-icons/io5'
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
        <BiHelpCircle className="icon" darkmode={darkMode} onClick={this.props.onHelp}/>
        </Badge>
        </div>
        <div className="title">வேடல்<div className="titleSubText">(சொல் வேட்டை)</div></div>
        <div className="menu" darkmode={this.props.darkMode ? "true" : false}>
        <Badge color="primary" variant="dot" invisible={true}>
        <BiBarChartAlt2 className="icon" darkmode={darkMode} onClick={this.props.onStats}/>
        </Badge>
        <Badge color="primary" variant="dot" invisible={this.props.badgeInvisible}>
            <IoSettingsOutline className="icon" darkmode={darkMode} onClick={this.props.onFeedback}/>
        </Badge>
        
          {/* <button className="statsButton" onClick={this.props.onStats}>
            📊
          </button> */}
          {/* <button className="statsButton" onClick={this.props.onFeedback}>
            😃
          </button> */}
        </div>
      </div>
    );
  }
}
