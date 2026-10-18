"use client";

import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: { targetDate?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    let destination = targetDate ? new Date(targetDate).getTime() : NaN;

    // If target date is invalid or in the past, default to end of today (rolling countdown)
    if (isNaN(destination) || destination <= Date.now()) {
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      destination = endOfToday.getTime();
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference <= 0) {
        clearInterval(interval);
        // Start a new rolling countdown for the next day
        const endOfTomorrow = new Date();
        endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
        endOfTomorrow.setHours(23, 59, 59, 999);
        setTimeLeft({ days: 0, hours: 23, minutes: 59, seconds: 59 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="countdown-wrap">
        <style>{`
          .countdown-wrap {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
            margin-top: 32px;
            width: 100%;
            max-width: 440px;
          }
          .countdown-box-item {
            background: rgba(255, 255, 255, 0.14);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 12px;
            padding: 14px 8px;
            min-width: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            text-align: center;
          }
          .countdown-box-num {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            font-family: var(--font-sans);
            line-height: 1.1;
          }
          .countdown-box-label {
            font-size: 9px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.85);
            letter-spacing: 0.8px;
            margin-top: 4px;
            text-transform: uppercase;
          }
          @media (max-width: 600px) {
            .countdown-wrap {
              gap: 8px;
              margin-top: 22px;
              max-width: 100%;
            }
            .countdown-box-item {
              padding: 10px 4px;
              border-radius: 10px;
            }
            .countdown-box-num {
              font-size: 20px;
            }
            .countdown-box-label {
              font-size: 8px;
              letter-spacing: 0.4px;
            }
          }
          @media (max-width: 360px) {
            .countdown-wrap {
              gap: 6px;
            }
            .countdown-box-item {
              padding: 8px 2px;
            }
            .countdown-box-num {
              font-size: 18px;
            }
            .countdown-box-label {
              font-size: 7.5px;
            }
          }
        `}</style>
        <div className="countdown-box-item"><span className="countdown-box-num">--</span><span className="countdown-box-label">Days</span></div>
        <div className="countdown-box-item"><span className="countdown-box-num">--</span><span className="countdown-box-label">Hours</span></div>
        <div className="countdown-box-item"><span className="countdown-box-num">--</span><span className="countdown-box-label">Mins</span></div>
        <div className="countdown-box-item"><span className="countdown-box-num">--</span><span className="countdown-box-label">Secs</span></div>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="countdown-wrap">
      <style>{`
        .countdown-wrap {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 32px;
          width: 100%;
          max-width: 440px;
        }
        .countdown-box-item {
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 12px;
          padding: 14px 8px;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          text-align: center;
        }
        .countdown-box-num {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          font-family: var(--font-sans);
          line-height: 1.1;
        }
        .countdown-box-label {
          font-size: 9px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.8px;
          margin-top: 4px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .countdown-wrap {
            gap: 8px;
            margin-top: 22px;
            max-width: 100%;
          }
          .countdown-box-item {
            padding: 10px 4px;
            border-radius: 10px;
          }
          .countdown-box-num {
            font-size: 20px;
          }
          .countdown-box-label {
            font-size: 8px;
            letter-spacing: 0.4px;
          }
        }
        @media (max-width: 360px) {
          .countdown-wrap {
            gap: 6px;
          }
          .countdown-box-item {
            padding: 8px 2px;
          }
          .countdown-box-num {
            font-size: 18px;
          }
          .countdown-box-label {
            font-size: 7.5px;
          }
        }
      `}</style>
      <div className="countdown-box-item">
        <span className="countdown-box-num">{formatNumber(timeLeft.days)}</span>
        <span className="countdown-box-label">DAYS</span>
      </div>
      <div className="countdown-box-item">
        <span className="countdown-box-num">{formatNumber(timeLeft.hours)}</span>
        <span className="countdown-box-label">HOURS</span>
      </div>
      <div className="countdown-box-item">
        <span className="countdown-box-num">{formatNumber(timeLeft.minutes)}</span>
        <span className="countdown-box-label">MINUTES</span>
      </div>
      <div className="countdown-box-item">
        <span className="countdown-box-num">{formatNumber(timeLeft.seconds)}</span>
        <span className="countdown-box-label">SECONDS</span>
      </div>
    </div>
  );
}
