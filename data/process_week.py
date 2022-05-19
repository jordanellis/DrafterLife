import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(f"mongodb+srv://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASS')}@cluster0.jh0gw.mongodb.net/drafterlife")
db = client.drafterlife
week_data = list(db.weeks.find({}))

week_number = list(db.weeknumber.find({}, {'_id': False}))[0].get("week", 0)
player_stats = list(db['player-stats'].find({}, {'_id': False}))
league = list(db.league.find({}, {'_id': False}))
schedule = list(db.schedule.find({}, {'_id': False}))

owner_total_score_map = {}
for week in schedule:
  if week["week"] == str(week_number):
    week["final_rosters"] = {}
    for team in league:
      team_total = 0
      players = team["players"]["tanks"] + team["players"]["dps"] + team["players"]["supports"] + team["players"]["flex"]
      week["final_rosters"].update({
        team["owner"]: team["players"]
      })
      for player in players:
        if player in player_stats[0]:
          team_total = team_total + player_stats[0][player]["weekly_player_scores"][str(week_number)]
      owner_total_score_map[team["owner"]] = team_total
    win_loss_map = {}
    for match in week["matches"]:
      if owner_total_score_map[match[0]] > owner_total_score_map[match[1]]:
        win_loss_map[match[0]] = True
        win_loss_map[match[1]] = False
      else:
        win_loss_map[match[0]] = False
        win_loss_map[match[1]] = True
    print(owner_total_score_map)
    print("")
    print(win_loss_map)
    for team in league:
      team["totalPoints"] = team["totalPoints"] + owner_total_score_map[team["owner"]]
      if win_loss_map[team["owner"]]:
        team["wins"] = team["wins"] + 1
      else:
        team["losses"] = team["losses"] + 1
    
    for league_team in league:
      db.league.update_one(
        {"owner": league_team["owner"]},
        {
          "$set": {
            "wins": league_team["wins"],
            "losses": league_team["losses"],
            "totalPoints": league_team["totalPoints"],
          }
        }
      )

    db.schedule.update_one(
      {"week": str(week_number)},
      {
        "$set": {"final_rosters": week["final_rosters"]}
      }
    )
  else:
    print("Must have been a BYE")

db.weeknumber.update_one(
  {"week": week_number},
  {"$set": {"week": week_number+1}}
)
