import React, { Component } from 'react';
import './Game.css';
import news from './icons/newspaper-solid.svg';
import newsh from './icons/newspaper-highlight.svg';
import ball from './icons/baseball-ball-solid.svg';
import ballh from './icons/baseball-ball-highlight.svg';
import tv from './icons/tv-solid.svg';
import tvh from './icons/tv-highlight.svg';
import camera from './icons/video-solid.svg';
import camerah from './icons/video-highlight.svg';
import caret from './icons/caret-down-solid.svg';

import DataService from './DataService'

/**
 * This renders each game for both the round filter
 * and the date filter. Individual components for the
 * game component is crafted for each filter and screen
 * size.
 * Icons are loaded and subsituted to simulate highlighting.
 */
class Game extends Component {
  /**
   * Calculates data needed for rendering the game through
   * props and then renders both the desktop and mobile
   * versions.
   * Finds the status, creates URLs, and sets icons for live
   * status.
   */
  renderRoundGame(){
    var g = this.props.gameData;
    var mobile = this.props.mobile;
    var date = new Date(g.gameDate);
    var dateString = DataService.months[date.getMonth()] + " " + date.getDate()
    var tvurl = DataService.getTVURL(g.broadcasts);
    var gamedayURL = DataService.getGamedayURL(g.gamePk, g.status.abstractGameState);
    var gamedayIcon = news;
    var gamedayIconH = newsh;
    var stateMessage = g.status.abstractGameState;
    // Set the correct message and icon for the live/past/future status
    if(stateMessage === "Live"){
      gamedayIcon = ball;
      gamedayIconH = ballh;
      stateMessage = "Gameday"
    } else if(stateMessage === "Final"){
      stateMessage = "Wrap"
    } else {
      stateMessage = "Preview"
    }
    // If the parent says it's mobile mode time, return the mobile version
    if(mobile){
      return(
        <div >{this.renderRoundGameMobile(g, dateString, tvurl, gamedayURL, gamedayIcon, gamedayIconH, stateMessage)}</div>
      )
    }
    // If it's desktop size, render the game calling separate functions for each section
    return (
      <div>
        <div className="row Game">
          <div className="col-2 Date">
           <div>{this.renderQuickSeriesInfo(g, stateMessage, dateString, mobile)}</div>
          </div>
          <div className="col-4 TeamScore">
            {this.renderTeams(g, stateMessage, false)}
          </div>
          <div className="col-4 Extra">
            {this.renderExtra(g, stateMessage)}
          </div>
          <div className="col-2">
            {this.renderMediaSection(tvurl, gamedayURL, stateMessage, gamedayIcon, gamedayIconH, g.gamePk, false)}
          </div>
        </div>
      </div>
    )
  }

  /**
   * Takes in the gameobject, live state, the formatted date, and a
   * boolean for the mobile state.
   * This renders the date for round filter mode, and it renders
   * series info for date filter mode.
   * @param {*} g 
   * @param {*} stateMessage 
   * @param {*} dateString 
   * @param {*} mobile 
   */
  renderQuickSeriesInfo(g, stateMessage, dateString, mobile){
    // If the render style is date, render with series info
    if(this.props.renderStyle==="Date"){
      var toptext = "";
      var text = "";
      var className = "SeriesQuickInfo";
      if(stateMessage === "Gameday" || stateMessage === "Preview"){
        toptext = g.seriesStatus.shortName;
        text = g.seriesStatus.shortDescription;
      } else {
        toptext = g.seriesStatus.shortName;
        text = g.seriesStatus.result;
      }
      // If the width is for mobile screens, alter the text 
      // so the component isn't cramped.
      if(mobile){
        toptext = "";
        className = "SeriesQuickInfoMobile"
      }
      return (
        <div className={className}>
        <div>{toptext}</div>
        <div>{text}</div>
        </div>
      )
    // If the render style is round, render with date info
    } else {
      return (<div className="Date">{dateString + " "}<span className="Time">{this.renderStatus(g, g.status.abstractGameState)}</span></div>)
    }
  }

  /**
   * Passed game object, formatted date string, a url for MLBTV,
   * a url for gameday preview, wrap, etc., an icon for the gameday
   * info, and the series current state.
   * Renders the game for mobile-sized screens.
   * @param {*} g 
   * @param {*} dateString 
   * @param {*} tvurl 
   * @param {*} gamedayURL 
   * @param {*} gamedayIcon 
   * @param {*} gamedayIconH 
   * @param {*} stateMessage 
   */
  renderRoundGameMobile(g, dateString, tvurl, gamedayURL, gamedayIcon, gamedayIconH, stateMessage){
    return (
      <div data-toggle="collapse" data-target={"#T"+g.calendarEventID} className="container-fluid MobileGameBody">
        <div className="row">
          <div className="col-4 Date">
            <div>{this.renderQuickSeriesInfo(g, stateMessage, dateString, true)}</div>
          </div>
          <div className="col-6 TeamScore">
            {this.renderTeams(g, stateMessage, true)}
          </div>
          <div className="col-1">
            <img src={caret} className="MobileCaret"/>
          </div>
        </div>
        <div className="row collapse underrow" id={"T"+g.calendarEventID}>
          <div className="col-5">
            {this.renderMediaSection(tvurl, gamedayURL, stateMessage, gamedayIcon, gamedayIconH, g.gamePk, true)}
          </div>
          <div className="col-7 Extra">
            {this.renderExtraMobile(g, stateMessage)}
          </div>
          
        </div>
      </div>
    )
  }

  /**
   * Takes in game object, current game state, and a mobile
   * boolean.
   * Returns the team matchup element with links to each team
   * and scores (if the game is live or finished).
   * @param {*} g 
   * @param {*} stateMessage 
   * @param {*} mobile 
   */
  renderTeams(g, stateMessage, mobile){
    // Receive the names of the teams, and the urls to their sites (if available)
    var homeName = g.teams.home.team.teamName;
    var awayName = g.teams.away.team.teamName;
    var homeURL = "https://www.mlb.com/"+homeName.toLowerCase().replace(/ /g,'');
    var awayURL = "https://www.mlb.com/"+awayName.toLowerCase().replace(/ /g,'');
    if(homeName === "AL Champion" ||  homeName ==="NL Champion"){
        homeName = g.teams.home.team.abbreviation;
        homeURL = "https://www.mlb.com/";
    }
    if(awayName === "AL Champion" || awayName === "NL Champion"){
        awayName = g.teams.away.team.abbreviation;
        awayURL = "https://www.mlb.com/";
    }

    // If the game is yet to happen, display teams without scores.
    if(stateMessage === "Preview"){
      // If the screen is mobile size
      if(mobile){
        return (
          <div>
            <div className="TeamScore"><a href={awayURL} target="_blank"><img src={this.props.awayImageURL} className="TinyLogo"/>{awayName}</a></div>
            <div>{"@ "}<a href={homeURL} target="_blank"><img src={this.props.homeImageURL} className="TinyLogo"/>{homeName}</a></div>
          </div>
        )
      }
      // If the screen is desktop size
      return (
        <span className="TeamScore"><a href={awayURL} target="_blank"><img src={this.props.awayImageURL} className="TinyLogo"/>{awayName}</a>{" @ "}<a href={homeURL} target="_blank"><img src={this.props.homeImageURL} className="TinyLogo"/>{homeName}</a></span>
      )
    } else {
      // If the game is happening or happened, display the teams AND scores.
      var awayScore = g.teams.away.score;
      var homeScore = g.teams.home.score;
      // If the screen is mobile size
      if(mobile){
        return (
          <div>
            <div className="TeamScore"><a href={awayURL} target="_blank"><img src={this.props.awayImageURL} className="TinyLogo"/>{awayName}</a>{" "+awayScore}</div>
            <div>{"@ "}<a href={homeURL} target="_blank"><img src={this.props.homeImageURL} className="TinyLogo"/>{homeName}</a>{" " + homeScore}</div>
          </div>
        )
      }
      // If the screen is desktop size
      return (
        <span className="TeamScore"><a href={awayURL} target="_blank"><img src={this.props.awayImageURL} className="TinyLogo"/>{awayName}</a>{" " + awayScore + " @ "}<a href={homeURL} target="_blank"><img src={this.props.homeImageURL} className="TinyLogo"/>{homeName}</a>{ " " + homeScore}</span>
      )
    }
  }

  /**
   * Takes in game object and current state.
   * Returns "FINAL", "TBD", or the date of the game to show status.
   * @param {*} g 
   * @param {*} stateMessage 
   */
  renderStatus(g, stateMessage){
    var text = "FINAL";
    var date = new Date(g.gameDate);
    if(stateMessage === "Live"){
      text = g.linescore.inningHalf.substring(0,3) + " " + g.linescore.currentInning;
    } else if(date.getHours() === 23 && date.getMinutes() ===33){
      text = "TBD"
    } else if(stateMessage !== "Final"){
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var minuteOffset = "";
      var ampm = "AM";
      if(hours > 12){
        hours -= 12;
        ampm = "PM";
      }
      if(minutes< 10){
        minuteOffset = "0";
      }
      text = hours + ":" + minuteOffset + minutes + " " + ampm;
    }
    return (
      <span>{text}</span>
    )
  }

  /**
   * Takes in the game object and state.
   * If the game is done, display winner, loser, and save(if applicable).
   * If the game hasn't started, show probable pitchers.
   * TODO: SHOW AT-BAT AND PITCHER IF THE GAME IS LIVE
   * @param {*} g 
   * @param {*} stateMessage 
   */
  renderExtra(g, stateMessage){
    // If the game has finished, display the winner, loser, and (maybe) save.
    if(stateMessage === "Wrap"){
      var info = g.decisions;
      // Retrieve urls for the winner and loser and save
      var wurl =  "http://m.mlb.com/player/"+info.winner.id+"/"+info.winner.fullName.toLowerCase().replace(/ /g,'-');
      var lurl =  "http://m.mlb.com/player/"+info.loser.id+"/"+info.loser.fullName.toLowerCase().replace(/ /g,'-');
      if(info.save === undefined){
        return (
          <span>{"W: "}<a href={wurl}>{info.winner.initLastName}</a>{" L: "}<a href={lurl}>{info.loser.initLastName}</a></span>
        )
      } else {
        var surl =  "http://m.mlb.com/player/"+info.save.id+"/"+info.save.fullName.toLowerCase().replace(/ /g,'-');
        return (
          <span>{"W: "}<a href={wurl}>{info.winner.initLastName}</a>{" L: "}<a href={lurl}>{info.loser.initLastName}</a>{" S: "}<a href={surl}>{info.save.initLastName}</a></span>
        )
      }
    } else if(stateMessage === "Gameday"){
      //If the game is live, display at-bat and pitcher
      //TODO: Find and implement data
      return (
          <span></span>
      )  
    } else {
      //If the game has yet to start, find the probably pitchers, their urls, and then display.
      var homeName = g.teams.home.team.abbreviation;
      var awayName = g.teams.away.team.abbreviation;
      var homeppitcher = g.teams.home.probablePitcher;
      var awayppitcher = g.teams.away.probablePitcher;
      var awayPitcherText = "TBD";
      var homePitcherText = "TBD";
      var awayPitcherURL = "http://www.mlb.com/";
      var homePitcherURL = "http://www.mlb.com/";
      if(homeppitcher !== undefined){
        homePitcherText = homeppitcher.initLastName;
        homePitcherURL = "http://m.mlb.com/player/"+homeppitcher.id+"/"+homeppitcher.fullName.toLowerCase().replace(/ /g,'-');
      }
      if(awayppitcher !== undefined){
        awayPitcherText = awayppitcher.initLastName;
        awayPitcherURL = "http://m.mlb.com/player/"+awayppitcher.id+"/"+awayppitcher.fullName.toLowerCase().replace(/ /g,'-');
      }
      return (
          <span>{homeName + ": "}<a href={homePitcherURL}>{homePitcherText}</a> {"   " + awayName + ": "} <a href={awayPitcherURL}>{awayPitcherText}</a></span>
      )
    }
  }

  /**
   * Take in g and state.
   * See "renderExtra()" function above for description
   * on functionality.
   * Renders for mobile-friendly screens.
   * @param {*} g 
   * @param {*} stateMessage 
   */
  renderExtraMobile(g, stateMessage){
    if(stateMessage === "Wrap"){
      var info = g.decisions;
      var wurl =  "http://m.mlb.com/player/"+info.winner.id+"/"+info.winner.fullName.toLowerCase().replace(/ /g,'-');
      var lurl =  "http://m.mlb.com/player/"+info.loser.id+"/"+info.loser.fullName.toLowerCase().replace(/ /g,'-');
      if(info.save === undefined){
        return (
          <div>
          <div>{"W: "}<a href={wurl}>{info.winner.initLastName}</a></div>
          <div>{"L: "}<a href={lurl}>{info.loser.initLastName}</a></div>
          </div>
        )
      } else {
        var surl =  "http://m.mlb.com/player/"+info.save.id+"/"+info.save.fullName.toLowerCase().replace(/ /g,'-');
        return (
          <div>
          <div>{"W: "}<a href={wurl}>{info.winner.initLastName}</a></div>
          <div>{"L: "}<a href={lurl}>{info.loser.initLastName}</a></div>
          <div>{"S: "}<a href={surl}>{info.save.initLastName}</a></div>
          </div>
        )
      }
    } else if(stateMessage === "Gameday"){
      return (
          <span>AB, P</span>
      )  
    } else {
      var homeName = g.teams.home.team.abbreviation;
      var awayName = g.teams.away.team.abbreviation;
      var homeppitcher = g.teams.home.probablePitcher;
      var awayppitcher = g.teams.away.probablePitcher;
      var awayPitcherText = "TBD";
      var homePitcherText = "TBD";
      var awayPitcherURL = "http://www.mlb.com/";
      var homePitcherURL = "http://www.mlb.com/";
      if(homeppitcher !== undefined){
        homePitcherText = homeppitcher.initLastName;
        homePitcherURL = "http://m.mlb.com/player/"+homeppitcher.id+"/"+homeppitcher.fullName.toLowerCase().replace(/ /g,'-');
      }
      if(awayppitcher !== undefined){
        awayPitcherText = awayppitcher.initLastName;
        awayPitcherURL = "http://m.mlb.com/player/"+awayppitcher.id+"/"+awayppitcher.fullName.toLowerCase().replace(/ /g,'-');
      }
      return (
        <div>
          <div>{homeName + ": "}<a href={homePitcherURL}>{homePitcherText}</a></div>
          <div>{awayName + ": "} <a href={awayPitcherURL}>{awayPitcherText}</a></div>
        </div>
      )
    }
  }

  /**
   * Take in urls, icons, and the state to display links to wrap videos,
   * previews, and the network icon. Appears on right side of game component.
   * @param {*} networkURL 
   * @param {*} gamedayURL 
   * @param {*} stateMessage 
   * @param {*} gicon 
   * @param {*} giconh 
   * @param {*} gameid 
   * @param {*} mobile 
   */
  renderMediaSection(networkURL, gamedayURL, stateMessage, gicon, giconh, gameid, mobile){
    var networkClass = "NetworkIcon";
    if(networkURL === DataService.urls.FOXFS1){
      networkClass = "NetworkIconLarge";
    }
    var sectionClass = "MediaSection";
    if(mobile){
      sectionClass = "MediaSectionMobile"
    }
    return(
      <div className={sectionClass}>
        <img src={networkURL} className={networkClass}/>
        <a href={gamedayURL} target="_blank"><img src={gicon} className="GamedayIcon" onMouseOver={e => (e.currentTarget.src = giconh)} onMouseOut={e => (e.currentTarget.src = gicon)}/></a>
        {this.renderMLBTV(stateMessage, gameid)}
        {this.renderWrapVideo(stateMessage, gameid)}
      </div>
    )
  }

  /**
   * Takes in state and gameday id.
   * Renders the MLBTV icon and link if the game is live.
   * @param {*} stateMessage 
   * @param {*} id 
   */
  renderMLBTV(stateMessage, id){
    if(stateMessage === "Gameday"){
      var url = "https://www.mlb.com/tv/g"+id; 
      return(
        <a href={url} target="_blank"><img src={tv} className="GamedayIcon" onMouseOver={e => (e.currentTarget.src = tvh)} onMouseOut={e => (e.currentTarget.src = tv)}/></a>
      )
    } else {
      return(<span></span>)
    }
  }
  
  /**
   * Takes in state and id.
   * Returns a wrap video link and icon if the game has finished.
   * @param {*} stateMessage 
   * @param {*} id 
   */
  renderWrapVideo(stateMessage, id){
    if(stateMessage === "Wrap"){
      var url = "https://www.mlb.com/gameday/"+id+"/final/video"; 
      return(
        <a href={url} target="_blank"><img src={camera} className="GamedayIcon" onMouseOver={e => (e.currentTarget.src = camerah)} onMouseOut={e => (e.currentTarget.src = camera)}/></a>
      )
    } else {
      return(<span></span>)
    }
  }

  /**
   * Render the game.
   */
  render() {
    return (
      <div>
        {this.renderRoundGame()}
      </div>
    );
  }
}

export default Game;
