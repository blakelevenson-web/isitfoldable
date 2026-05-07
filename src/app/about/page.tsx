export default function AboutPage() {
  const ratings = [
    { name: "Dough/Crust", desc: "Texture, char, and structural integrity." },
    { name: "Sauce", desc: "Balance of sweet and acid. Herb distribution." },
    { name: "Cheese", desc: "Quality, melt, and pull factor." },
    { name: "Foldability", desc: "Can it hold its own weight? No flop allowed." },
    { name: "Overall", desc: "The holistic experience." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About Foldable</h1>

      <div className="bg-white border border-warm-border rounded-xl p-6 mb-8">
        <p className="text-gray-700 leading-relaxed">
          Foldable is an app dedicated to rating pizza from every shop I visit.
          We don&apos;t just give a thumbs up; we break it down to the molecular level of pizza science:
          the structural integrity of the fold, the tang of the sauce, and the crisp of the crust.
          All reviews are for a standard Plain slice to ensure consistency.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-4">The Rating System (0.0 - 10.0)</h2>

      <div className="space-y-3">
        {ratings.map((r) => (
          <div key={r.name} className="bg-white border border-warm-border rounded-lg p-4">
            <p className="font-bold text-sm text-accent">{r.name}</p>
            <p className="text-sm text-warm-muted">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
