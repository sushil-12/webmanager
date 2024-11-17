const Dashboard = () => {
  const cards = [
    { id: 1, title: 'Websites', value: 3, icon: '👥' },
    { id: 2, title: 'Revenue', value: '$34,000', icon: '💰' },
    { id: 3, title: 'Users', value: 1, icon: '📝' },
    { id: 4, title: 'Messages', value: 134, icon: '📩' },
    { id: 5, title: 'Projects', value: 12, icon: '📊' },
    { id: 6, title: 'Tickets', value: 28, icon: '🎫' },
  ];

  return (
    <div className="main-container w-full overflow-hidden ">
      <div className="w-full flex items-center justify-between header-bar h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px]">
        <h3 className="page-titles">Dashboard</h3>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden px-5 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white shadow-md rounded-lg p-5 flex flex-col items-center justify-center text-center transition transform hover:scale-105"
            >
              <div className="text-4xl">{card.icon}</div>
              <h2 className="text-xl font-semibold mt-2">{card.title}</h2>
              <p className="text-lg text-gray-500 mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
