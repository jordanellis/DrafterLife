import csv
import json

player_data = {}
i = 1

with open('./server/data/phs_2021_1.csv', mode='r', encoding='utf-8-sig') as csvfile:
  reader = csv.DictReader(csvfile)
  for row in reader:
    if 'All Heroes' in row['hero_name']:
      continue

    # check player name
    if row['player_name'] not in player_data.keys():
      player_data[row['player_name']] = {
        row['esports_match_id']: {
          'date': row['start_time'],
          row['hero_name']: {
            row['stat_name']: row['stat_amount']
          }
        }
      }

    # check match id
    if row['esports_match_id'] not in player_data[row['player_name']].keys():
      player_data[row['player_name']].update({
        row['esports_match_id']: {
          'date': row['start_time'],
          row['hero_name']: {
            row['stat_name']: row['stat_amount']
          }
        }
      })

    # check hero
    if row['hero_name'] not in player_data[row['player_name']][row['esports_match_id']].keys():
      player_data[row['player_name']][row['esports_match_id']].update({
        row['hero_name']: {
          row['stat_name']: row['stat_amount']
        }
      })

    # check stat
    if row['stat_name'] not in player_data[row['player_name']][row['esports_match_id']][row['hero_name']].keys():
      player_data[row['player_name']][row['esports_match_id']][row['hero_name']].update({
        row['stat_name']: row['stat_amount']
      })

    i += 1

with open('player_stats.json', 'w') as fp:
  json.dump(player_data, fp)