const steps = [
  ["Izaberi proizvod", "Pregledaj proizvode i pakete koji odgovaraju tvojoj rutini."],
  ["Pošalji upit", "Javi nam koji proizvod ili paket želiš da poručiš."],
  ["Potvrdi porudžbinu", "Dostupnost i sledeće korake potvrđujemo kroz lični kontakt."],
] as const;

export function OrderFlow() {
  return (
    <section className="storefront-order-flow" aria-labelledby="order-flow-heading">
      <header>
        <p className="storefront-kicker">Kako poručiti</p>
        <h2 id="order-flow-heading">Tri jednostavna koraka.</h2>
        <p>BIOTACT trenutno nema samostalni kartični checkout — porudžbinu potvrđujemo lično.</p>
      </header>
      <ol>
        {steps.map(([title, description], index) => (
          <li key={title}>
            <span>0{index + 1}</span>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
