// Ticket destination published in Mirvish’s official October 5 announcement.
const ticketDestination = "https://www.mirvish.com/shows/jackpot-twins";

export function ticketUrl(placement: string): string {
  const url = new URL(ticketDestination);
  url.searchParams.set("utm_source", "jackpottwins.ca");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "jackpot_twins_tickets");
  url.searchParams.set("utm_content", placement);
  return url.toString();
}

export { gaEvent } from "./campaign-analytics";
