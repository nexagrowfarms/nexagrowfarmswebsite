import AdminOrders from '@/components/AdminOrders'
import Navbar from '@/components/Navbar'
import React from 'react'

function AdminOrdersPag() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--leaf-50), var(--leaf-100), var(--cream))' }}>
      <Navbar />
      <section className="pt-36 sm:pt-40 md:pt-44 pb-12">
        <AdminOrders />
      </section>
    </div>
  )
}

export default AdminOrdersPag