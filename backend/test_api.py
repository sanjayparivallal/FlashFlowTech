import httpx
import asyncio

async def main():
    async with httpx.AsyncClient(base_url='http://localhost:8000') as client:
        # 1. Login to get token
        resp = await client.post('/auth/login', json={'email': 'test@test.com', 'password': 'password123'})
        if resp.status_code != 200:
            # Register first
            await client.post('/auth/register', json={'name': 'Test', 'email': 'test@test.com', 'password': 'password123'})
            resp = await client.post('/auth/login', json={'email': 'test@test.com', 'password': 'password123'})
        
        token = resp.json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        
        # 2. Try to save a trip
        trip_data = {
            'source': 'A',
            'destination': 'B',
            'transport_mode': 'ev_car',
            'distance_km': 10.5
        }
        res = await client.post('/trips/select', json=trip_data, headers=headers)
        print("SELECT RESPONSE:", res.status_code, res.text)
        
        # 3. Check dashboard
        res_dash = await client.get('/dashboard/stats', headers=headers)
        print("DASHBOARD RESPONSE:", res_dash.status_code)
        if res_dash.status_code != 200:
            print(res_dash.text)

asyncio.run(main())
