const workflow = [
  "Capture the teacher’s note",
  "Prepare reviewed updates",
  "Preserve learning progress",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20">
      <p className="w-fit rounded-full border border-teal-700/20 bg-teal-50 px-3 py-1 text-sm font-semibold tracking-wide text-teal-800">
        Validation prototype
      </p>

      <section className="flex flex-1 flex-col justify-center py-16 sm:py-24">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            DarsFlow
          </h1>
          <p className="mt-7 max-w-2xl text-2xl font-medium leading-9 text-slate-800 sm:text-3xl sm:leading-11">
            Turn one short class note into a parent update, teacher handover,
            and progress record.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Built for Quran, Arabic and Islamic studies academies currently
            managing classes through WhatsApp and spreadsheets.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-3">
          {workflow.map((item, index) => (
            <li
              key={item}
              className="border-l-2 border-teal-700 bg-white px-5 py-5 text-slate-800 shadow-sm"
            >
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
                Step {index + 1}
              </span>
              <span className="mt-2 block font-medium leading-6">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="border-t border-slate-200 pt-5 text-sm font-medium text-slate-600">
        <span className="mr-2 inline-block size-2 rounded-full bg-teal-700" />
        Application foundation ready
      </p>
    </main>
  );
}
