class DataService {
    constructor() {
      this.urls = {
        Data: "http://statsapi.mlb.com/api/v1/schedule/postseason/series?sportId=1&season=2018&hydrate=team,broadcasts(all),seriesStatus(useOverride=true),decisions,person,probablePitcher,linescore(matchup)",
        Astros: "https://www.mlbstatic.com/team-logos/117.svg",
        Indians: "https://www.mlbstatic.com/team-logos/114.svg",
        Dodgers: "https://www.mlbstatic.com/team-logos/119.svg",
        Braves: "https://www.mlbstatic.com/team-logos/144.svg",
        RedSox: "https://www.mlbstatic.com/team-logos/111.svg",
        Yankees: "https://www.mlbstatic.com/team-logos/147.svg",
        Brewers: "https://www.mlbstatic.com/team-logos/158.svg",
        Rockies: "https://www.mlbstatic.com/team-logos/115.svg",
        Cubs: "https://www.mlbstatic.com/team-logos/112.svg",
        Athletics: "https://www.mlbstatic.com/team-logos/133.svg",
        National: "https://www.mlbstatic.com/team-logos/160.svg",
        American: "https://www.mlbstatic.com/team-logos/159.svg",
        ESPN: "https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.2.0/images/tv_station/2018/142.svg",
        TBS: "https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.2.0/images/tv_station/2018/129.svg",
        FS1: "https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.2.0/images/tv_station/2018/4725.svg",
        MLBNetwork: "https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.2.0/images/tv_station/2018/2661.svg",
        FOXFS1: "https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.2.0/images/tv_station/2018/5035.svg",
        FOX: "https://prod-gameday.mlbstatic.com/responsive-gameday-assets/1.2.0/images/tv_station/2018/144.svg"
      }
      this.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      this.weekDays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
      this.seriesMap = {
        "NLTB": "NL Tiebreaker",
        "NLWC": "NL Wild Card",
        "ALWC": "AL Wild Card",
        "NLDS": "NL Division Series",
        "ALDS": "AL Division Series",
        "NLCS": "NL Championship Series",
        "ALCS": "AL Championship Series",
        "WS": "World Series"
      }
    }
    getTeamImageURL(ID, name){
      if(name === "AL Champion" || name === "NYY/HOU" || name === "HOU/BOS"){
        return this.urls.American;
      } else if(name === "NL Champion"){
        return this.urls.National;
      }
      return "https://www.mlbstatic.com/team-logos/"+ID+".svg";
    }
    getTVURL(broadcastArray){
      for(var i = 0; i < broadcastArray.length; i++){
        var bObject = broadcastArray[i];
        if(bObject.type === "TV" && bObject.language === "en"){
          if(bObject.name === "ESPN"){
            return this.urls.ESPN;
          } else if(bObject.name === "FOX / FS1"){
            return this.urls.FOXFS1;
          } else if(bObject.name === "TBS"){
            return this.urls.TBS;
          } else if(bObject.name === "FS1"){
            return this.urls.FS1;
          } else if(bObject.name === "FOX"){
            return this.urls.FOX;
          } else if(bObject.name === "MLBN"){
            return this.urls.MLBNetwork;
          }
        }

      }
      return this.urls.MLBNetwork;
    }
    getGamedayURL(id, state){
      //Preview, Live, Final
      if(state === "Live"){
        return "https://www.mlb.com/gameday/"+id
      } else if(state === "Final"){
        return "https://www.mlb.com/gameday/"+id+"/final/wrap"
      } else if(state === "Preview"){
        return "https://www.mlb.com/gameday/"+id+"/preview"
      }
    }
  }
  
  export default (new DataService);