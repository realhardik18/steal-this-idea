import json
import os
import time
from dotenv import load_dotenv
import requests
load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
API_URL = "https://twitter241.p.rapidapi.com/tweet"

HEADERS = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "twitter241.p.rapidapi.com"
}

def fetch_tweet_details(tweet_id):
    try:
        response = requests.get(f"{API_URL}?pid={tweet_id}", headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching tweet {tweet_id}: {e}")
        return None

def main():
    input_file = "batch1.txt"
    output_file = "tweets.json"            
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    with open(input_file, "r") as file:
        tweet_links = [line.strip() for line in file if line.strip()]

    tweet_ids = [link.split('/')[-1] for link in tweet_links]

    tweet_details = []
    total_tweets = len(tweet_ids)
    for index, tweet_id in enumerate(tweet_ids, start=1):
        try:
            details = fetch_tweet_details(tweet_id)
            if details:
                tweet_details.append(details)
            time.sleep(2)  # Add a 2-second delay between requests
            print(f"Progress: {index}/{total_tweets} tweets processed.")
        except Exception as e:
            print(f"Failed to fetch details for {tweet_id}: {e}")

    with open(output_file, "w") as file:
        json.dump(tweet_details, file, indent=4)

    print(f"Tweet details saved to {output_file}")

if __name__ == "__main__":
    main()
