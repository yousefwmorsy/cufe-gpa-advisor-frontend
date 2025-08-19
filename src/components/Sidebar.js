
const navItems = [
  { label: 'Home', key: 'home' },
  { label: 'Manage Grades', key: 'transcript' },
  { label: 'GPA Insights', key: 'insights' },
  { label: 'GPA Simulation', key: 'simulation' },
  { label: 'AI Advisor', key: 'advisor' }
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="w-[220px] bg-navy text-gray-100 h-screen flex flex-col items-center pt-8 shadow-lg font-mono">
      <div className="font-bold text-2xl mb-10 text-accent tracking-wide drop-shadow-lg">GPA Advisor</div>
      {navItems.map(item => (
        <button
          key={item.key}
          onClick={() => setCurrentPage(item.key)}
          className={`w-11/12 py-3 px-6 my-2 rounded-lg text-lg transition-all font-mono outline-none
            ${currentPage === item.key ? 'bg-dark text-white font-bold shadow-accent shadow-md' : 'bg-transparent text-gray-100'}
            hover:bg-accent hover:text-white hover:shadow-lg`}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}
