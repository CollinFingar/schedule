import React, { Component } from 'react';
import './Schedule.css';
import DataService from './DataService'
import Game from './Game';

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
            <div className="d-none d-sm-block">
              <div className="RoundTitle">
                <img src={team1ImageURL} className="RoundTeamLogo"></img>
                <span>{seriesName}</span>
                <img src={team2ImageURL} className="RoundTeamLogo"></img>
              </div>
              <div className="Overlay">VS</div>
              <div className="CurrentSeriesStatus">{currentStatus}</div>
            </div>
            <div className="d-sm-none">
              <div className="RoundTitleMobile">
                <img src={team1ImageURL} className="RoundTeamLogoMobile"></img>
                <span>{seriesName}</span>
                <img src={team2ImageURL} className="RoundTeamLogoMobile"></img>
              </div>
              <div className="OverlayMobile">VS</div>
              <div className="CurrentSeriesStatusMobile">{currentStatus}</div>
            </div>
            <div>
            {series.games.map((g) => {
              return (
                <div>
                  
                  <div className="GameObject d-lg-none">
                    <Game mobile={true} gameData={g}></Game>
                  </div>
                  <div className="GameObject d-none d-lg-block">
                    <Game mobile={false} gameData={g}></Game>
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
