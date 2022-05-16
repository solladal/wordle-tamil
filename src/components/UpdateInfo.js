import React from 'react';
import { BiHelpCircle } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
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
                <center><h3 className='updateTitle'>மேம்பாடு (Update): {this.props.version}</h3></center>
                <div>செயலி <strong className='updateTitle'>{this.props.version} </strong>க்கு மேம்படுத்தப் பட்டுள்ளது.</div>
                {updates[this.props.version]}
            </div>
        );
    }
}

const updates = {
    '3.0': <ul>
        <li>புதிய <FaHeart style={{ color: '#f7a1f4' }} /> குறியீடு- உயிர்எழுத்து மற்றும் மெய்எழுத்து இருப்பை குறிக்க</li>
        <li>உயிர் மற்றும் மெய் எழுத்து குறியீடு பற்றி மேலும் அறிய உதவி <BiHelpCircle/>-யை பார்க்கவும்.</li>
        <li>பிழை திருத்தங்கள்</li>
    </ul>,
    '2.0': <ul>
        <li>இனி 8 வாய்ப்புகள்.</li>
        <li>விண்மீன் குறியீடு (உதவி <BiHelpCircle /> -யை பார்க்கவும்).</li>
        <li>அகராதியில் இல்லாத சொல்லையும் அனுமதிக்க அமைப்பை <IoSettingsOutline /> மாற்றலாம். </li>
        <li>தோல்வியையும் பகிரலாம்.  </li>
        <li>பிழை திருத்தங்கள் மற்றும் இதர மேம்பாடுகள்.</li>
    </ul>
}
