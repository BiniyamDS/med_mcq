import json
from collections import Counter

# Load the JSON data from the file
with open('sample.json', 'r') as file:
    data = json.load(file)

# Extract topics from the data
topics = [item['topic'] for item in data]

# Count the occurrences of each unique topic
topic_counts = Counter(topics)

# Print the unique topics along with their counts
for topic, count in topic_counts.items():
    print(f"{topic}: {count}")