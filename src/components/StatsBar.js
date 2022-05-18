import React from 'react';

export class StatsBar extends React.Component {
    constructor(props) {
        super(props);
    }

    getbars() {
        try {
            let guesses = this.props.guesses;
            if (guesses) {
                let max = Math.max(...Object.values(guesses));
                let bars = Object.keys(guesses).map(key => (
                    <div className='statsRow'>
                        <div className='statsIndex' highlight={this.isHighlight(key)}>{key}</div>
                        <div style={{ width: "100%", display: 'flex' }}>
                            <div className='statsBar' style={{ width: `${guesses[key] * 100 / max}%` }} highlight={this.isHighlight(key)}></div>
                            <div className='statsNumber'>{guesses[key]}</div>
                        </div>
                    </div>
                ));
                return (<div>
                    <h3 className="statsHeader">கணிப்பு பங்கீடு</h3>
                    {bars}
                </div>)
            } else {
                return null;
            }
        } catch (e) {
            console.log(e)
            return null;
        }

    }

    isHighlight(key) {
        return (key === this.props.rowIndex && this.props.gameState !== 'INPROGRESS') ? 'true' : 'false';
    }

    render() {
        return (
            <div className='statsBarContainer'>
                {this.getbars()}
            </div>
        );
    }
}
