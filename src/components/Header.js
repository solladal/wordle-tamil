import React from 'react';
import { BiHelpCircle,BiBarChartAlt2 } from 'react-icons/bi';
import {IoSettingsOutline} from 'react-icons/io5'

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="header">
        <div class="menu">
        <BiHelpCircle class="icon" onClick={this.props.onHelp}/>
        </div>
        <div class="title">வேடல்<div class="titleSubText">(WORD HUNTING)</div></div>
        <div class="menu">
        <BiBarChartAlt2 class="icon" onClick={this.props.onStats}/>
        <IoSettingsOutline class="icon" onClick={this.props.onFeedback}/>
          {/* <button class="statsButton" onClick={this.props.onStats}>
            📊
          </button> */}
          {/* <button class="statsButton" onClick={this.props.onFeedback}>
            😃
          </button> */}
        </div>
      </div>
    );
  }
}
