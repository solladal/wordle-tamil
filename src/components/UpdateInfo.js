import React from 'react';
import { BiHelpCircle, BiBarChartAlt2 } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5'

export class UpdateInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        localStorage.setItem("version", this.props.version)
    }

    render() {
        return (
            <div>
                <center><h3 className='updateTitle'>மேம்பாடு (Update)</h3></center>
                <div>செயலி <strong className='updateTitle'>{this.props.version} </strong>க்கு மேம்படுத்தப் பட்டுள்ளது.</div>
                <ul>
                    <li>இனி 8 வாய்ப்புகள்.</li>
                    <li>விண்மீன் குறியீடு (உதவி <BiHelpCircle /> -யை பார்க்கவும்).</li>
                    <li>அகராதியில் இல்லாத சொல்லையும் அனுமதிக்க அமைப்பை <IoSettingsOutline /> மாற்றலாம். </li>
                    <li>தோல்வியையும் பகிரலாம்.  </li>
                    <li>பிழை திருத்தங்கள் மற்றும் இதர மேம்பாடுகள்.</li>
                </ul>
            </div>
        );
    }
}
