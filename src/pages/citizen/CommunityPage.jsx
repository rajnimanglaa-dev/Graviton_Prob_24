import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Award, Trophy, Users, Calendar, MapPin, CheckCircle2, Sparkles, Heart } from "lucide-react";

export default function CommunityPage() {
  const { citizenLeaderboard, wardStatistics, events, rsvpEvent, currentUser } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-[#174C37] uppercase tracking-wider">
            Civic Participation & Eco-Rewards
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#202923] tracking-tight mt-1">
          Community Impact & Eco-Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Gamified civic responsibility: earn EcoPoints for verified waste reporting, clean locality rankings, and neighborhood cleanup drives.
        </p>
      </div>

      {/* User Stats Highlight Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#174C37] text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-emerald-300">
            🌟 Your Eco-Standing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">{currentUser.name}</h2>
          <p className="text-xs text-white/80">
            Active in <strong>{currentUser.ward || "Ward 7 - Civil Lines"}</strong> • Level 3 Civic Guardian
          </p>
        </div>

        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20">
          <div className="text-center">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Reward Points</span>
            <span className="text-3xl font-black text-amber-300">🌟 {currentUser.points || 420}</span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">Locality Rank</span>
            <span className="text-3xl font-black text-white">#1</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Leaderboard & Ward Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Citizen Leaderboard */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <span>Top Civic Champions</span>
            </h3>
            <span className="text-xs text-stone-400 font-semibold">Updated Hourly</span>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-stone-100">
              {citizenLeaderboard.map((user, idx) => {
                const isMe = user.email === currentUser.email;
                return (
                  <div
                    key={idx}
                    className={`p-4 flex items-center justify-between gap-4 transition ${
                      isMe ? "bg-emerald-50/60 font-bold" : "hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? "bg-amber-400 text-stone-900 shadow-sm"
                          : idx === 1
                          ? "bg-stone-300 text-stone-900 shadow-sm"
                          : idx === 2
                          ? "bg-amber-700 text-white shadow-sm"
                          : "bg-stone-100 text-stone-600"
                      }`}>
                        #{user.rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900">{user.name}</span>
                          {isMe && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#174C37] text-white">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400">{user.ward} • {user.badge}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-[#174C37]">
                        {user.points} pts
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {user.verifiedReports} verified reports
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Ward Cleanliness Rankings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Award size={18} className="text-[#174C37]" />
              <span>Clean Locality Rankings</span>
            </h3>
            <span className="text-xs text-stone-400 font-semibold">City Wards</span>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-5 space-y-3">
            {wardStatistics.map((w, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#174C37] text-white text-[10px] font-bold flex items-center justify-center">
                      {w.cleanRank}
                    </span>
                    <span className="text-xs font-bold text-stone-800">{w.ward}</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {w.score}% Clean
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-[#174C37] rounded-full"
                    style={{ width: `${w.score}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>{w.resolved} of {w.totalReports} resolved</span>
                  <span>Avg: {w.avgResolutionHours}h resolution</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Cleanup Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Calendar size={18} className="text-[#174C37]" />
            <span>Upcoming Community Clean-Up Drives</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">Earn +50 to +100 EcoPoints</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(ev => (
            <div
              key={ev.id}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {ev.date}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    👥 {ev.volunteersCount} / {ev.maxSlots} joined
                  </span>
                </div>

                <h4 className="text-base font-bold text-stone-900">{ev.title}</h4>
                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#174C37]" />
                  <span>{ev.location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ev.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => rsvpEvent(ev.id)}
                disabled={ev.isJoined}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  ev.isJoined
                    ? "bg-emerald-100 text-emerald-800 cursor-default"
                    : "bg-[#174C37] text-white hover:bg-[#0f3325] shadow-xs"
                }`}
              >
                {ev.isJoined ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Registered (Points Credited)</span>
                  </>
                ) : (
                  <span>RSVP for Clean-up Drive (+50 Pts)</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
