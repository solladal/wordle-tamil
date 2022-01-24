import React from 'react';
import { GameTile } from './GameTile';
import { split } from '../util/languageUtil';

export class Help extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="dialog" page={this.props.page}>
        <div class="helpHeader">
          <div />
          <h2>HOW TO PLAY</h2>
          <icon class="closeIcon" onClick={this.props.onClose}>
            X
          </icon>
        </div>
        <div>
          <p>
            Guess the <strong>WORDLE</strong> in 6 tries.
          </p>
          <p>Hit the enter button to submit.</p>
          <p>
            After each guess, the color of the tiles will change to show how
            close your guess was to the word.
          </p>
          <hr />
          <div class="tile-row helprow" length="4">
            <GameTile value="தெ" color="green" />
            <GameTile value="ன்" color="" />
            <GameTile value="ற" color="" />
            <GameTile value="ல்" color="" />
          </div>
          <p>
            The letter <strong>தெ</strong> is in the word and in the correct
            spot.
          </p>
          <div class="tile-row helprow" length="4">
            <GameTile value="மி" color="" />
            <GameTile value="ன்" color="yello" />
            <GameTile value="ன" color="" />
            <GameTile value="ல்" color="" />
          </div>
          <p>
            The letter <strong>ன்</strong> is in the word but in the wrong spot.
          </p>
          <div class="tile-row helprow" length="4">
            <GameTile value="அ" color="" />
            <GameTile value="ச்" color="" />
            <GameTile value="ச" color="" />
            <GameTile value="ம்" color="gray" />
          </div>
          <p>
            The letter <strong>ம்</strong> is not in the word in any spot.
          </p>
          <div class="tile-row helprow" length="4">
            <GameTile value="பௌ" color="" />
            <GameTile value="ர்" color="green-partial" />
            <GameTile value="ண" color="" />
            <GameTile value="மி" color="" />
          </div>
          <p>
            The letter <strong>ர்</strong> is not in the word but one of the
            variations of
            <strong> ர்</strong>, like <strong>ரா, ரி , ரீ, ரு, ... </strong> is
            in the word in the same spot.
          </p>
          <div class="tile-row helprow" length="4">
            <GameTile value="அ" color="" />
            <GameTile value="கி" color="yello-partial" />
            <GameTile value="ல" color="" />
            <GameTile value="ம்" color="" />
          </div>
          <p>
            The letter <strong> கி</strong> is not in the word but one of
            the variations of
            <strong> கி</strong>, like <strong>க், க, கா, கு, ... </strong> is
            in the word but in different spot.
          </p>
          <hr />
          <strong>REMEMBER</strong>
          <p><GameTile value="h" color="green" /> - சரியானது</p>
          <p><GameTile value="h" color="yello" /> - சரியானது ஆனால் வேறு இடம் </p>
          <p><GameTile value="h" color="green-partial" /> - பாதி சரியானது </p>
          <p><GameTile value="h" color="yello-partial" /> - பாதி சரியானது ஆனால் வேறு இடம் </p>
          <p><GameTile value="h" color="gray" /> - தவறானது </p>
          <hr />
          <p>
            <strong>A new WORDLE will be available each day!</strong>
          </p>
        
          <br />
        </div>
      </div>
    );
  }
}
