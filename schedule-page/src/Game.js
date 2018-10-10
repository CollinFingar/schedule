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

class Game extends Component {

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
    if(stateMessage === "Live"){
      gamedayIcon = ball;
      gamedayIconH = ballh;
      stateMessage = "Gameday"
    } else if(stateMessage === "Final"){
      stateMessage = "Wrap"
    } else {
      stateMessage = "Preview"
    }

    if(mobile){
      return(
        <div >{this.renderRoundGameMobile(g, dateString, tvurl, gamedayURL, gamedayIcon, gamedayIconH, stateMessage)}</div>
      )
      
    }
    return (
      <div>
        <div className="row Game">
          <div className="col-2 Date">
           <div className="Date">{dateString + " "}<span className="Time">{this.renderStatus(g, g.status.abstractGameState)}</span></div>
          </div>
          <div className="col-3 TeamScore">
            {this.renderTeams(g, stateMessage)}
          </div>
          <div className="col-5 Extra">
            {this.renderExtra(g, stateMessage)}
          </div>
          <div className="col-2">
            {this.renderMediaSection(tvurl, gamedayURL, stateMessage, gamedayIcon, gamedayIconH, g.gamePk, false)}
          </div>
        </div>
      </div>
    )
  }
  renderRoundGameMobile(g, dateString, tvurl, gamedayURL, gamedayIcon, gamedayIconH, stateMessage){
    return (
      <div data-toggle="collapse" data-target={"#T"+g.calendarEventID} className="container-fluid MobileGameBody">
        <div className="row">
          <div className="col-4 Date">
           <div className="Date">{dateString + " "}<span className="Time">{this.renderStatus(g, g.status.abstractGameState)}</span></div>
          </div>
          <div className="col-6 TeamScore">
            {this.renderTeams(g, stateMessage)}
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
  renderTeams(g, stateMessage){
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
    
    if(stateMessage === "Preview"){
      return (
        <span className="TeamScore"><a href={awayURL} target="_blank">{awayName}</a>{" @ "}<a href={homeURL} target="_blank">{homeName}</a></span>
      )
    } else {
      var awayScore = g.teams.away.score;
      var homeScore = g.teams.home.score;
      return (
        <span className="TeamScore"><a href={awayURL} target="_blank">{awayName}</a>{" " + awayScore + " @ "}<a href={homeURL} target="_blank">{homeName}</a>{ " " + homeScore}</span>
      )
    }
  }
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
  renderExtra(g, stateMessage){
      if(stateMessage === "Wrap"){
        var info = g.decisions;
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
            <span>{homeName + ": "}<a href={homePitcherURL}>{homePitcherText}</a> {"   " + awayName + ": "} <a href={awayPitcherURL}>{awayPitcherText}</a></span>
        )
      }
  }
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
  getCurrentSeriesStatus(s){
    var currentDate = new Date();
    for(var i = this.props.series[s].games.length - 1; i >= 0; i--){
      var gameDate = new Date(this.props.series[s].games[i].gameDate);
      if(gameDate < currentDate){
        return this.props.series[s].games[i].seriesStatus.result;
        break;
      }
    }
  }
  render() {
    return (
      <div>
        {this.renderRoundGame()}
      </div>
    );
  }
}

export default Game;
