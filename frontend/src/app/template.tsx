'use client';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-blur-in">
      {children}
    </div>
  );
}
