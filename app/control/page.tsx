"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";
import io from "socket.io-client";
import { socket } from "@/socket";

export default function Page() {
  const [gameState, setGameState] = useState({
    homeSchool: "Home Team",
    homeTeam: "HOME",
    awaySchool: "Away Team",
    awayTeam: "AWAY",
    homeScore: 0,
    awayScore: 0,
    homeClass: "",
    awayClass: "",
    homeTimeouts: 4,
    awayTimeouts: 4,
    homeLogo: "/placeholder.svg?height=50&width=50",
    awayLogo: "/placeholder.svg?height=50&width=50",
    quarter: 1,
    timeLeft: 100,
    isRunning: false,
    homeColor: "#ff4655",
    awayColor: "#1b97d4",
    showScoreboard: true,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isRunning && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    }
    updateScore();
    return () => clearInterval(interval);
  }, [gameState.isRunning, gameState.timeLeft]);

  const updateScore = () => {
    socket.emit("score", JSON.stringify(gameState));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTimeInput = (input: string) => {
    const [minutes, seconds] = input.split(":").map(Number);
    const totalSeconds = minutes * 60 + (seconds || 0);
    setGameState((prev) => ({ ...prev, timeLeft: totalSeconds }));
  };

  const toggleScoreboard = () => {
    setGameState((prev) => ({ ...prev, showScoreboard: !prev.showScoreboard }));
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        YOSCUP Scoreboard Control
      </h1>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-scoreboard"
          checked={gameState.showScoreboard}
          onCheckedChange={toggleScoreboard}
        />
        <Label htmlFor="show-scoreboard">Show Scoreboard</Label>
      </div>
      <Tabs defaultValue="game" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="game" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
            <div className="col-span-3 text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Round {gameState.quarter}
              </h2>
              <div className="flex justify-center space-x-2 mb-4">
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      quarter: prev.quarter + 1,
                    }))
                  }
                >
                  +
                </Button>
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      quarter: Math.max(prev.quarter - 1, 1),
                    }))
                  }
                >
                  -
                </Button>
              </div>
              <div className="text-4xl font-bold mb-4">
                {formatTime(gameState.timeLeft)}
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      isRunning: !prev.isRunning,
                    }))
                  }
                >
                  {gameState.isRunning ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {gameState.isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  onClick={() =>
                    setGameState((prev) => ({ ...prev, timeLeft: 100 }))
                  }
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset (1:40)
                </Button>
              </div>
              <Input
                type="text"
                placeholder="MM:SS"
                onChange={(e) => handleTimeInput(e.target.value)}
                className="w-24 mx-auto text-center"
              />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">{gameState.homeTeam}</h3>
              <div className="text-5xl font-bold mb-4">
                {gameState.homeScore}
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      homeScore: prev.homeScore + 1,
                    }))
                  }
                >
                  +1
                </Button>
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      homeScore: Math.max(prev.homeScore - 1, 0),
                    }))
                  }
                >
                  -1
                </Button>
              </div>
            </div>
            <div className="text-center text-5xl font-bold self-center">-</div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">{gameState.awayTeam}</h3>
              <div className="text-5xl font-bold mb-4">
                {gameState.awayScore}
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      awayScore: prev.awayScore + 1,
                    }))
                  }
                >
                  +1
                </Button>
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      awayScore: Math.max(prev.awayScore - 1, 0),
                    }))
                  }
                >
                  -1
                </Button>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold mb-2">Timeout</h3>
              <div className="text-5xl font-bold mb-4">
                {gameState.homeTimeouts}
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      homeTimeouts: prev.homeTimeouts + 1,
                    }))
                  }
                >
                  +1
                </Button>
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      homeTimeouts: Math.max(prev.homeTimeouts - 1, 0),
                    }))
                  }
                >
                  -1
                </Button>
              </div>
            </div>
            <div className="text-center text-5xl font-bold self-center">-</div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Timeout</h3>
              <div className="text-5xl font-bold mb-4">
                {gameState.awayTimeouts}
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      awayTimeouts: prev.awayTimeouts + 1,
                    }))
                  }
                >
                  +1
                </Button>
                <Button
                  onClick={() =>
                    setGameState((prev) => ({
                      ...prev,
                      awayTimeouts: Math.max(prev.awayTimeouts - 1, 0),
                    }))
                  }
                >
                  -1
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="teams" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <Label htmlFor="homeTeam">Home Team</Label>
              <Input
                id="homeTeam"
                value={gameState.homeTeam}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    homeTeam: e.target.value,
                  }))
                }
                className="mb-2"
              />
              <Label htmlFor="homeSchool">Home School</Label>
              <Input
                id="homeSchool"
                value={gameState.homeSchool}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    homeSchool: e.target.value,
                  }))
                }
                className="mb-2"
              />
              <Label htmlFor="homeClass">Home Tailwind Code</Label>
              <Input
                id="homeClass"
                value={gameState.homeClass}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    homeClass: e.target.value,
                  }))
                }
                className="mb-2"
              />
              <Label htmlFor="homeColor">Home Color</Label>
              <Input
                id="homeColor"
                type="color"
                value={gameState.homeColor}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    homeColor: e.target.value,
                  }))
                }
                className="mb-2"
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <Label htmlFor="awayTeam">Away Team</Label>
              <Input
                id="awayTeam"
                value={gameState.awayTeam}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    awayTeam: e.target.value,
                  }))
                }
                className="mb-2"
              />
              <Label htmlFor="awaySchool">Away School</Label>
              <Input
                id="awaySchool"
                value={gameState.awaySchool}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    awaySchool: e.target.value,
                  }))
                }
                className="mb-2"
              />
              <Label htmlFor="awayClass">Away Tailwind Code</Label>
              <Input
                id="awayClass"
                value={gameState.awayClass}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    awayClass: e.target.value,
                  }))
                }
                className="mb-2"
              />
              <Label htmlFor="awayColor">Away Color</Label>
              <Input
                id="awayColor"
                type="color"
                value={gameState.awayColor}
                onChange={(e) =>
                  setGameState((prev) => ({
                    ...prev,
                    awayColor: e.target.value,
                  }))
                }
                className="mb-2"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-scoreboard"
                checked={gameState.showScoreboard}
                onCheckedChange={toggleScoreboard}
              />
              <Label htmlFor="show-scoreboard">Show Scoreboard</Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Button onClick={updateScore} className="mt-6 w-full">
        Update Scoreboard
      </Button>
    </div>
  );
}
