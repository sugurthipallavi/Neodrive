import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'
import NeonButton from '../components/NeonButton'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Users' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'vehicles', label: 'Vehicles' },
  { id: 'messages', label: 'Messages' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
]

const field =
  'mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/40'

function CrudModal({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="glass-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-cyan-500/20 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="font-display text-xs uppercase tracking-[0.28em] text-cyan-100">{title}</h3>
          <button
            type="button"
            className="rounded-lg px-2 py-1 font-body text-sm text-slate-400 hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function apiErr(ex) {
  const d = ex?.response?.data
  if (d?.errors?.[0]?.msg) return d.errors[0].msg
  if (d?.error) return d.error
  return 'Request failed'
}

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [contacts, setContacts] = useState([])
  const [series, setSeries] = useState([])
  const [error, setError] = useState(null)

  const [vehicleModal, setVehicleModal] = useState(null)
  const [replyModal, setReplyModal] = useState(null)

  const loadCore = useCallback(async () => {
    try {
      const [s, v] = await Promise.all([api.get('/admin/stats'), api.get('/vehicles')])
      setStats(s.data)
      setVehicles(v.data)
      const chart = await api.get('/admin/analytics/bookings-by-month')
      setSeries(chart.data.map((d) => ({ name: d.month, bookings: d.count })))
    } catch {
      setError('Unable to load dashboard — verify token and API.')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (cancelled) return
      await loadCore()
    })()
    return () => {
      cancelled = true
    }
  }, [loadCore])

  const loadTab = useCallback(async () => {
    try {
      if (tab === 'users') {
        const res = await api.get('/admin/users')
        setUsers(res.data)
      }
      if (tab === 'bookings') {
        const res = await api.get('/bookings')
        setBookings(res.data)
      }
      if (tab === 'messages') {
        const res = await api.get('/contacts')
        setContacts(res.data)
      }
    } catch {
      setError('Forbidden or offline.')
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'users' || tab === 'bookings' || tab === 'messages') loadTab()
  }, [tab, loadTab])

  const statCards = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'Users', value: stats.users, accent: 'from-cyan-400/40 to-blue-600/30' },
      { label: 'Bookings', value: stats.bookings, accent: 'from-fuchsia-500/35 to-purple-900/30' },
      { label: 'Messages', value: stats.contacts, accent: 'from-pink-400/30 to-fuchsia-900/25' },
      { label: 'Vehicles', value: stats.vehicles, accent: 'from-emerald-400/25 to-cyan-900/25' },
    ]
  }, [stats])

  const submitReply = async (e) => {
    e.preventDefault()
    if (!replyModal) return
    try {
      await api.post(`/admin/contacts/${replyModal.id}/respond`, {
        response: replyModal.responseText,
      })
      setReplyModal(null)
      const res = await api.get('/contacts')
      setContacts(res.data)
      await loadCore()
    } catch (ex) {
      alert(apiErr(ex))
    }
  }

  const submitVehicle = async (e) => {
    e.preventDefault()
    if (!vehicleModal) return
    try {
      const payload = {
        slug: vehicleModal.slug.trim(),
        name: vehicleModal.name.trim(),
        price: Number(vehicleModal.price),
        top_speed: vehicleModal.top_speed || '',
        range: vehicleModal.range || '',
        horsepower: vehicleModal.horsepower || '',
        torque: vehicleModal.torque || '',
        image_url: vehicleModal.image_url || '',
      }
      if (vehicleModal.mode === 'create') {
        await api.post('/admin/vehicles', payload)
      } else {
        await api.put(`/admin/vehicles/${vehicleModal.id}`, payload)
      }
      setVehicleModal(null)
      await loadCore()
    } catch (ex) {
      alert(apiErr(ex))
    }
  }

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return
    try {
      await api.delete(`/admin/vehicles/${id}`)
      await loadCore()
    } catch (ex) {
      alert(apiErr(ex))
    }
  }

  return (
    <div className="min-h-screen bg-neo-black pt-24 text-white mesh-bg">
      <Navbar />
      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 pb-24 md:px-8">
        <aside className="glass-panel sticky top-28 hidden h-fit w-60 shrink-0 flex-col gap-2 rounded-2xl p-4 lg:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-xl px-4 py-3 text-left font-display text-[10px] uppercase tracking-[0.28em] transition ${
                tab === item.id
                  ? 'bg-gradient-to-r from-cyan-500/25 to-fuchsia-500/25 text-white shadow-neon-sm'
                  : 'text-slate-400 hover:bg-white/5 hover:text-cyan-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <NeonButton type="button" variant="ghost" className="mt-6 w-full !text-[9px]" onClick={logout}>
            Sign Out
          </NeonButton>
          <NeonButton type="button" className="w-full !text-[9px]" onClick={() => navigate('/')}>
            Site
          </NeonButton>
        </aside>

        <div className="min-w-0 flex-1 space-y-8">
          <div className="flex flex-wrap gap-3 lg:hidden">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-4 py-2 font-display text-[9px] uppercase tracking-widest ${
                  tab === item.id ? 'bg-cyan-500/30 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          {vehicleModal && (
            <CrudModal
              title={vehicleModal.mode === 'create' ? 'Add vehicle' : 'Edit vehicle'}
              onClose={() => setVehicleModal(null)}
            >
              <form className="space-y-3 text-left" onSubmit={submitVehicle}>
                <label className="block text-xs text-slate-400">
                  Slug (kebab-case)
                  <input
                    className={field}
                    value={vehicleModal.slug}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, slug: e.target.value }))}
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Name
                  <input
                    className={field}
                    value={vehicleModal.name}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, name: e.target.value }))}
                    required
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Price (USD)
                  <input
                    type="number"
                    min={0}
                    className={field}
                    value={vehicleModal.price}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, price: e.target.value }))}
                    required
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Top speed
                  <input
                    className={field}
                    value={vehicleModal.top_speed}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, top_speed: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Range
                  <input
                    className={field}
                    value={vehicleModal.range}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, range: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Horsepower
                  <input
                    className={field}
                    value={vehicleModal.horsepower}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, horsepower: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Torque
                  <input
                    className={field}
                    value={vehicleModal.torque}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, torque: e.target.value }))}
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Image URL
                  <input
                    className={field}
                    value={vehicleModal.image_url}
                    onChange={(e) => setVehicleModal((m) => ({ ...m, image_url: e.target.value }))}
                  />
                </label>
                <div className="flex flex-wrap gap-2 pt-2">
                  <NeonButton type="submit">{vehicleModal.mode === 'create' ? 'Create' : 'Save'}</NeonButton>
                  <NeonButton type="button" variant="ghost" onClick={() => setVehicleModal(null)}>
                    Cancel
                  </NeonButton>
                </div>
              </form>
            </CrudModal>
          )}

          {replyModal && (
            <CrudModal title="Respond to message" onClose={() => setReplyModal(null)}>
              <form className="space-y-4 text-left" onSubmit={submitReply}>
                <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                  <p className="font-display text-[9px] uppercase tracking-[0.25em] text-slate-500">From</p>
                  <p className="mt-1 text-white">
                    {replyModal.fromName} · {replyModal.fromEmail}
                  </p>
                  <p className="mt-3 font-display text-[9px] uppercase tracking-[0.25em] text-slate-500">
                    Their message
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-slate-300">{replyModal.originalMessage}</p>
                </div>
                <label className="block text-xs text-slate-400">
                  Your response (min 5 characters)
                  <textarea
                    className={`${field} min-h-[140px]`}
                    value={replyModal.responseText}
                    onChange={(e) => setReplyModal((m) => ({ ...m, responseText: e.target.value }))}
                    required
                    minLength={5}
                    maxLength={8000}
                    placeholder="Write a reply for your records. Use their email separately if you email them outside the app."
                  />
                </label>
                <div className="flex flex-wrap gap-2 pt-2">
                  <NeonButton type="submit">Save response</NeonButton>
                  <NeonButton type="button" variant="ghost" onClick={() => setReplyModal(null)}>
                    Cancel
                  </NeonButton>
                </div>
              </form>
            </CrudModal>
          )}

          {tab === 'dashboard' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((c) => (
                  <div
                    key={c.label}
                    className={`neo-reveal glass-panel rounded-2xl border border-white/10 bg-gradient-to-br ${c.accent} p-6`}
                  >
                    <p className="font-display text-[10px] uppercase tracking-[0.35em] text-slate-300">
                      {c.label}
                    </p>
                    <p className="mt-4 font-display text-4xl text-white">{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="neo-reveal glass-panel rounded-[28px] border border-cyan-500/15 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-lg uppercase tracking-[0.28em] text-cyan-100">
                    Booking Echo — 12 Mo
                  </h2>
                  <span className="font-body text-xs text-slate-500">Live SQLite telemetry</span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series}>
                      <defs>
                        <linearGradient id="fillNeo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          background: '#0f172a',
                          border: '1px solid rgba(34,211,238,0.25)',
                          borderRadius: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#fillNeo)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="neo-reveal glass-panel rounded-[28px] border border-white/10 p-6">
                <h2 className="mb-4 font-display text-lg uppercase tracking-[0.28em] text-fuchsia-100">
                  Recent Activity
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="font-display text-[10px] uppercase tracking-[0.25em] text-slate-500">
                      <tr>
                        <th className="pb-3">Vehicle</th>
                        <th className="pb-3">Guest</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {(stats?.recentBookings ?? []).map((b) => (
                        <tr key={b.id}>
                          <td className="py-3">{b.vehicle_model}</td>
                          <td className="py-3">{b.name}</td>
                          <td className="py-3">{b.date}</td>
                          <td className="py-3 text-xs text-slate-500">{b.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'users' && (
            <div className="glass-panel rounded-[28px] border border-white/10 p-6">
              <h2 className="mb-6 font-display text-lg uppercase tracking-[0.28em] text-cyan-100">Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="font-display text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    <tr>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="py-3">{u.name}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3 text-xs uppercase text-fuchsia-300">{u.role}</td>
                        <td className="py-3 text-xs text-slate-500">{u.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'bookings' && (
            <div className="glass-panel rounded-[28px] border border-white/10 p-6">
              <h2 className="mb-6 font-display text-lg uppercase tracking-[0.28em] text-cyan-100">Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead className="font-display text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    <tr>
                      <th className="pb-3">Vehicle</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Slot</th>
                      <th className="pb-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-3">{b.vehicle_model}</td>
                        <td className="py-3">{b.name}</td>
                        <td className="py-3">{b.email}</td>
                        <td className="py-3">{b.phone}</td>
                        <td className="py-3 text-xs">
                          {b.date} · {b.time}
                        </td>
                        <td className="py-3 text-xs text-slate-400">{b.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <NeonButton
                  type="button"
                  className="!px-4 !py-2 !text-[9px]"
                  onClick={() =>
                    setVehicleModal({
                      mode: 'create',
                      slug: '',
                      name: '',
                      price: '',
                      top_speed: '',
                      range: '',
                      horsepower: '',
                      torque: '',
                      image_url: '',
                    })
                  }
                >
                  Add vehicle
                </NeonButton>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {vehicles.map((v) => (
                  <div key={v.id} className="glass-panel overflow-hidden rounded-[24px] border border-cyan-500/15">
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${v.image_url})` }}
                    />
                    <div className="space-y-2 p-6 text-left">
                      <h3 className="font-display text-lg uppercase tracking-[0.2em]">{v.name}</h3>
                      <p className="font-body text-sm text-slate-400">
                        {v.top_speed} · {v.range}
                      </p>
                      <p className="font-display text-xl text-white">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(v.price)}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <NeonButton
                          type="button"
                          variant="ghost"
                          className="!px-4 !py-2 !text-[9px]"
                          onClick={() =>
                            setVehicleModal({
                              mode: 'edit',
                              id: v.id,
                              slug: v.slug,
                              name: v.name,
                              price: String(v.price),
                              top_speed: v.top_speed || '',
                              range: v.range || '',
                              horsepower: v.horsepower || '',
                              torque: v.torque || '',
                              image_url: v.image_url || '',
                            })
                          }
                        >
                          Edit
                        </NeonButton>
                        <NeonButton
                          type="button"
                          variant="ghost"
                          className="!px-4 !py-2 !text-[9px] !text-rose-200"
                          onClick={() => deleteVehicle(v.id)}
                        >
                          Delete
                        </NeonButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'messages' && (
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c.id} className="glass-panel rounded-2xl border border-white/10 p-6 text-left">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-300">
                        {c.email}
                      </p>
                      <p className="mt-2 font-body text-lg text-white">{c.name}</p>
                      <p className="mt-3 font-body text-sm text-slate-400">{c.message}</p>
                      <p className="mt-4 text-xs text-slate-600">{c.created_at}</p>
                      {c.admin_response ? (
                        <div className="mt-5 rounded-xl border border-fuchsia-500/20 bg-fuchsia-950/20 p-4">
                          <p className="font-display text-[9px] uppercase tracking-[0.28em] text-fuchsia-200">
                            Admin response
                            {c.responded_at ? (
                              <span className="ml-2 font-body font-normal normal-case text-slate-500">
                                · {c.responded_at}
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-2 whitespace-pre-wrap font-body text-sm text-slate-200">
                            {c.admin_response}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex shrink-0">
                      <NeonButton
                        type="button"
                        variant="ghost"
                        className="!px-3 !py-2 !text-[9px]"
                        onClick={() =>
                          setReplyModal({
                            id: c.id,
                            fromName: c.name,
                            fromEmail: c.email,
                            originalMessage: c.message,
                            responseText: c.admin_response || '',
                          })
                        }
                      >
                        {c.admin_response ? 'Update response' : 'Respond'}
                      </NeonButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'analytics' && (
            <div className="glass-panel rounded-[28px] border border-fuchsia-500/15 p-6">
              <h2 className="mb-6 font-display text-lg uppercase tracking-[0.28em] text-fuchsia-100">
                Analytics Core
              </h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        border: '1px solid rgba(232,121,249,0.25)',
                        borderRadius: 12,
                      }}
                    />
                    <Area
                      type="step"
                      dataKey="bookings"
                      stroke="#e879f9"
                      strokeWidth={2}
                      fill="rgba(232,121,249,0.15)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="glass-panel rounded-[28px] border border-white/10 p-8 text-left">
              <h2 className="font-display text-lg uppercase tracking-[0.28em] text-cyan-100">
                Settings
              </h2>
              <p className="mt-4 max-w-xl font-body text-sm text-slate-400">
                Fleet telemetry routing, holographic theme seeds, and JWT rotation policies plug in here —
                production installs should bind managed secrets and rotate keys on schedule.
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-5 font-body text-sm text-slate-500">
                <li>JWT expiry currently set to 7 days for demo velocity.</li>
                <li>
                  SQLite path: <code className="text-cyan-300">server/neodrive.db</code>
                </li>
                <li>
                  Copy <code className="text-cyan-300">server/.env.example</code> to{' '}
                  <code className="text-cyan-300">.env</code>.
                </li>
                <li>
                  Admin APIs: vehicle CRUD and contact responses under{' '}
                  <code className="text-cyan-300">/api/admin/*</code> (JWT admin).
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
