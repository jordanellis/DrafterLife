import os
import csv
import json
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(f"mongodb+srv://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PASS')}@cluster0.jh0gw.mongodb.net/drafterlife")
db = client.drafterlife
week_data = list(db.weeks.find({}))

player_data = {}

important_stats = [
  "Assists",
  "Hero Damage Done",
  "Deaths",
  "Eliminations",
  "Final Blows",
  "Healing Done",
  "Time Played"
]

def retrieve_match_week(match_time):
  datetime_time = datetime.strptime(match_time, "%Y-%m-%d %H:%M:%S")
  for week in week_data:
    start = datetime.strptime(week["start"], "%Y-%m-%d %H:%M:%S")
    stop = datetime.strptime(week["stop"], "%Y-%m-%d %H:%M:%S")
    if start <= datetime_time <= stop:
      return week["week"]

def retrieve_match_stage(match_time):
  datetime_time = datetime.strptime(match_time, "%Y-%m-%d %H:%M:%S")
  for week in week_data:
    start = datetime.strptime(week["start"], "%Y-%m-%d %H:%M:%S")
    stop = datetime.strptime(week["stop"], "%Y-%m-%d %H:%M:%S")
    if start <= datetime_time <= stop:
      return week["stage"]

with open('./data/phs_2021_1.csv', mode='r', encoding='utf-8-sig') as csvfile:
  reader = csv.DictReader(csvfile)
  for row in reader:
    if row['stat_name'] not in important_stats:
      continue

    # check player name
    if row['player_name'].upper() not in player_data.keys():
      player_data[row['player_name'].upper()] = {
        'matches': {
          row['esports_match_id']: {
            'date': row['start_time']+'.000Z',
            'week': retrieve_match_week(row['start_time']),
            'stage': retrieve_match_stage(row['start_time']),
            'maps':{
              row["map_name"]: {
                row['hero_name']: {
                  row['stat_name']: int(float(row['stat_amount']))
                }
              }
            }
          }
        }
      }

    # check match id
    if row['esports_match_id'] not in player_data[row['player_name'].upper()]['matches'].keys():
      player_data[row['player_name'].upper()]['matches'].update({
        row['esports_match_id']: {
          'date': row['start_time']+'.000Z',
          'week': retrieve_match_week(row['start_time']),
          'stage': retrieve_match_stage(row['start_time']),
          'maps':{
            row["map_name"]: {
              row['hero_name']: {
                row['stat_name']: int(float(row['stat_amount']))
              }
            }
          }
        }
      })

    # check map
    if row['map_name'] not in player_data[row['player_name'].upper()]['matches'][row['esports_match_id']]['maps'].keys():
      player_data[row['player_name'].upper()]['matches'][row['esports_match_id']]['maps'].update({
        row["map_name"]: {
          row['hero_name']: {
            row['stat_name']: int(float(row['stat_amount']))
          }
        }
      })

    # check hero
    if row['hero_name'] not in player_data[row['player_name'].upper()]['matches'][row['esports_match_id']]['maps'][row['map_name']].keys():
      player_data[row['player_name'].upper()]['matches'][row['esports_match_id']]['maps'][row['map_name']].update({
        row['hero_name']: {
          row['stat_name']: int(float(row['stat_amount']))
        }
      })

    # check stat
    if row['stat_name'] not in player_data[row['player_name'].upper()]['matches'][row['esports_match_id']]['maps'][row['map_name']][row['hero_name']].keys():
      player_data[row['player_name'].upper()]['matches'][row['esports_match_id']]['maps'][row['map_name']][row['hero_name']].update({
        row['stat_name']: int(float(row['stat_amount']))
      })


for player, player_items in player_data.items():
  total_matches = 0
  assist_player_totals = 0
  damage_player_totals = 0
  death_player_totals = 0
  elim_player_totals = 0
  final_blow_player_totals = 0
  healing_player_totals = 0
  time_played_player_totals = 0
  games = player_items['matches']
  for game, game_items in games.items():
    assist_totals = 0
    damage_totals = 0
    death_totals = 0
    elim_totals = 0
    final_blow_totals = 0
    healing_totals = 0
    time_played_totals = 0
    maps = game_items['maps']

    # calculate match totals
    for map_name, heros in maps.items():
      # skip date/week/etc objects
      if not isinstance(heros, str):
        for hero_name, stats in heros.items():
          if hero_name == "All Heroes":
            assist_totals = assist_totals + stats.get("Assists", 0)
            damage_totals = damage_totals + stats.get("Hero Damage Done", 0)
            death_totals = death_totals + stats.get("Deaths", 0)
            elim_totals = elim_totals + stats.get("Eliminations", 0)
            final_blow_totals = final_blow_totals + stats.get("Final Blows", 0)
            healing_totals = healing_totals + stats.get("Healing Done", 0)
            time_played_totals = time_played_totals + stats.get("Time Played", 0)
    player_data[player]['matches'][game]["totals"] = {
      "Assists": assist_totals,
      "Hero Damage Done": damage_totals,
      "Deaths": death_totals,
      "Eliminations": elim_totals,
      "Final Blows": final_blow_totals,
      "Healing Done": healing_totals,
      "Time Played": time_played_totals
    }

    total_matches = total_matches + 1
    assist_player_totals = assist_player_totals + assist_totals
    damage_player_totals = damage_player_totals + damage_totals
    death_player_totals = death_player_totals + death_totals
    elim_player_totals = elim_player_totals + elim_totals
    final_blow_player_totals = final_blow_player_totals + final_blow_totals
    healing_player_totals = healing_player_totals + healing_totals
    time_played_player_totals = time_played_player_totals + time_played_totals

    # calculate average per ten minutes per match
    ten_minutes_played = time_played_totals/600
    player_data[player]['matches'][game]["averages"] = {
      "Assists": assist_totals/ten_minutes_played,
      "Hero Damage Done": damage_totals/ten_minutes_played,
      "Deaths": death_totals/ten_minutes_played,
      "Eliminations": elim_totals/ten_minutes_played,
      "Final Blows": final_blow_totals/ten_minutes_played,
      "Healing Done": healing_totals/ten_minutes_played
    }

    # calculate player score for the match
    averages = player_data[player]['matches'][game]["averages"]
    score = averages["Eliminations"] - averages["Deaths"] + averages["Hero Damage Done"]/1000 + averages["Healing Done"]/1000
    player_data[player]['matches'][game]["score"] = score
  
  player_data[player]["totals"] = {
    "Total Matches": total_matches,
    "Assists": assist_player_totals,
    "Hero Damage Done": damage_player_totals,
    "Deaths": death_player_totals,
    "Eliminations": elim_player_totals,
    "Final Blows": final_blow_player_totals,
    "Healing Done": healing_player_totals,
    "Time Played": time_played_player_totals
  }

for player, player_items in player_data.items():
  games = player_items['matches']
  weekly_player_scores = {
    1:  [], 2:  [], 3:  [], 4:  [], 5:  [], 6:  [], 7:  [], 8:  [],
    9:  [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [],
    17: [], 18: [], 19: [], 20: [], 21: [], 22: [], 23: [], 24: []
  }
  # weekly_player_scores will be average of all week match scores
  for game, game_items in games.items():
    # exclude any matches not from tournament qualifiers
    if "Qualifiers" in game_items['stage']:
      week = game_items['week']
      curr_week_score = weekly_player_scores.get(week, [])
      curr_week_score.append(game_items['score'])
      weekly_player_scores.update({week: curr_week_score})
  
  total_player_score = 0
  for week in weekly_player_scores:
    week_score = weekly_player_scores.get(week, [])
    if len(week_score) > 0:
      weekly_player_scores.update({week: sum(week_score) / len(week_score)})
      total_player_score = total_player_score + sum(week_score)
    else:
      weekly_player_scores.update({week: 0})
  player_data[player]["total_player_score"] = total_player_score
  player_data[player]["weekly_player_scores"] = weekly_player_scores

with open('data/player_stats.json', 'w') as fp:
  json.dump(player_data, fp)