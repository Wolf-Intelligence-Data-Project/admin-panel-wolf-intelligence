import Image from "next/image";
import "@/styles/global.scss";

export default function HomePage() {
  return (
    <div className="flex-center mt-4">
      <section>
        <h2 className="text-center">Hello, Welcome to My Modern App</h2>
        <p className="mb-4">
          This is a basic setup with elegant and modern styles using SCSS.
        </p>
        <button className="button-primary">Click Me</button>
      </section>
    </div>
  );
}
