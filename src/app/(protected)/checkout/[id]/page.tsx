'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/organisms/Navbar'
import { Footer } from '@/components/organisms/Footer'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/types'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'

export default function Checkout() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return
      const { data, error } = await supabase.from('courses').select('*').eq('id', id).single()
      if (error || !data) {
        toast.error('Curso no encontrado')
        router.push('/cursos')
        return
      }
      setCourse(data)
      setLoading(false)
    }
    fetchCourse()
  }, [id, router, supabase])

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!course) return
    setProcessing(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No estás autenticado')

      // Stripe integration simulation (Fallback to Supabase Insert)
      if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
         // Call your API route for stripe checkout
         // e.g. const res = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ courseId: course.id }) })
         // const { sessionId } = await res.json()
         // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
         // await stripe?.redirectToCheckout({ sessionId })
         toast.success('Redirigiendo a Stripe...')
      } else {
         const { error } = await supabase.from('purchases').insert({
           course_id: course.id,
           user_id: user.id,
           amount_paid: course.price,
           status: 'completed'
         })
         if (error) throw error
         
         toast.success('Pago completado con éxito (Demo Mode)')
         router.push('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.message)
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center font-display">
        <span className="text-white font-black text-2xl uppercase animate-pulse">Cargando Checkout...</span>
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="bg-background-dark min-h-screen font-display text-slate-100 grid-pattern">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-8">
          <Link href={`/cursos/${course.slug}`} className="text-primary font-black text-sm uppercase hover:underline">← Volver al curso</Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
          Checkout_Seguro
        </h1>

        <div className="flex flex-col md:flex-row gap-12 text-black">
          {/* Order Summary */}
          <div className="flex-1">
            <div className="bg-white border-4 border-black retro-shadow-lg p-8">
              <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">Resumen de Orden</h2>
              
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 bg-black flex-shrink-0 border-2 border-black flex items-center justify-center overflow-hidden">
                  {course.image_url ? (
                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-white opacity-50 text-3xl">inventory_2</span>
                  )}
                </div>
                <div>
                  <h3 className="font-black uppercase text-lg leading-tight mb-1">{course.title}</h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">ID: {course.id.split('-')[0]}</p>
                </div>
              </div>

              <div className="space-y-3 font-bold text-sm mb-6 border-y-2 border-slate-200 py-4">
                <div className="flex justify-between">
                  <span className="uppercase text-slate-600">Precio Base:</span>
                  <span>${course.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase text-slate-600">IVA (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between items-center text-primary">
                  <span className="uppercase flex items-center gap-1"><span className="material-symbols-outlined text-sm">loyalty</span> Descuento Aplicado:</span>
                  <span>-$0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="font-black uppercase text-lg">Total a Pagar:</span>
                <span className="font-black text-4xl">${course.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="flex-1">
            <div className="bg-white border-4 border-black p-8 retro-shadow-lg">
              <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">lock</span> Datos de Pago
              </h2>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="bg-slate-100 border-2 border-dashed border-slate-400 p-6 text-center mb-6">
                  <span className="material-symbols-outlined text-black text-4xl mb-2">account_balance_wallet</span>
                  <p className="font-bold text-sm uppercase">Procesado de forma segura por Stripe</p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">Nombre en la tarjeta</label>
                  <input type="text" required className="w-full bg-slate-100 border-2 border-black p-3 font-bold focus:bg-white focus:outline-none focus:border-primary" placeholder="EJ. JHON DOE" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase mb-1">Número de tarjeta</label>
                  <input type="text" required className="w-full bg-slate-100 border-2 border-black p-3 font-bold focus:bg-white focus:outline-none focus:border-primary" placeholder="**** **** **** ****" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-black uppercase mb-1">F. Exp (MM/YY)</label>
                    <input type="text" required className="w-full bg-slate-100 border-2 border-black p-3 font-bold focus:bg-white focus:outline-none focus:border-primary" placeholder="12/26" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-black uppercase mb-1">CVC / CVV</label>
                    <input type="text" required className="w-full bg-slate-100 border-2 border-black p-3 font-bold focus:bg-white focus:outline-none focus:border-primary" placeholder="***" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="w-5 h-5 mt-0.5 border-2 border-black accent-primary" />
                    <span className="text-xs font-bold leading-tight uppercase text-slate-600">Acepto los términos de servicio, política de privacidad y renuncio a mi derecho de retracto ya que es un producto digital de entrega inmediata.</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={processing}
                  className="w-full bg-primary text-black font-black uppercase py-4 border-4 border-black retro-btn mt-6 flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
                >
                  {processing ? 'Procesando...' : `Pagar $${course.price}`} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
