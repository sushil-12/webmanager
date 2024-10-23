const Loader = ({ type = 'normal' }) => {
  return (
    <div className="flex-center">
      {/* Using conditional class and style based on the type */}
      <i className={`pi pi-spin pi-spinner ${type === 'main' ? 'text-primary-500' : type === 'list-loader' ? 'text-primary-500 absolute top-[50%]' : ''}`} style={{ fontSize: type === 'main' ? '4.5rem' : type === 'list-loader' ? '2.5rem' : '1.5rem' }}></i>
    </div>
  );
}

export default Loader;