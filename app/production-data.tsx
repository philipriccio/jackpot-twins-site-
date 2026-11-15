import { productionDates } from "@/lib/production-dates";
// Run boundaries describe a series, never one continuous performance.
export const productionGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Play",
      "@id": "https://jackpottwins.ca/#play",
      "name": "Jackpot Twins",
      "author": {
        "@type": "Person",
        "name": "Philip Riccio"
      },
      "url": "https://jackpottwins.ca/"
    },
    {
      "@type": "PerformingArtsTheater",
      "@id": "https://jackpottwins.ca/#venue",
      "name": "CAA Theatre",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "651 Yonge Street",
        "addressLocality": "Toronto",
        "addressRegion": "ON",
        "postalCode": "M4Y 1Z9",
        "addressCountry": "CA"
      }
    },
    {
      "@type": "EventSeries",
      "@id": "https://jackpottwins.ca/#production",
      "name": "Jackpot Twins — Toronto run",
      "description": "A series of performances of Philip Riccio’s new comedy, March 9–28, 2027. See Mirvish for individual performance times and tickets.",
      "startDate": productionDates.start,
      "endDate": productionDates.end,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@id": "https://jackpottwins.ca/#venue"
      },
      "workPerformed": {
        "@id": "https://jackpottwins.ca/#play"
      },
      "organizer": {
        "@type": "TheaterGroup",
        "@id": "https://companytheatre.ca/#organization",
        "name": "The Company Theatre",
        "url": "https://companytheatre.ca"
      },
      "performer": [
        {
          "@type": "Person",
          "name": "Seana McKenna"
        },
        {
          "@type": "Person",
          "name": "Nora McLellan"
        },
        {
          "@type": "Person",
          "name": "Tony Nappo"
        },
        {
          "@type": "Person",
          "name": "Colin A. Doyle"
        },
        {
          "@type": "Person",
          "name": "Caroline Toal"
        }
      ],
      "url": "https://jackpottwins.ca/",
      "sameAs": "https://www.mirvish.com/shows/jackpot-twins",
      "image": "https://jackpottwins.ca/images/jackpot-twins-instagram-hero-1080.webp"
    }
  ]
};
export default function ProductionData(){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(productionGraph).replace(/</g,"\\u003c")}}/>;}
