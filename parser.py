import csv
import json

player_data = {}

with open('./server/data/phs_2021_1.csv', mode='r', encoding='utf-8-sig') as csvfile:
  reader = csv.DictReader(csvfile)
  for row in reader:
    # check player name
    if row['player_name'].upper() not in player_data.keys():
      player_data[row['player_name'].upper()] = {
        row['esports_match_id']: {
          'date': row['start_time'],
          row["map_name"]: {
            row['hero_name']: {
              row['stat_name']: int(float(row['stat_amount']))
            }
          }
        }
      }

    # check match id
    if row['esports_match_id'] not in player_data[row['player_name'].upper()].keys():
      player_data[row['player_name'].upper()].update({
        row['esports_match_id']: {
          'date': row['start_time'],
          row["map_name"]: {
            row['hero_name']: {
              row['stat_name']: int(float(row['stat_amount']))
            }
          }
        }
      })

    # check map
    if row['map_name'] not in player_data[row['player_name'].upper()][row['esports_match_id']].keys():
      player_data[row['player_name'].upper()][row['esports_match_id']].update({
        row["map_name"]: {
          row['hero_name']: {
            row['stat_name']: int(float(row['stat_amount']))
          }
        }
      })

    # check hero
    if row['hero_name'] not in player_data[row['player_name'].upper()][row['esports_match_id']][row['map_name']].keys():
      player_data[row['player_name'].upper()][row['esports_match_id']][row['map_name']].update({
        row['hero_name']: {
          row['stat_name']: int(float(row['stat_amount']))
        }
      })

    # check stat
    if row['stat_name'] not in player_data[row['player_name'].upper()][row['esports_match_id']][row['map_name']][row['hero_name']].keys():
      player_data[row['player_name'].upper()][row['esports_match_id']][row['map_name']][row['hero_name']].update({
        row['stat_name']: int(float(row['stat_amount']))
      })

for player, games in player_data.items():
  for game, maps in games.items():
    assist_totals = 0
    damage_totals = 0
    death_totals = 0
    elim_totals = 0
    final_blow_totals = 0
    healing_totals = 0
    for map_name, heros in maps.items():
      # skip date object
      if not isinstance(heros, str):
        for hero_name, stats in heros.items():
          if hero_name == "All Heroes":
            assist_totals = assist_totals + stats.get("Assists", 0)
            damage_totals = damage_totals + stats.get("Hero Damage Done", 0)
            death_totals = death_totals + stats.get("Deaths", 0)
            elim_totals = elim_totals + stats.get("Eliminations", 0)
            final_blow_totals = final_blow_totals + stats.get("Final Blows", 0)
            healing_totals = healing_totals + stats.get("Healing Done", 0)
    player_data[player][game]["Match Totals"] = {
      "Assists": assist_totals,
      "Hero Damage Done": damage_totals,
      "Deaths": death_totals,
      "Eliminations": elim_totals,
      "Final Blows": final_blow_totals,
      "Healing Done": healing_totals
    }

with open('player_stats.json', 'w') as fp:
  json.dump(player_data, fp)