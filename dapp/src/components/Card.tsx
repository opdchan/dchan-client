import { ReactElement } from "react";

export default function Card({
  className = "grid",
  bodyClassName = "",
  title,
  children,
}: {
  className?: string;
  bodyClassName?: string;
  children: ReactElement | ReactElement[];
  title: ReactElement | string;
}) {
  return (
    <article className={`${className} mt-4 max-w-100vw`}>
      <header className="bg-highlight w-full py-1 bg-white border border-black">
        <div className="text-xl text-center font-semibold">{title}</div>
      </header>
      <section className={`${bodyClassName} bg-white border border-black border-t-0 w-full p-4`} style={{flex: "1 1 auto"}}>
        {children}
      </section>
    </article>
  );
}
