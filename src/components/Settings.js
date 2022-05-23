import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Switch from '@mui/material/Switch';
import { readSettings, saveSettings } from '../util/stateUtil';
import { RadioButton } from './RadioButton';
import { FaHeart } from 'react-icons/fa';

export class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = readSettings();
        this.onEasyModeSwitch = this.onEasyModeSwitch.bind(this);
        this.onDarkModeSwitch = this.onDarkModeSwitch.bind(this);
        this.onDictionValidationSwitch = this.onDictionValidationSwitch.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.onEnableHeartClueSwitch = this.onEnableHeartClueSwitch.bind(this);
    }

    onEnableHeartClueSwitch() {
        let newSettings = { ...this.state, enableHeartClue: !this.state.enableHeartClue };
        saveSettings(newSettings);
        this.setState(newSettings);
        this.props.onModeChange(newSettings);
    }

    onEasyModeSwitch() {
        let newSettings = { ...this.state, easyMode: !this.state.easyMode };
        saveSettings(newSettings);
        this.setState(newSettings);
        this.props.onModeChange(newSettings);
    }

    onDarkModeSwitch() {
        let newSettings = { ...this.state, darkMode: !this.state.darkMode };
        saveSettings(newSettings);
        this.setState(newSettings);
        this.props.onModeChange(newSettings);
    }

    onDictionValidationSwitch() {
        let newSettings = { ...this.state, disableDictionaryCheck: !this.state.disableDictionaryCheck };
        saveSettings(newSettings);
        this.setState(newSettings);
    }

    handleToggle(tamilMode) {
        let newSettings;
        if (tamilMode === 'pothuTamil') {
            newSettings = { ...this.state, pothuTamilMode: true, senthamilMode: false, vadasolMode: false };
        } else if (tamilMode === 'senTamil') {
            newSettings = { ...this.state, pothuTamilMode: false, senthamilMode: true, vadasolMode: false };
        } else if (tamilMode === 'vadasol') {
            newSettings = { ...this.state, pothuTamilMode: false, senthamilMode: false, vadasolMode: true };
        }
        saveSettings(newSettings);
        this.setState(newSettings);
        this.props.onModeChange(newSettings);
    }

    getContent() {
        const darkMode = this.state.darkMode ? "true" : "false";
        return (<div className="dialog" darkmode={darkMode} page={this.props.page}>
            <div className="helpHeader" darkmode={darkMode}>
                <div />
                <h2>அமைப்பு</h2>
                <AiOutlineCloseCircle className='closeIcon' onClick={this.props.onClose} />
            </div>
            <div>
                <div className="sections">
                    <section>
                        <RadioButton darkMode={darkMode} handleToggle={this.handleToggle} selected={this.state.pothuTamilMode ? 'pothuTamil' : this.state.senthamilMode ? 'senTamil' : this.state.vadasolMode ? 'vadasol' : 'pothuTamil'} />
                        <div className="setting" darkmode={darkMode}>
                            <div>
                                <div className="settingsTitle">உயிர் மற்றும் மெய் குறிப்பு 
                                    <div style={{ color: '#f7a1f4', fontSize: '20px', marginLeft:'7px' }}>
                                        <FaHeart />
                                    </div></div>
                                <div className="settingsDescription">உயிர் எழுத்தோ அல்லது மெய் எழுத்தோ பொருந்தி இருப்பதை குறிக்கும் </div>
                            </div>
                            <Switch className='switchKey'
                                checked={this.state.enableHeartClue}
                                onChange={this.onEnableHeartClueSwitch}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                        <div className="setting" darkmode={darkMode}>
                            <div>
                                <div className="settingsTitle">எளிய முறை</div>
                                <div className="settingsDescription">உயிர்மெய் எழுத்தின் மெய்யெழுத்து பகுதி மட்டும் சரி எனில், முறையான உயிர்மெய் எழுத்தாக தானாக மாறிக்கொள்ளும் </div>
                                <div className="settingsDescription">(எ.கா : 'னை' வரவேண்டிய இடத்தில் 'ன' பதிவிட்டிருந்தால், தானாக 'னை' -ஆக மாற்றிக்கொள்ளும் ) </div>
                            </div>
                            <Switch className='switchKey'
                                checked={this.state.easyMode}
                                onChange={this.onEasyModeSwitch}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                        <div className="setting" darkmode={darkMode}>
                            <div className="text">
                                <div className="settingsTitle">கருப்பு திரை</div>
                                <div className="settingsDescription">Dark Theme </div>
                            </div>
                            <Switch className='switchKey'
                                checked={this.state.darkMode}
                                onChange={this.onDarkModeSwitch}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                        <div className="setting" darkmode={darkMode}>
                            <div className="text">
                                <div className="settingsTitle">அகராதியில் இல்லாத சொல்லையும் அனுமதிக்க</div>
                                <div className="settingsDescription">Skip Dictionary Validation</div>
                            </div>
                            <Switch className='switchKey'
                                checked={this.state.disableDictionaryCheck}
                                onChange={this.onDictionValidationSwitch}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                    </section>

                    <section>
                        <div className="setting" darkmode={darkMode}>
                            <div className="text">
                                <div className="settingsTitle">கருத்து தெரிவிக்க</div>
                                <div className="settingsDescription">Feedback </div>
                            </div>
                            <div className="control">
                                <a darkmode={darkMode} href="mailto:wordletamil@gmail.com?subject=Feedback" title="wordletamil@gmail.com">Email</a>
                                <div className='pipe'>|</div>
                                <a darkmode={darkMode} href="https://twitter.com/intent/tweet?screen_name=tamil_wordle" target="blank" title="@tamil_wordle">Twitter</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>)
    }

    render() {
        return this.getContent()
    }
}
