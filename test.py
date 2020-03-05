import requests
import json

# data = {
#     "charName": "Administratueur",
#     "charClassId": 4,
#     "charClass": {
#         "name": "Admin",
#         "hp": 2000000,
#         "atk": 100000,
#         "def": 200,
#         "acr": 100,
#         "spe": {
#             "name": "God mod",
#             "target": "self",
#             "effect": {
#                 "focus": "hp",
#                 "alterate": "+",
#                 "value": "99999999999999999999"
#             }
#         }
#     },
#     "charLevel": 1,
#     "charExp": False,
#     "score": 0
# }
data = {
    "email": "test@test.test",
    "password": "123456"
}

r = requests.post("http://172.18.1.1:8080/login", data = data)
if r.status_code == 200:
    print(json.dumps(json.loads(r.text), indent=4))
else:
    print('Error')
    print(r.status_code)