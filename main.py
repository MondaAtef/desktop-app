import eel
import json
import os
from pathlib import Path


user_data_dir = Path.home() / 'MyAppName' 
user_data_dir.mkdir(parents=True, exist_ok=True)  

DATA_FILE = user_data_dir / 'data_storage.json'  

print(f"Saving data to: {DATA_FILE}")
os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

print("Saving data to:", DATA_FILE)

# Load saved data from a file if it exists
def load_data_from_file():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []  



# Load data when the application starts
data_storage = load_data_from_file()

@eel.expose
def saveDataToBackend(data):
    global data_storage
    data_storage = data
    print("Data saved:", data)

    # Save the updated data to the JSON file
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data_storage, f, ensure_ascii=False, indent=4)

@eel.expose
def getDataFromBackend():
    return data_storage

@eel.expose
def updateRowInBackend(index, updated_data):
    if 0 <= index < len(data_storage):
        data_storage[index] = updated_data
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data_storage, f, ensure_ascii=False, indent=4)
        print("Updated row:", updated_data)

@eel.expose
def deleteRowInBackend(index):
    if 0 <= index < len(data_storage):
        deleted_row = data_storage.pop(index)
        print("Deleted row:", deleted_row)
    
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data_storage, f, ensure_ascii=False, indent=4)
        print("Data after deletion:", data_storage)

@eel.expose
def deleteAllDataInBackend():
    global data_storage
    data_storage = []  # Clear the list
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data_storage, f, ensure_ascii=False, indent=4)
    print("All data deleted.")
 
        
# Start the Eel application
eel.init('Gui')  
eel.start('index.html', size=(800, 600), port=8000)
