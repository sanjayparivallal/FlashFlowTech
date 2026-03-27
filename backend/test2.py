import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('http://127.0.0.1:8000/auth/login', data=json.dumps({'email': 'jane@example.com', 'password': 'password123'}).encode(), headers={'Content-Type': 'application/json'}, method='POST')
try:
    with urllib.request.urlopen(req, context=ctx) as r:
        token = json.loads(r.read())['token']
        print('Login success')
        
        req2 = urllib.request.Request('http://127.0.0.1:8000/trips/select', data=json.dumps({'source': 'A', 'destination': 'B', 'transport_mode': 'ev_car', 'distance_km': 10.5}).encode(), headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}, method='POST')
        with urllib.request.urlopen(req2, context=ctx) as r2:
            print('Select success:', r2.read())
except Exception as e:
    print('Failed:', e)
    if hasattr(e, 'read'):
        print(e.read())
