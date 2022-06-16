import React from 'react';

export class RadioButton extends React.Component {
  constructor(props) {
    super(props);
    this.getButtonStyle = this.getButtonStyle.bind(this);
  }

  isSelected(tamilMode) {
    return this.props.selected === tamilMode ? 'true' : 'false';
  }

  getButtonStyle(tamilMode) {
    if (this.props.selected === tamilMode) {
      if (this.props.darkMode === 'true') {
        return {
          color: 'rgb(144, 202, 249)',
          backgroundColor: 'rgba(144, 202, 249, 0.16)',
          animation: 'zoom-in-zoom-out 0.3s'
        }

      } else {
        return {
          color: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
          animation: 'zoom-in-zoom-out 0.3s'
        }
      }
    } else {
      if (this.props.darkMode === 'true') {
        return {
          color: '#d7dadc'
        }
      }
    }
  }

  render() {
    return <div >
      <div darkmode={this.props.darkMode} style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex', justifyContent: 'center', border: '1px solid var(--gray)',
          borderRadius: '4px'
        }}>
          <button darkmode={this.props.darkMode} className='toggleButton' onClick={() => this.props.handleToggle('pothuTamil')} style={this.getButtonStyle('pothuTamil')}>பொதுத்தமிழ்</button>
          <div className='verticalDivider'></div>
          <button darkmode={this.props.darkMode} className='toggleButton' onClick={() => this.props.handleToggle('senTamil')} style={this.getButtonStyle('senTamil')}>இலக்கியத்தமிழ்</button>
          <div className='verticalDivider'></div>
          <button darkmode={this.props.darkMode} className='toggleButton' onClick={() => this.props.handleToggle('vadasol')} style={this.getButtonStyle('vadasol')}>வடசொல்</button>
        </div>
        <div style={{ height: '30px', backgroundColor: 'aliceblue' }}>

        </div>

      </div>
      <div style={{ display: 'flex', justifyContent: 'center', }}>
        {this.props.selected === 'pothuTamil' && <div className='desc'>
          பொது பயன்பாட்டில் உள்ள சொற்கள் மட்டும்
        </div>}
        {this.props.selected === 'senTamil' && <div className='desc'>
          இலக்கிய நூல்களில் இடம்பெறும் சொற்கள்
        </div>}
        {this.props.selected === 'vadasol' && <div className='desc'>
          தமிழ்மொழி போல் புழக்கத்திலுள்ள வடசொற்கள் (கிரந்த எழுத்துக்களுடன்)
        </div>}
      </div>
    </div>;
  }
}
