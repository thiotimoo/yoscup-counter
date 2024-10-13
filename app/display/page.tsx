"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "@/socket";
import { Diamond } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
type ScoreData = {
  homeSchool: string;
  homeTeam: string;
  awaySchool: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeTimeouts: number;
  awayTimeouts: number;
  homeClass: string;
  awayClass: string;
  homeLogo: string;
  awayLogo: string;
  quarter: number;
  timeLeft: number;
  homeColor: string;
  awayColor: string;
  showScoreboard: boolean;
  showTimer: boolean;
};

export default function Page() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const [scoreData, setScoreData] = useState<ScoreData>({
    homeSchool: "Home Team",
    homeTeam: "HOME",
    homeClass: "",
    awaySchool: "Away Team",
    awayTeam: "AWAY",
    awayClass: "HOME",
    homeScore: 0,
    awayScore: 0,
    homeTimeouts: 4,
    awayTimeouts: 2,
    homeLogo: "/placeholder.svg?height=50&width=50",
    awayLogo: "/placeholder.svg?height=50&width=50",
    quarter: 1,
    timeLeft: 100,
    homeColor: "#ff4655",
    awayColor: "#1b97d4",
    showScoreboard: false,
    showTimer: true,
  });
  const socketInitializer = async () => {
    socket.on("score", (scoredata) => {
      setScoreData(JSON.parse(scoredata));
    });
  };
  useEffect(() => {
    socketInitializer();
  }, [isConnected]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!scoreData.showScoreboard) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" text-white w-full max-w-6xl rounded-lg relative "
      >
        <div className="flex flex-row items-center gap-6 p-2">
          {/* Home Team Section */}
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex flex-row items-center space-x-4 overflow-clip rounded-lg -skew-x-12 bg-gradient-to-r from-black/95 to-emerald-950 text-white flex-1">
              {scoreData.homeLogo != "" && (
                <img
                  className="w-20 h-auto aspect-square object-contain p-2 skew-x-12"
                  src={scoreData.homeLogo}
                  alt={scoreData.homeTeam}
                />
              )}
              <div className="text-center w-full skew-x-12 flex-1">
                <motion.span
                  className={cn(
                    "text-3xl font-extrabold font-sans",
                    scoreData.homeClass
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {scoreData.homeTeam}
                </motion.span>
                <motion.span
                  className="text-sm font-bold block uppercase text-neutral-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {scoreData.homeSchool}
                </motion.span>
              </div>
              <div className="text-6xl font-black p-3 px-6 h-full bg-emerald-600 border-s-4 border-emerald-400 text-center">
                <div className="skew-x-12">{scoreData.homeScore}</div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end me-4 gap-4 ">
              <div className="gap-4 flex flex-row items-center bg-black/95 rounded-full p-1 px-2">
                {[...Array(4)].map((e, i) =>
                  i + 1 <= scoreData.homeTimeouts ? (
                    <Diamond
                      weight="fill"
                      size={16}
                      className="text-emerald-400"
                    />
                  ) : (
                    <Diamond
                      weight="bold"
                      size={16}
                      className="text-emerald-800"
                    />
                  )
                )}
              </div>
            </div>
          </div>
          {/* Away Team Section */}
          {scoreData.showTimer && (
            <div className="bg-black/95 rounded-xl px-6 py-2">
              {/* Score & Time Section */}
              <div className="text-center flex flex-col">
                <div className="text-xl font-semibold flex-row flex items-center justify-center gap-2 text-neutral-300">
                  Quarter {scoreData.quarter}
                </div>
                <p className="text-4xl font-black">
                  {formatTime(scoreData.timeLeft)}
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex items-center space-x-4 rounded-lg overflow-clip skew-x-12 bg-gradient-to-l from-black/95 to-rose-950 text-white flex-1">
              <div className="text-6xl font-black p-3 px-6 h-full bg-rose-600 border-e-4 border-rose-400 text-center">
                <div className="-skew-x-12">{scoreData.homeScore}</div>
              </div>
              <div className="text-center w-full -skew-x-12 -translate-x-3">
                <motion.span
                  className={cn(
                    "text-3xl font-extrabold font-sans",
                    scoreData.awayClass
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {scoreData.awayTeam}
                </motion.span>
                <motion.span
                  className="text-sm font-medium block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {scoreData.awaySchool}
                </motion.span>
              </div>
              {scoreData.awayLogo != "" && (
                <img
                  className="w-20 h-auto aspect-square object-contain p-2 -skew-x-12"
                  src={scoreData.awayLogo}
                  alt={scoreData.awayTeam}
                />
              )}
            </div>
            <div className="flex flex-row items-center justify-start ms-4 gap-4">
              <div className="gap-4 flex flex-row items-center bg-black/95 rounded-full p-1 px-2">
                {[...Array(4)].map((e, i) =>
                  i + 1 <= scoreData.awayTimeouts ? (
                    <Diamond
                      weight="fill"
                      size={16}
                      className="text-rose-400"
                    />
                  ) : (
                    <Diamond
                      weight="bold"
                      size={16}
                      className="text-rose-800"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TeamSection({ team, name, abbr, logo, score, color }: any) {
  return (
    <div
      className={`flex items-center ${
        team === "home" ? "flex-row" : "flex-row-reverse"
      } bg-[#0f1923] flex-1`}
    >
      <div
        className={`flex flex-1 items-center ${
          team === "home" ? "mr-4" : "ml-4 flex-row-reverse"
        }`}
      >
        <img src={logo} alt={name} className="w-12 h-12 object-contain" />
        <div className={`ml-2 text-center flex-1`}>
          <div className="text-white text-lg font-bold">{abbr}</div>
          <div className="text-gray-400 text-xs">{name}</div>
        </div>
      </div>
      <div
        className={`flex ${team === "home" ? "justify-end" : "justify-start"}`}
        style={{
          background: `linear-gradient(${
            team === "home" ? "90deg" : "270deg"
          }, ${color}, ${color})`,
        }}
      >
        <div className="text-white text-5xl font-bold px-4 py-2">{score}</div>
      </div>
    </div>
  );
}
