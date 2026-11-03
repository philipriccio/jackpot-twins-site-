import Image from "next/image";
import "./cast-section.css";

const castData = [
  {
    name: "Seana McKenna",
    role: "Geraldine FitzGerald",
    img: "/images/cast-20261103/seana-31.webp",
    width: 1123, height: 1401,
    bio: "Seana McKenna is a recipient of the Order of Canada — do we need to say more? No. But we will anyway. A National Theatre School graduate, she has spent four decades setting the standard at Stratford, Shaw, Canadian Stage, and stages across North America, playing everything from Juliet to Julius Caesar along the way. She made history as Stratford's first female Richard III. Three Dora Awards, a Genie, a Jessie, and multiple Honorary Doctorates later — if you saw her in Things I Know to Be True and needed a few days to recover, good news: this one's a comedy.",
  },
  {
    name: "Nora McLellan",
    role: "Bernadette FitzGerald",
    img: "/images/cast-20261103/nora.webp",
    width: 630, height: 1337,
    bio: "Nora McLellan has been one of Canadian theatre's great pleasures for over fifty years, and she shows absolutely no signs of stopping. She spent 22 seasons at the Shaw Festival and four at Stratford, trained with the legendary Uta Hagen in New York, and has four Jessie Awards and two Doras to her name. Toronto audiences know her from John at The Company Theatre — for which she won the Dora for Outstanding Performance — and as Sister Rose in CBC's Son of a Critch, a role written especially for her. She is, in every sense, a force of nature.",
  },
  {
    name: "Tony Nappo",
    role: "Peter",
    img: "/images/cast-20261103/tony.webp",
    width: 1111, height: 1416,
    bio: "Tony Nappo has appeared in roughly 70 films, hundreds of TV shows, and more Toronto stages than most people have visited. Born in Scarborough, trained at the American Academy of Dramatic Arts in Manhattan, he's the kind of actor critics describe as \"razor-sharp\" and \"effortlessly magnetic.\" He's appeared alongside Al Pacino, recently played Georgia's lawyer on the hit Netflix series Ginny & Georgia, voiced a gangster in Fugget About It, and wrote the beloved column Nappoholics Anonymous for Intermission Magazine. If you've watched Canadian TV in the last twenty years, you've seen him.",
  },
  {
    name: "Colin A. Doyle",
    role: "Harold",
    img: "/images/cast-20261103/colin.webp",
    width: 1065, height: 1477,
    bio: "Colin A Doyle is a Dora Award–winning, Toronto-based actor and theatre producer who has performed across Canada, the US, and Europe. A York University Acting Conservatory graduate, he has worked with some of the most inventive companies in the country — Outside the March, Canadian Stage, Obsidian Theatre, Crow’s Theatre, Caravan, Coal Mine Theatre, and Mirvish — and has played everything from Peter Pan to a post-apocalyptic Homer Simpson. The range is real.",
  },
  {
    name: "Caroline Toal",
    role: "Abigail",
    img: "/images/cast-20261103/caroline.webp",
    width: 1073, height: 1466,
    bio: "Caroline Toal is a two-time Dora Award winner, a Stratford Festival Mary Savidge Award recipient, and the person most recently responsible for making half of Ontario cry about Anne Shirley. She grew up in Orangeville, trained at George Brown Theatre School, and has originated roles in new Canadian plays at Young People's Theatre, The Howland Company, and the Stratford Festival. Her credits include Casimir and Caroline, Selfie, To Kill a Mockingbird, and Anne of Green Gables — which received an extension because the audiences refused to let it close. Some performers make you want to stay. She is one of them.",
  },
];

function Portrait({ actor, index }: { actor: (typeof castData)[number]; index: number }) {
  const words = actor.name.split(" ");
  const surname = words.pop();
  return (
    <article className={`cast-person cast-person-${index}`}>
      <div className="cast-portrait">
        <Image src={actor.img} alt={actor.name} width={actor.width} height={actor.height} unoptimized />
      </div>
      <h3>{words.join(" ")} <span>{surname}</span></h3>
      <p className="cast-role">as {actor.role}</p>
      <details>
        <summary>Meet {words[0]} <span aria-hidden="true" className="cast-bio-icon" /></summary>
        <p>{actor.bio}</p>
      </details>
    </article>
  );
}

export default function CastSection() {
  return (
    <section className="cast-gallery" id="cast" aria-labelledby="cast-heading">
      <div className="cast-gallery-inner">
        <header><h2 id="cast-heading">Meet the <em>Cast</em></h2></header>
        <div className="cast-leads">
          {castData.slice(0, 2).map((actor, index) => <Portrait key={actor.name} actor={actor} index={index} />)}
        </div>
        <div className="cast-divider" aria-hidden="true" />
        <div className="cast-ensemble">
          {castData.slice(2).map((actor, index) => <Portrait key={actor.name} actor={actor} index={index + 2} />)}
        </div>
        <p className="cast-credit">Photography: Wade Muir</p>
      </div>
    </section>
  );
}
