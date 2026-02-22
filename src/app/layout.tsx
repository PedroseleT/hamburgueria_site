export const metadata = {
  title: 'Garage Burger Grill',
  description: 'O Brasil em cada mordida',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}