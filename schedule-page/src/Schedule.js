import React, { Component } from 'react';
import './Schedule.css';
import news from './icons/newspaper-solid.svg';
import newsh from './icons/newspaper-highlight.svg';
import ball from './icons/baseball-ball-solid.svg';
import ballh from './icons/baseball-ball-highlight.svg';
import tv from './icons/tv-solid.svg';
import tvh from './icons/tv-highlight.svg';
import camera from './icons/video-solid.svg';
import camerah from './icons/video-highlight.svg';

import DataService from './DataService'

class Schedule extends Component {

  renderList(){
    if(this.props.series){
      if(this.props.filter === "Date"){
        return (
          <div>
            {this.renderDateList()}
          </div>
        )
      } else {
        return (
          <div>
            {this.renderRoundList()}
          </div>
        )
      }
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
  renderDateList(){
    return(
          <div>
            {this.props.seriesOrder.map((s) =>
                <div>{this.props.series[s].series.id}</div>
  
            )}
          </div>
    )
    
  }
  renderRoundList(){
    return (
      <div>
      {this.props.seriesOrder.map((s) => {
        var seriesID = this.props.series[s].series.id;
        var series = this.props.series[s];
        if(seriesID.length > 4){
          seriesID = seriesID.substring(0,4);
        }
        var seriesName = DataService.seriesMap[seriesID]
        var team1ImageURL = DataService.getTeamImageURL(series.games[0].teams.away.team.id, series.games[0].teams.away.team.name)
        var team2ImageURL = DataService.getTeamImageURL(series.games[0].teams.home.team.id, series.games[0].teams.home.team.name)
        var currentStatus = this.getCurrentSeriesStatus(s);
        return (
          <div>
            <div className="RoundTitle">
              <img src={team1ImageURL} className="RoundTeamLogo"></img>
              <span>{seriesName}</span>
              <img src={team2ImageURL} className="RoundTeamLogo"></img>
            </div>
            <div className="Overlay">VS</div>
            <div className="CurrentSeriesStatus">{currentStatus}</div>
            <div>
            {series.games.map((g) => {
              return (
                <div>
                  <div className="container GameObject d-lg-none">
                    {this.renderRoundGame(g, true)}
                  </div>
                  <div className="container GameObject d-none d-lg-block">
                    {this.renderRoundGame(g, false)}
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        )
      })}
    </div>
    )
  }
  renderRoundGame(g, mobile){
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
        <div>{this.renderRoundGameMobile(g)}</div>
      )
      
    }
    return (
      <div>
        <div className="row Game">
          <div className="col-1">
           {dateString}
          </div>
          <div className="col-3 TeamScore">
            {this.renderTeams(g, stateMessage)}
          </div>
          <div className="col-1">
            {this.renderStatus(g, g.status.abstractGameState)}
          </div>
          <div className="col-4">
            {g.seriesGameNumber}
          </div>
          <div className="col-3">
            {this.renderMediaSection(tvurl, gamedayURL, stateMessage, gamedayIcon, gamedayIconH, g.gamePk)}
          </div>
        </div>
      </div>
    )
  }
  renderRoundGameMobile(g){
    return (
      <div data-toggle="collapse" data-target={"#T"+g.calendarEventID}>
        <div className="row">
          <div className="col">
           {g.seriesGameNumber}
          </div>
          <div className="col">
          {g.seriesGameNumber}
          </div>
          <div className="col">
          {g.seriesGameNumber}
          </div>
        </div>
        <div className="row collapse" id={"T"+g.calendarEventID}>
          <div className="col">
           Expanded
          </div>
        </div>
      </div>
    )
  }
  renderTeams(g, stateMessage){
    var homeName = g.teams.home.team.teamName;
    var awayName = g.teams.home.team.teamName;

    var homeURL = "https://www.mlb.com/"+homeName.toLowerCase();
    var awayURL = "https://www.mlb.com/"+awayName.toLowerCase();
    if(homeName === "NYY/HOU" || homeName === "HOU/BOS" || homeName === "AL Champion" || homeName === "NL Champion"){
      homeURL = "https://www.mlb.com/";
    }
    if(awayName === "NYY/HOU" || awayName === "HOU/BOS" || awayName === "AL Champion" || awayName === "NL Champion"){
      awayURL = "https://www.mlb.com/";
    }
    if(stateMessage === "Preview"){
      return (
        <span className="TeamScore"><a href={awayURL} target="_blank">{g.teams.away.team.teamName + " "}</a>@<a href={homeURL} target="_blank">{" " + g.teams.home.team.teamName}</a></span>
      )
    } else {
      var awayScore = g.teams.away.score;
      var homeScore = g.teams.home.score;
      return (
        <span className="TeamScore"><a href={awayURL} target="_blank">{g.teams.away.team.teamName}</a>{" " + awayScore + " @ "}<a href={homeURL} target="_blank">{g.teams.home.team.teamName}</a>{ " " + homeScore}</span>
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
  renderMediaSection(networkURL, gamedayURL, stateMessage, gicon, giconh, gameid){
    return(
      <div className="MediaSection">
        <img src={networkURL} className="NetworkIcon"/>
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
      <div className="Schedule container">
        {this.renderList()}
        
        
      </div>
    );
  }
}

export default Schedule;
