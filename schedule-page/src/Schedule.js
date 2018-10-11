import React, { Component } from 'react';
import './Schedule.css';
import DataService from './DataService'
import Game from './Game';

/**
 * This component lists Game components in the order designated
 * through props from the parent.
 * Data for each game is passed to the child Game components
 * through props.
 */
class Schedule extends Component {
  /**
   * Called by the render() function.
   * Determines whether to render the list filtered by date or
   * series.
   */
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

  /**
   * This renders the scheduled list altered for dates.
   * The Live / Upcoming Games are shown first for quick searching.
   * The Past Games are shown behind.
   */
  renderDateList(){
    var upcoming = this.props.dates.slice(this.props.closestDateIndex);
    var previous = this.props.dates.slice(0, this.props.closestDateIndex);
    return(
          <div>
            <div className="DateSectionTitle">
              <span className="Text">Live / Upcoming Games</span>
            </div>
            <div>
              {upcoming.map((d) =>{
                return(
                  <div>
                    {this.renderDateGames(d)}
                  </div>
                )
              })}
            </div>
            <div className="DateSectionTitle">
              <span className="Text">Past Games</span>
            </div>
            <div>
              {previous.map((d) =>{
                return(
                  <div>
                    {this.renderDateGames(d)}
                  </div>
                )
              })}
            </div>
          </div>
    )
  }

  /**
   * This renders each game in the date-filtered list.
   * The param "d" is used to identify which game from the game list
   * is being referenced.
   * The Game child component is passed props and rendered for mobile
   * and desktop.
   * @param {string} d 
   */
  renderDateGames(d){
    var splitDate = d.split(",");
    var fullDateString = DataService.fullWeekDays[splitDate[0]]+", " + splitDate[1];
    var gameIndicies = this.props.datesOrder[d];
    return(
      <div>
        <div className="DateHeader">{fullDateString}</div>
        <div>
          {gameIndicies.map((gIndex) =>{
            var g = this.props.games[gIndex].data;
            var awayImageURL = DataService.getTeamImageURL(g.teams.away.team.id, g.teams.away.team.name)
            var homeImageURL = DataService.getTeamImageURL(g.teams.home.team.id, g.teams.home.team.name)
            return (
            <div>
              <div className="GameObject d-lg-none">
                <Game mobile={true} gameData={g} homeImageURL={homeImageURL} awayImageURL={awayImageURL} renderStyle={"Date"}></Game>
              </div>
              <div className="GameObject d-none d-lg-block">
                <Game mobile={false} gameData={g}  homeImageURL={homeImageURL} awayImageURL={awayImageURL} renderStyle={"Date"}></Game>
              </div>
            </div>
            )
            
          })}
        </div>
      </div>
    )
  }

  /**
   * This series-filtered list is rendered using the series structure
   * returned from the server.
   * Each series gets a title displaying both teams and the series title.
   * The Game child component is passed props and rendered for mobile
   * and desktop.
   */
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
        var awayImageURL = DataService.getTeamImageURL(series.games[0].teams.away.team.id, series.games[0].teams.away.team.name)
        var homeImageURL = DataService.getTeamImageURL(series.games[0].teams.home.team.id, series.games[0].teams.home.team.name)
        var currentStatusObj = this.getCurrentSeriesStatus(s);
        var currentStatus = "";
        if(currentStatusObj !== undefined){
          currentStatus = currentStatusObj.result;
        }
        return (
          <div>
            <div className="d-none d-sm-block">
              <div className="RoundTitle">
                <img src={awayImageURL} className="RoundTeamLogo"></img>
                <span>{seriesName}</span>
                <img src={homeImageURL} className="RoundTeamLogo"></img>
              </div>
              <div className="Overlay">VS</div>
              <div className="CurrentSeriesStatus">{currentStatus}</div>
            </div>
            <div className="d-sm-none">
              <div className="RoundTitleMobile">
                <img src={awayImageURL} className="RoundTeamLogoMobile"></img>
                <span>{seriesName}</span>
                <img src={homeImageURL} className="RoundTeamLogoMobile"></img>
              </div>
              <div className="OverlayMobile">VS</div>
              <div className="CurrentSeriesStatusMobile">{currentStatus}</div>
            </div>
            <div>
            {series.games.map((g) => {
              var awayImageURL = DataService.getTeamImageURL(g.teams.away.team.id, g.teams.away.team.name)
              var homeImageURL = DataService.getTeamImageURL(g.teams.home.team.id, g.teams.home.team.name)
              return (
                <div>
                  
                  <div className="GameObject d-lg-none">
                    <Game mobile={true} gameData={g} homeImageURL={homeImageURL} awayImageURL={awayImageURL} renderStyle={"Round"}></Game>
                  </div>
                  <div className="GameObject d-none d-lg-block">
                    <Game mobile={false} gameData={g} homeImageURL={homeImageURL} awayImageURL={awayImageURL} renderStyle={"Round"}></Game>
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

  /**
   * Returns the series status and a url for the winning team for
   * future linkage in the text.
   * @param {seriesObject} s 
   */
  getCurrentSeriesStatus(s){
    var currentDate = new Date();
    for(var i = this.props.series[s].games.length - 1; i >= 0; i--){
      var gameDate = new Date(this.props.series[s].games[i].gameDate);
      if(gameDate < currentDate){
        var result = {
              result: this.props.series[s].games[i].seriesStatus.result,
                team: this.props.series[s].games[i].seriesStatus.winningTeam
                };
        return result;
        break;
      }
    }
  }

  /**
   * Renders the list
   */
  render() {
    return (
      <div className="Schedule container">
        {this.renderList()}
      </div>
    );
  }
}

export default Schedule;
