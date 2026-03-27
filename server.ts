import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MOCK DATABASE ---
const MOCK_USER = {
  id: "mock_user_001",
  name: "Sanjay",
  email: "sanjay@flashflowtech.com",
  green_points: 340
};

let trips: any[] = [];
let user = { ...MOCK_USER };

// --- TRANSPORT LOGIC ---
const TRANSPORT_DATA: Record<string, any> = {
  "walk":    { name: "Walk",    speed_kmh: 5,  cost_per_km: 0,   emission_per_km: 0.000, eco_score: 100, icon: "Walking" },
  "cycle":   { name: "Cycle",   speed_kmh: 15, cost_per_km: 0,   emission_per_km: 0.000, eco_score: 98,  icon: "Bike" },
  "bike":    { name: "Bike",    speed_kmh: 40, cost_per_km: 2.5, emission_per_km: 0.065, eco_score: 60,  icon: "Motorcycle" },
  "ev_bike": { name: "EV Bike", speed_kmh: 45, cost_per_km: 0.5, emission_per_km: 0.010, eco_score: 92,  icon: "Zap" },
  "car":     { name: "Car",     speed_kmh: 50, cost_per_km: 6.5, emission_per_km: 0.210, eco_score: 25,  icon: "Car" },
  "ev_car":  { name: "EV Car",  speed_kmh: 55, cost_per_km: 2.0, emission_per_km: 0.050, eco_score: 80,  icon: "Zap" },
  "bus":     { name: "Bus",     speed_kmh: 30, cost_per_km: 1.0, emission_per_km: 0.040, eco_score: 85,  icon: "Bus" },
  "train":   { name: "Train",   speed_kmh: 80, cost_per_km: 0.8, emission_per_km: 0.014, eco_score: 94,  icon: "Train" },
};

function calculateResults(distanceKm: number) {
  return Object.entries(TRANSPORT_DATA).map(([mode, data]) => {
    const timeMin = Math.round((distanceKm / data.speed_kmh) * 60 * 10) / 10;
    const cost = Math.round(distanceKm * data.cost_per_km * 100) / 100;
    const co2 = Math.round(distanceKm * data.emission_per_km * 1000) / 1000;
    return {
      mode,
      name: data.name,
      distance_km: distanceKm,
      time_min: timeMin,
      cost_inr: cost,
      co2_kg: co2,
      eco_score: data.eco_score,
      icon: data.icon
    };
  }).sort((a, b) => b.eco_score - a.eco_score);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---
  app.post("/api/trips/compare", (req, res) => {
    const { distance_km } = req.body;
    const results = calculateResults(Number(distance_km));
    res.json(results);
  });

  app.post("/api/trips/select", (req, res) => {
    const trip = req.body;
    const pointsEarned = Math.floor(trip.eco_score / 10);
    
    const newTrip = {
      ...trip,
      id: Date.now().toString(),
      user_id: user.id,
      points_earned: pointsEarned,
      created_at: new Date().toISOString()
    };
    
    trips.push(newTrip);
    user.green_points += pointsEarned;
    
    res.json({ success: true, trip: newTrip, user });
  });

  app.get("/api/trips/history", (req, res) => {
    res.json(trips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  });

  app.get("/api/dashboard/stats", (req, res) => {
    const totalDistance = trips.reduce((sum, t) => sum + t.distance_km, 0);
    const totalCO2 = trips.reduce((sum, t) => sum + t.co2_kg, 0);
    const ecoChoices = trips.filter(t => t.eco_score >= 80).length;
    const totalPoints = user.green_points;

    // Data for charts
    const distanceOverTime = trips.map(t => ({
      date: new Date(t.created_at).toLocaleDateString(),
      distance: t.distance_km
    })).slice(-10);

    const co2ByTransport = Object.keys(TRANSPORT_DATA).map(mode => ({
      name: TRANSPORT_DATA[mode].name,
      co2: trips.filter(t => t.mode === mode).reduce((sum, t) => sum + t.co2_kg, 0)
    }));

    const transportUsage = Object.keys(TRANSPORT_DATA).map(mode => ({
      name: TRANSPORT_DATA[mode].name,
      value: trips.filter(t => t.mode === mode).length
    })).filter(item => item.value > 0);

    res.json({
      stats: { totalDistance, totalCO2, ecoChoices, totalPoints },
      charts: { distanceOverTime, co2ByTransport, transportUsage }
    });
  });

  app.get("/api/profile/me", (req, res) => {
    res.json(user);
  });

  app.put("/api/profile/update", (req, res) => {
    const { name } = req.body;
    user.name = name;
    res.json(user);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
