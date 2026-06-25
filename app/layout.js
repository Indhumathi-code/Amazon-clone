import './globals.css';

export const metadata = {
  title: 'Amazon.in',
  description: 'Online Shopping',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}