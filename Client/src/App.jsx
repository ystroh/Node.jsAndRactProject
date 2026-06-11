import React from 'react'
import { AppRouter } from './routes/AppRouter'
import Layout from './components/Layout'

export default function App() {
  return (
    <Layout>
      <AppRouter />
    </Layout>
  )
}
