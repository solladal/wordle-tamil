import React from 'react';
import { Stats } from './Stats';

export class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="header">
        <div class="menu">
          <button id="help-button" onClick={this.props.onHelp}>
          ?
          </button>
        </div>
        <div class="title">வேடல்<div class="titleSubText">(WORD HUNTING)</div></div>
        <div class="menu">
          <button class="statsButton" onClick={this.props.onStats}>
            📊
          </button>
          <button class="statsButton" onClick={this.props.onFeedback}>
            😃
          </button>
        </div>
      </div>
    );
  }
}
