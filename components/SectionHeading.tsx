type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-earth-clay">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-bold text-earth-bark sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-earth-ink/70">{description}</p>
      ) : null}
    </div>
  );
}
