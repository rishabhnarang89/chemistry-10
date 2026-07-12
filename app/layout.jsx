import "./globals.css";

export const metadata = {
  title: "ChemQuest 10 — Chemistry, but make it a game!",
  description:
    "An interactive playground for the first 4 chapters of NCERT Class 10 Science (Chemistry).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
