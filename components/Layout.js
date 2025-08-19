import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

function Layout({ children }) {
  
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Nav />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Layout
