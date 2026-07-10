import React from 'react';
import { HelpContent } from './HelpContent';
import { AiOutlineCloseCircle } from 'react-icons/ai'

export class Help extends React.Component {
  constructor(props) {
    super(props);
    this.closeIconRef = React.createRef();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // Move focus onto the close icon as soon as the modal mounts, so a
    // keyboard user can press Enter/Space to close it right away instead
    // of needing to Tab to it first.
    if (this.closeIconRef.current) {
      this.closeIconRef.current.focus();
    }
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  }

  handleActivate(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.props.onClose();
    }
  }

  render() {
    const darkMode = this.props.darkMode ? "true" : "false";
    return (<div className="dialog" darkmode={darkMode} page={this.props.page}>
      <div className="helpHeader" darkmode={darkMode}>
        <div />
        <h2>எப்படி விளையாடுவது</h2>
        <AiOutlineCloseCircle
          className='closeIcon'
          role="button"
          tabIndex={0}
          aria-label="மூடு - Close"
          ref={this.closeIconRef}
          onClick={this.props.onClose}
          onKeyDown={(e) => this.handleActivate(e)}
        />
      </div>
      <HelpContent darkMode={this.props.darkMode} />
      <div className="helpFooter">
        <span
          className="backLink"
          role="button"
          tabIndex={0}
          onClick={this.props.onClose}
          onKeyDown={(e) => this.handleActivate(e)}
        >
          &larr; வேடல்
        </span>
      </div>
    </div>)
  }
}
