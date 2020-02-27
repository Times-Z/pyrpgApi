import requests
import json

data = {
    "charName": "Administratueur",
    "charClassId": 4,
    "charClass": {
        "name": "Admin",
        "hp": 2000000,
        "atk": 100000,
        "def": 200,
        "acr": 100,
        "spe": {
            "name": "God mod",
            "target": "self",
            "effect": {
                "focus": "hp",
                "alterate": "+",
                "value": "99999999999999999999"
            }
        }
    },
    "charLevel": 1,
    "charExp": False,
    "score": 0
}
r = requests.post("http://0.0.0.0:8080/save", data = data)
# r.text          #Retourne le contenu en unicode
# r.content       #Retourne le contenu en bytes
# r.json          #Retourne le contenu sous forme json
# r.headers       #Retourne le headers sous forme de dictionnaire 
# r.status_code   #Retourne le status code
print(json.dumps(json.loads(r.text), indent=4))