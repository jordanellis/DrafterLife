import json

f = open("./data/league.json")
league = json.load(f)
f.close()
f = open("./data/weeknumber.json")
week_number = json.load(f).get("week", 0)
f.close()
f = open("./data/player_stats.json")
player_stats = json.load(f)
f.close()
f = open("./data/schedule.json")
schedule = json.load(f)
f.close()

owner_total_score_map = {}
for week in schedule["weeks"]:
  if week["week"] == str(week_number):
    week["final_rosters"] = {}
    for team in league["teams"]:
      team_total = 0
      players = team["players"]["tanks"] + team["players"]["dps"] + team["players"]["supports"] + team["players"]["flex"]
      week["final_rosters"].update({
        team["owner"]: team["players"]
      })
      for player in players:
        team_total = team_total + player_stats[player]["weekly_player_scores"][str(week_number)]
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
    for team in league["teams"]:
      team["totalPoints"] = team["totalPoints"] + owner_total_score_map[team["owner"]]
      if win_loss_map[team["owner"]]:
        team["wins"] = team["wins"] + 1
      else:
        team["losses"] = team["losses"] + 1
    
    with open('data/league.json', 'w') as fp:
      json.dump(league, fp)

    with open('data/schedule.json', 'w') as fp:
      json.dump(schedule, fp)
  else:
    print("Must have been a BYE")

with open('data/weeknumber.json', 'w') as fp:
  json.dump({"week": week_number+1}, fp)

# also need to lock in their teams for the week (separate script?)