import "./globals.css";
import localFont from "next/font/local";

export const oswaldBold = localFont({
  src: "./fonts/Oswald-Bold.ttf",
  variable: "--font-oswald-bold",
  display: "swap",
});

export const oswaldMedium = localFont({
  src: "./fonts/Oswald-Medium.ttf",
  variable: "--font-oswald-medium",
  display: "swap",
});

export const oswaldRegular = localFont({
  src: "./fonts/Oswald-Regular.ttf",
  variable: "--font-oswald-regular",
  display: "swap",
});

export const poppinsRegular = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins-regular",
  display: "swap",
});

export const poppinsMedium = localFont({
  src: "./fonts/Poppins-Medium.ttf",
  variable: "--font-poppins-medium",
  display: "swap",
});

export const poppinsExtraLightItalic = localFont({
  src: "./fonts/Poppins-ExtraLightItalic.ttf",
  variable: "--font-poppins-extralightitalic",
  display: "swap",
});

export const jockeyOneRegular = localFont({
  src: "./fonts/JockeyOne-Regular.ttf",
  variable: "--font-jockeyone-regular",
  display: "swap",
});

export const ppEditorialNew = localFont({
  src: "./fonts/PPEditorialNew-Italic.otf",
  variable: "--font-ppeditorialnew-italic",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${oswaldBold.variable}
        ${oswaldMedium.variable}
        ${oswaldRegular.variable}
        ${poppinsRegular.variable}
        ${poppinsMedium.variable}
        ${poppinsExtraLightItalic.variable}
        ${jockeyOneRegular.variable}
        ${ppEditorialNew.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
