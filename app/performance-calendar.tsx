import { performances } from "@/lib/performance-schedule";
import "./performance-calendar.css";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function PerformanceCalendar() {
  return (
    <section className="performance-calendar" id="performances" aria-labelledby="performance-heading">
      <div className="performance-calendar-heading">
        <p className="performance-eyebrow">CAA THEATRE · TORONTO</p>
        <h2 id="performance-heading">Pick your performance</h2>
        <p className="performance-month">March 2027</p>
        <p className="performance-timezone">All times are Toronto local time.</p>
      </div>
      <div className="performance-weekdays" aria-hidden="true">
        {weekdays.map(day => <span key={day}>{day.slice(0, 3)}</span>)}
      </div>
      <ol className="performance-grid" aria-label="March 2027 performance calendar">
        {Array.from({ length: 31 }, (_, index) => {
          const day = index + 1;
          const shows = performances.filter(show => show.day === day);
          const weekday = weekdays[index % 7]; // March 1, 2027 is Monday.
          return (
            <li key={day} className={`performance-day ${shows.length ? "has-performance" : "no-performance"}`}>
              <div className="performance-date">
                <span className="performance-day-name">{weekday}</span>
                <time dateTime={`2027-03-${String(day).padStart(2, "0")}`} aria-label={`${weekday}, March ${day}, 2027`}>{day}<span className="performance-mobile-month"> Mar</span></time>
              </div>
              {shows.length ? shows.map(show => {
                const time = show.time.replace(/([ap])m$/, " $1m").toUpperCase();
                const url = new URL(show.url);
                url.searchParams.set("utm_source", "jackpottwins.ca");
                url.searchParams.set("utm_medium", "referral");
                url.searchParams.set("utm_campaign", "jackpot_twins_tickets");
                url.searchParams.set("utm_content", "performance_calendar");
                return (
                  <a key={show.url} className="performance-ticket" href={url.toString()} target="_blank" rel="noopener noreferrer" data-ticket-placement="performance_calendar" aria-label={`Buy tickets via Mirvish for ${weekday}, March ${day} at ${time} (opens in a new tab)`}>
                    <span className="performance-time">{time}</span>
                    <span className="performance-buy">BUY TICKETS VIA MIRVISH <span aria-hidden="true">↗</span></span>
                  </a>
                );
              }) : <span className="performance-none">No performance</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
