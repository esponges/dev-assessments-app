export function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex min-h-screen flex-col items-center py-12 w-1/4 mx-auto'>
      {children}
    </main>
  );
}
