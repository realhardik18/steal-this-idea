import json
from datetime import datetime

with open ("tweets.json", "r") as file:
    tweets = json.load(file)

def pretty_date(date_string):        
    dt = datetime.strptime(date_string, "%a %b %d %H:%M:%S %z %Y")        
    def ordinal(n):
        return f"{n}{'th' if 11 <= n % 100 <= 13 else {1:'st', 2:'nd', 3:'rd'}.get(n % 10, 'th')}"        
    return f"{ordinal(dt.day)} {dt.strftime('%B %Y')}"

data=[]

for tweet in tweets[::-1]:
    obj={
        "profile_img": tweet['user']['legacy']['profile_image_url_https'],
        "username": tweet['user']['legacy']['screen_name'],        
        "created_at": pretty_date(tweet['tweet']['created_at']),
        "likes": tweet['tweet']['favorite_count'],
        "bookmarks": tweet['tweet']['bookmark_count'],
        "reposts": tweet['tweet']['retweet_count'],
        "content": tweet['tweet']['full_text'],
        "tweet_url" : "https://x.com/"+tweet['user']['legacy']['screen_name']+"/status/"+tweet['tweet']['conversation_id_str'],
    }    
    data.append(obj)
with open("tweets_clean.json", "w") as file:
    json.dump(data, file, indent=4)
