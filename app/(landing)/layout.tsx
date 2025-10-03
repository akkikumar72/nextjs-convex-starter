export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-full mx-auto border-x relative">
      {/* <div className="block w-px h-full border-l border-border absolute top-0 left-6 z-10"></div> */}
        {children}
    </div>
  )
}
