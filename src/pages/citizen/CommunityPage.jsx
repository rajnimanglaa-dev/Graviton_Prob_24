import React from "react";
import { useApp } from "../../context/AppContext.jsx";
import { Award, Trophy, Users, Calendar, MapPin, CheckCircle2, Sparkles, Heart } from "lucide-react";

export default function CommunityPage() {
  const { citizenLeaderboard, wardStatistics, events, rsvpEvent, currentUser } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn text-[#F5F7F5]">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A] animate-pulse" />
          <span className="text-xs font-bold text-[#8BE0B0] uppercase tracking-wider font-mono">
            CIVIC PARTICIPATION & ECO-REWARDS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight mt-1 font-heading">
          Community Impact & Eco-Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B3AA] mt-0.5">
          Gamified civic responsibility: earn EcoPoints for verified waste reporting, clean locality rankings, and neighborhood cleanup drives.
        </p>
      </div>

      {/* User Stats Highlight Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#142820] to-[#1D2B25] text-white border border-[#273b33] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-[#16A36A]/20 border border-[#16A36A]/40 text-xs font-bold text-[#8BE0B0] font-mono">
            🌟 YOUR ECO-STANDING
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F5F7F5]">{currentUser.name}</h2>
          <p className="text-xs text-[#A5B3AA]">
            Active in <strong className="text-[#8BE0B0]">{currentUser.ward || "Ward 7 - Civil Lines"}</strong> • Level 3 Civic Guardian
          </p>
        </div>

        <div className="flex items-center gap-6 bg-[#101A17]/80 backdrop-blur-md p-4 rounded-2xl border border-[#273b33]">
          <div className="text-center">
            <span className="text-[10px] text-[#8BE0B0] uppercase font-bold block font-mono">Reward Points</span>
            <span className="text-3xl font-black text-[#F4C542] font-stat">🌟 {currentUser.points || 420}</span>
          </div>
          <div className="w-px h-10 bg-[#273b33]" />
          <div className="text-center">
            <span className="text-[10px] text-[#8BE0B0] uppercase font-bold block font-mono">Locality Rank</span>
            <span className="text-3xl font-black text-[#F5F7F5] font-stat">#1</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Leaderboard & Ward Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Citizen Leaderboard */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F5F7F5] flex items-center gap-2 font-heading">
              <Trophy size={18} className="text-[#F4C542]" />
              <span>Top Civic Champions</span>
            </h3>
            <span className="text-xs text-[#8BE0B0] font-mono font-semibold">Updated Hourly</span>
          </div>

          <div className="bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md overflow-hidden">
            <div className="divide-y divide-[#273b33]">
              {citizenLeaderboard.map((user, idx) => {
                const isMe = user.email === currentUser.email;
                return (
                  <div
                    key={idx}
                    className={`p-4 flex items-center justify-between gap-4 transition ${
                      isMe ? "bg-[#16A36A]/15 font-bold" : "hover:bg-[#24362f]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs font-stat ${
                        idx === 0
                          ? "bg-[#F4C542] text-[#101A17] shadow-sm"
                          : idx === 1
                          ? "bg-stone-300 text-stone-900 shadow-sm"
                          : idx === 2
                          ? "bg-amber-700 text-white shadow-sm"
                          : "bg-[#142820] text-[#A5B3AA] border border-[#273b33]"
                      }`}>
                        #{user.rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#F5F7F5]">{user.name}</span>
                          {isMe && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#16A36A] text-white">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#A5B3AA]">{user.ward} • {user.badge}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-[#8BE0B0] font-stat">
                        {user.points} pts
                      </div>
                      <div className="text-[10px] text-[#A5B3AA]">
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
            <h3 className="text-base font-bold text-[#F5F7F5] flex items-center gap-2 font-heading">
              <Award size={18} className="text-[#8BE0B0]" />
              <span>Clean Locality Rankings</span>
            </h3>
            <span className="text-xs text-[#A5B3AA] font-semibold">City Wards</span>
          </div>

          <div className="bg-[#1D2B25] rounded-3xl border border-[#273b33] shadow-md p-5 space-y-3">
            {wardStatistics.map((w, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#142820] border border-[#273b33] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#16A36A] text-white text-[10px] font-bold flex items-center justify-center font-stat">
                      {w.cleanRank}
                    </span>
                    <span className="text-xs font-bold text-[#F5F7F5]">{w.ward}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#8BE0B0] font-stat">
                    {w.score}% Clean
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#101A17] overflow-hidden border border-[#273b33]">
                  <div
                    className="h-full bg-[#16A36A] rounded-full"
                    style={{ width: `${w.score}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-[#A5B3AA]">
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
          <h3 className="text-base font-bold text-[#F5F7F5] flex items-center gap-2 font-heading">
            <Calendar size={18} className="text-[#8BE0B0]" />
            <span>Upcoming Community Clean-Up Drives</span>
          </h3>
          <span className="text-xs text-[#8BE0B0] font-medium">Earn +50 to +100 EcoPoints</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(ev => (
            <div
              key={ev.id}
              className="p-6 rounded-3xl bg-[#1D2B25] border border-[#273b33] shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8BE0B0] bg-[#142820] px-2.5 py-0.5 rounded-full border border-[#273b33]">
                    {ev.date}
                  </span>
                  <span className="text-xs font-medium text-[#A5B3AA]">
                    👥 {ev.volunteersCount} / {ev.maxSlots} joined
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#F5F7F5] font-heading">{ev.title}</h4>
                <div className="text-xs text-[#A5B3AA] flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#16A36A]" />
                  <span>{ev.location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ev.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-lg bg-[#142820] border border-[#273b33] text-[#A5B3AA] text-[10px] font-semibold"
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
                    ? "bg-[#16A36A]/20 border border-[#16A36A] text-[#8BE0B0] cursor-default"
                    : "bg-[#16A36A] text-white hover:bg-[#0f7a4e] shadow-md shadow-[#16A36A]/30"
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
