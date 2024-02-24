export function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex min-h-screen flex-col items-center py-12 md:w-1/4 w-3/4 mx-auto'>
      {children}
    </main>
  );
}
