import React, { useEffect } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai'
import Switch from '@mui/material/Switch';
import { readSettings, saveSettings } from '../util/stateUtil';

export class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = readSettings();
        this.onSenthamilModeSwitch = this.onSenthamilModeSwitch.bind(this);
        this.onEasyModeSwitch = this.onEasyModeSwitch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onDarkModeSwitch = this.onDarkModeSwitch.bind(this);
        this.onDictionValidationSwitch = this.onDictionValidationSwitch.bind(this);
    }

    handleChange() {
        //console.log(JSON.stringify(this.state))
    }

    onSenthamilModeSwitch() {
        let newSettings = { senthamilMode: !this.state.senthamilMode, easyMode: this.state.easyMode, darkMode: this.state.darkMode };
        saveSettings(newSettings);
        this.setState(newSettings);
        this.props.onModeChange(newSettings);
    }

    onEasyModeSwitch() {
        let newSettings = { senthamilMode: this.state.senthamilMode, easyMode: !this.state.easyMode, darkMode: this.state.darkMode };
        saveSettings(newSettings);
        this.setState(newSettings);
        this.props.onModeChange(newSettings);
    }

    onDarkModeSwitch() {
        let newSettings = { senthamilMode: this.state.senthamilMode, easyMode: this.state.easyMode, darkMode: !this.state.darkMode };
        saveSettings(newSettings);
        this.setState(newSettings);
        this.props.onModeChange(newSettings);
    }

    onDictionValidationSwitch() {
        let newSettings = {... this.state, disableDictionaryCheck: !this.state.disableDictionaryCheck};
        saveSettings(newSettings);
        this.setState(newSettings);
    }

    getContentInTamil() {
        const darkMode = this.state.darkMode ? "true" : "false";
        return (<div className="dialog" darkMode={darkMode} page={this.props.page}>
            <div className="helpHeader" darkMode={darkMode}>
                <div />
                <h2>அமைப்பு</h2>
                <AiOutlineCloseCircle className='closeIcon' onClick={this.props.onClose} />
            </div>
            <div>
                <div className="sections">
                    <section>
                        <div className="setting" darkMode={darkMode}>
                            <div>
                                <div className="settingsTitle">பொதுத்தமிழ்</div>
                                <div className="settingsDescription">பொது பயன்பாட்டில் உள்ள சொற்கள் மட்டும்</div>
                            </div>
                            
                            <Switch className='switchKey'
                                    checked={!this.state.senthamilMode}
                                    onChange={this.onSenthamilModeSwitch}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            

                        </div>
                        <div className="setting" darkMode={darkMode}>
                            <div>
                                <div className="settingsTitle">இலக்கியத்தமிழ்</div>
                                <div className="settingsDescription">இலக்கிய நூல்களில் உள்ள தூய செந்தமிழ் சொற்கள்</div>
                            </div>
                            <Switch className='switchKey'
                                checked={this.state.senthamilMode}
                                onChange={this.onSenthamilModeSwitch}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                        <div className="setting" darkMode={darkMode}>
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
                        <div className="setting" darkMode={darkMode}>
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
                        <div className="setting" darkMode={darkMode}>
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
                        <div className="setting" darkMode={darkMode}>
                            <div className="text">
                                <div className="settingsTitle">கருத்து தெரிவிக்க</div>
                                <div className="settingsDescription">Feedback </div>
                            </div>
                            <div className="control">
                                <a darkMode={darkMode} href="mailto:wordletamil@gmail.com?subject=Feedback" title="wordletamil@gmail.com">Email</a>
                                <div className='pipe'>|</div>
                                <a darkMode={darkMode} href="https://twitter.com/intent/tweet?screen_name=tamil_wordle" target="blank" title="@tamil_wordle">Twitter</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>)
    }

    render() {
        // return (<div>
        //     <div className="container">
        //       <p>
        //         <strong>FEEDBACK:</strong>
        //       </p>
        //       <p>
        //         <a
        //           href="https://twitter.com/intent/tweet?screen_name=tamil_wordle"
        //           target="blank"
        //           title="@tamil_wordle"
        //         >
        //           Twitter
        //         </a>
        //       </p>
        //       <p>
        //         <a
        //           href="mailto:wordletamil@gmail.com?subject=Feedback"
        //           title="wordletamil@gmail.com"
        //         >
        //           Email
        //         </a>
        //       </p>
        //     </div>
        //   </div>)

        return this.getContentInTamil()
    }
}
