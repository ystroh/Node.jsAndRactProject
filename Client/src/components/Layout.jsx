import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div>
      <header className="site-header">
        <div className="site-container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div className="brand">
            <div className="brand__logo">T &  Y</div>
            <div className="brand__title">Sharing Platform</div>
          </div>
          <nav className="nav">
            <Link to="/">בית</Link>
            <Link to="/giver">תורם</Link>
            <Link to="/receiver">מקבל</Link>
            <Link to="/admin">מנהל</Link>
          </nav>
        </div>
      </header>

      <main className="site-container">
        {children}
      </main>

      <footer className="site-container" style={{marginTop:32}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div className="muted-small">© כל הזכויות שמורות</div>
          <div className="muted-small">עיצוב מודרני | חוויית משתמש</div>
        </div>
      </footer>
    </div>
  )
}
