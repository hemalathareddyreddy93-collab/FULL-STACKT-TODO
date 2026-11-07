import { useState, useEffect } from 'react'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Personal')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTask = () => {
    if (!title.trim()) {
      alert('Type a task!')
      return
    }
    const newTask = {
      _id: Date.now(),
      title: title,
      category: category,
      completed: false,
      createdAt: new Date()
    }
    setTodos([newTask, ...todos])
    setTitle('')
  }

  const deleteTask = (id) => {
    setTodos(todos.filter(t => t._id !== id))
  }

  const toggleTask = (id) => {
    setTodos(todos.map(t => t._id === id ? { ...t, completed: !t.completed } : t))
  }

  const filtered = todos.filter(t => {
    if (filter === 'Completed') return t.completed
    if (filter === 'Pending') return !t.completed
    if (filter === 'Today') return true
    if (search) return t.title.toLowerCase().includes(search.toLowerCase())
    return true
  }).filter(t => {
    if (!search) return true
    return t.title.toLowerCase().includes(search.toLowerCase())
  })

  const count = (cat) => todos.filter(t => cat === 'All' ? true : t.category === cat).length

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      {/* SIDEBAR */}
      <div className="w-[260px] bg-white p-5 flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">📊</div>
          <div>
            <h2 className="font-bold text-sm">To-do Lists</h2>
            <p className="text-[11px] text-gray-400">Sat Nov 07 2026</p>
          </div>
        </div>

        <button onClick={() => { alert('Logged out!'); localStorage.clear(); window.location.reload(); }} className="w-full py-2.5 bg-[#fde2f3] text-pink-500 rounded-full text-sm mb-5">Logout</button>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-400 text-white rounded-[20px] p-4">
            <p className="text-2xl font-bold">{todos.length}</p>
            <p className="text-sm">All Tasks</p>
            <p className="text-xs opacity-80">{todos.length} items</p>
          </div>
          <div className="bg-[#f8f9ff] rounded-[20px] p-4">
            <p className="text-lg font-bold">{count('Personal')}</p>
            <p className="text-sm">Personal</p>
            <p className="text-xs text-gray-400">{count('Personal')} items</p>
          </div>
          <div className="bg-[#f8f9ff] rounded-[20px] p-4">
            <p className="text-lg font-bold">{count('My Work')}</p>
            <p className="text-sm">My Work</p>
            <p className="text-xs text-gray-400">{count('My Work')} items</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 bg-[#f5f7ff] rounded-l-[30px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hello, Hemalatha 👋</h1>
            <p className="text-sm text-gray-500">Manage your tasks smartly and stay productive.</p>
            <div className="flex gap-2 mt-4">
              {['All','Today','Pending','Overdue','Completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm border ${filter===f ? 'bg-blue-600 text-white' : 'bg-white'}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 rounded-full bg-white border text-sm">
              <option>Personal</option><option>My Work</option><option>Shopping</option><option>Others</option>
            </select>
            <button onClick={addTask} className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm">+ Add Task</button>
          </div>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search task by title..." className="w-full p-3 rounded-xl bg-[#eef2ff] mb-3 outline-none text-sm" />
        <input value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key==='Enter' && addTask()} placeholder="Type task and select category..." className="w-full p-3 rounded-xl bg-white mb-6 outline-none text-sm border" />

        <div className="space-y-2">
          {filtered.length === 0 ? <p className="text-center text-gray-400 mt-20 text-sm">No tasks found</p> :
            filtered.map(t => (
              <div key={t._id} className="bg-white p-3 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t._id)} />
                  <span className={`text-sm ${t.completed ? 'line-through text-gray-400' : ''}`}>{t.title}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{t.category}</span>
                </div>
                <button onClick={() => deleteTask(t._id)} className="text-red-400 text-xs">Delete</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App